import middleware from "@/api/middleware";
import fs from "fs";
import path from "path";
import cors from "buncors";

function initRoutes(app) {
  //Allow all origins in development mode
  if (process.env.DEV_MODE) {
    app.use(cors({ allowedHeaders: ["Content-Type", "Authorization"] }));
  }
  app.use(middleware);
  const routesDir = path.resolve(process.cwd(), "api");

  function registerRoutesRecursively(currentDir, baseRoute = "") {
    fs.readdirSync(currentDir, { withFileTypes: true }).forEach((dirent) => {
      const fullPath = path.join(currentDir, dirent.name);

      if (dirent.isDirectory()) {
        // Recursively process subdirectories
        registerRoutesRecursively(fullPath, `${baseRoute}/${dirent.name}`);
      } else if (
        dirent.isFile() &&
        dirent.name.endsWith(".ts") &&
        dirent.name !== "middleware.ts"
      ) {
        const routePath = `/api${baseRoute}/${path.basename(dirent.name, ".ts")}`;

        import(fullPath)
          .then((module) => {
            const handler = module.default;
            handler(app, routePath);
            app.options(
              routePath,
              cors({ allowedHeaders: ["Content-Type", "Authorization"] }),
            );
            console.log("Registered API Route: " + routePath);
          })
          .catch((err) => {
            console.error(`Failed to load route from ${fullPath}:`, err);
          });
      }
    });
  }

  registerRoutesRecursively(routesDir);
}

export default initRoutes;
