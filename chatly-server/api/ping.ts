import { query } from "@/lib/db";

export default function handler(app, route) {
  app.get(route, async (req, res) => {
    res.json({
      server_name: process.env.SERVER_NAME,
      server_description: process.env.SERVER_DESCRIPTION,
    });
  });
}
