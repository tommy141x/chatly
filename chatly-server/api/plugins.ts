import { validateUser } from "@/lib/utils";
import { query } from "@/lib/db";
import { join, normalize } from "path";
import fs from "fs/promises";

const pluginsDir = join(process.cwd(), "plugins");

export default function handler(app, route) {
  app.get(route, async (req, res) => {
    try {
      const user = await validateUser(req.headers);
      if (user || true) {
        const requestedPlugins = process.env.PLUGINS?.split("|") || [];
        const allPlugins = await getPlugins();

        const filteredPlugins = allPlugins.filter((plugin) =>
          requestedPlugins.includes(plugin.name),
        );

        res.status(200).json(filteredPlugins);
      } else {
        res.status(401).json({ error: "Invalid or expired session token" });
      }
    } catch (error) {
      console.error("Error in handler:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

async function getPlugins() {
  async function readdirRecursive(dir) {
    const items = await fs.readdir(dir);
    const files = [];
    for (const item of items) {
      const fullPath = join(dir, item);
      const stats = await fs.stat(fullPath);
      const normalizedPath = normalize(fullPath);
      if (stats.isDirectory()) {
        files.push(...(await readdirRecursive(normalizedPath)));
      } else {
        files.push(normalizedPath);
      }
    }
    return files;
  }

  const dirs = await fs.readdir(pluginsDir);
  return (
    await Promise.all(
      dirs.map(async (dir) => {
        const pluginDir = join(pluginsDir, dir);
        try {
          const filePaths = await readdirRecursive(pluginDir);
          const pluginContents = await Promise.all(
            filePaths.map(async (filePath) => {
              const relativePath = filePath
                .replace(pluginsDir + "\\" + dir + "\\", "")
                .replace(/\\/g, "/");
              let content = await Bun.file(filePath).text();
              return {
                filename: relativePath,
                content: content,
                type: Bun.file(filePath).type,
              };
            }),
          );
          return { name: dir, contents: pluginContents };
        } catch (error) {
          console.error(`Error reading plugin ${pluginDir}:`, error);
        }
        return null;
      }),
    )
  ).filter(Boolean);
}
