import { $, file } from "bun";
import { mkdir, writeFile, readdir, rm, readFile } from "fs/promises";
import { join } from "path";

let endpoint =
  (process.env.DEV_MODE == "true"
    ? "http://localhost:4000"
    : "https://api.example.com") + "/api/plugins";
const pluginsDir = "./plugins";

const initPlugins = async () => {
  const requestedPlugins = process.env.PLUGINS?.split("|") || [];
  let licenseKey = process.env.LICENSE_KEY;
  if (!licenseKey) {
    console.error("License key not provided");
    licenseKey = "";
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: licenseKey },
    });

    if (await isEndpointOnline(endpoint)) {
      const data = await response.json();

      if (data.key && data.key !== licenseKey) {
        await updateEnvFile(data.key);
        licenseKey = data.key;
      }

      await clearPluginsFolder();
      await decryptAndSavePlugins(data, licenseKey);
      await runPlugins(requestedPlugins);
    } else {
      console.error("Endpoint is not online");
    }
  } catch (error) {
    console.error("Error initializing plugins:", error);
  }
};

async function updateEnvFile(newKey: string) {
  const envPath = join(process.cwd(), ".env");
  try {
    let envContent = await readFile(envPath, "utf-8");
    envContent = envContent.replace(
      /^LICENSE_KEY=.*$/m,
      `LICENSE_KEY=${newKey}`,
    );
    await writeFile(envPath, envContent, "utf-8");
    console.log("Updated LICENSE_KEY in .env file");
  } catch (error) {
    console.error("Error updating .env file:", error);
  }
}

async function isEndpointOnline(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
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
    console.error("Error clearing plugins folder:", error);
  }
}

async function decryptAndSavePlugins(response, key) {
  const { plugins, license } = response;
  await writeFile(join(pluginsDir, "LICENSE"), license, "utf-8");
  for (const plugin of plugins) {
    const pluginDir = join(pluginsDir, plugin.name);
    await mkdir(pluginDir, { recursive: true });
    for (const file of plugin.contents) {
      const decryptedContent = decryptContent(file.content, key);
      const deobfuscatedContent = removeWatermark(decryptedContent);
      await writeFile(join(pluginDir, file.filename), deobfuscatedContent);
    }
  }
}

function decryptContent(encryptedContent, key) {
  const [ivHex, cipherTextHex] = encryptedContent.split(":");
  const iv = new Uint8Array(Buffer.from(ivHex, "hex"));
  const cipherText = new Uint8Array(Buffer.from(cipherTextHex, "hex"));
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(key);
  const keyHash = hasher.digest();
  const decipher = new Bun.CryptoHasher("aes-256-cbc");
  decipher.update(iv);
  decipher.update(keyHash);
  decipher.update(cipherText);
  return decipher.digest();
}

function removeWatermark(content) {
  const watermarkLength = Buffer.from(`/* Licensed */\n`).length;
  return content.slice(watermarkLength);
}

async function runPlugins(requestedPlugins) {
  const dirs = await readdir(pluginsDir);
  for (const dir of dirs) {
    if (requestedPlugins.length === 0 || requestedPlugins.includes(dir)) {
      const serverFile = join(pluginsDir, dir, "server.ts");
      try {
        const plugin = await import(serverFile);
        if (typeof plugin.default === "function") {
          await plugin.default();
        }
      } catch (error) {
        console.error(`Error running plugin ${dir}:`, error);
      }
    }
  }
}

// Below this should be obfuscated
const removeRefs = async () => {
  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
    });
    if (await isEndpointOnline(endpoint)) {
      await clearPluginsFolder();
    } else {
      console.error("Endpoint is not online");
    }
  } catch (error) {}
};

// Handle process signals
process.on("SIGINT", removeRefs);
process.on("SIGTERM", removeRefs);
process.on("exit", removeRefs);

export default initPlugins;
