import middleware from "@/api/middleware";
import fs from "fs";
import path from "path";

function initRoutes(app) {
  app.use(middleware);
  const routesDir = path.resolve(process.cwd(), "api");
  fs.readdirSync(routesDir).forEach((file) => {
    const filePath = path.join(routesDir, file);
    if (file.endsWith(".ts") && file !== "middleware.ts") {
      const routePath = `/api/${path.basename(file, ".ts")}`;
      import(filePath)
        .then((module) => {
          const handler = module.default;
          handler(app, routePath);
          console.log("Registered API Route: " + `${routePath}`);
        })
        .catch((err) => {
          console.error(`Failed to load route from ${filePath}:`, err);
        });
    }
  });
}

export default initRoutes;
