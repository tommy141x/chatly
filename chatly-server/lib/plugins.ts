import { $, file } from "bun";
import { mkdir, writeFile, readdir, rm, readFile } from "fs/promises";
import { join, dirname } from "path";
import { query } from "@/lib/db";
import { validateUser } from "@/lib/utils";

let endpoint =
  (process.env.DEV_MODE == "true"
    ? "http://localhost:4000"
    : "https://api.example.com") + "/api/plugins";
const pluginsDir = join(process.cwd(), "plugins");

const initPlugins = async (app) => {
  const requestedPlugins = process.env.PLUGINS?.split("|") || [];
  const subFeaturePlugins =
    process.env.SUBSCRIPTION_FEATURE_PLUGINS?.split("|") || [];
  let licenseKey = process.env.LICENSE_KEY;
  if (!licenseKey) {
    licenseKey = "";
  }

  try {
    if (await isEndpointOnline(endpoint)) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${licenseKey}` },
      });
      const data = await response.json();

      if (data.key && data.key !== licenseKey) {
        await updateEnvFile(data.key);
        licenseKey = data.key;
      }

      await clearPluginsFolder();
      await savePlugins(data);
    } else {
      console.error("Marketplace is not online, unable to get plugin updates.");
    }
    await updatePluginEnvs(requestedPlugins, subFeaturePlugins, pluginsDir);
    await runPlugins(requestedPlugins, app);
  } catch (error) {
    console.error("Error starting plugins:", error);
  }
};

async function updatePluginEnvs(
  requestedPlugins,
  subFeaturePlugins,
  pluginsDir,
) {
  for (const plugin of requestedPlugins) {
    const isSubFeature = subFeaturePlugins.includes(plugin);
    const envPath = join(pluginsDir, plugin, ".env");

    try {
      // Read the current .env file
      let envContent = await readFile(envPath, "utf-8");

      // Split the content into lines
      const lines = envContent.split("\n");

      // Find and update the SUBSCRIPTION_FEATURE_ENABLED line
      const updatedLines = lines.map((line) => {
        if (line.startsWith("SUBSCRIPTION_FEATURE_ENABLED=")) {
          return `SUBSCRIPTION_FEATURE_ENABLED=${isSubFeature}`;
        }
        return line;
      });

      // If SUBSCRIPTION_FEATURE_ENABLED wasn't found, add it
      if (
        !lines.some((line) => line.startsWith("SUBSCRIPTION_FEATURE_ENABLED="))
      ) {
        updatedLines.push(`SUBSCRIPTION_FEATURE_ENABLED=${isSubFeature}`);
      }

      // Join the lines back into a single string
      const updatedEnvContent = updatedLines.join("\n");

      // Write the updated content back to the .env file using Bun.write
      await Bun.write(envPath, updatedEnvContent);
    } catch (error) {}
  }
}

async function updateEnvFile(newKey: string) {
  const envPath = join(process.cwd(), ".env");
  try {
    let envContent = await readFile(envPath, "utf-8");
    envContent = envContent.replace(
      /^LICENSE_KEY=.*$/m,
      `LICENSE_KEY=${newKey}`,
    );
    await writeFile(envPath, envContent, "utf-8");
    console.log("Updated .env file with re-issued license key.");
  } catch (error) {
    console.log("New re-issued license key:", newKey);
    console.error(
      "YOUR LICENSE KEY WAS RE-ISSUED AND THERE WAS AN ERROR UPDATING IT",
      error,
    );
  }
}

async function isEndpointOnline(url) {
  try {
    const response = await fetch(url, { method: "GET" });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function clearPluginsFolder() {
  try {
    await rm(pluginsDir, { recursive: true, force: true });
    await mkdir(pluginsDir, { recursive: true });
  } catch (error) {
    console.error("Error cleaning plugins folder:", error);
  }
}

async function savePlugins(response) {
  const { plugins } = response;
  for (const plugin of plugins) {
    const pluginDir = join(pluginsDir, plugin.name);

    for (const file of plugin.contents) {
      const filePath = join(pluginDir, file.filename);
      const fileDir = dirname(filePath);

      // Create all necessary directories
      await mkdir(fileDir, { recursive: true });

      // Write the file
      await Bun.write(filePath, file.content);
    }
  }
}

async function runPlugins(requestedPlugins, app) {
  const dirs = await readdir(pluginsDir);
  for (const dir of dirs) {
    if (requestedPlugins.includes(dir)) {
      const serverFile = join(pluginsDir, dir, "server.ts");
      try {
        const plugin = await import(serverFile);
        if (typeof plugin.default === "function") {
          await plugin.default(app, query, validateUser);
        }
      } catch (error) {
        console.error(`Error starting plugin ${dir}:`, error);
      }
    }
  }
}

const removeRefs = async () => {
  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
    });
    if (await isEndpointOnline(endpoint)) {
      await clearPluginsFolder();
    }
  } catch (error) {}
};

// Handle process signals
process.on("SIGINT", removeRefs);
process.on("SIGTERM", removeRefs);
process.on("exit", removeRefs);

export default initPlugins;
