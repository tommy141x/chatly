import { validateUser } from "@/lib/utils";
import { query } from "@/lib/db";

export default function handler(app, route) {
  app.post(route, async (req, res) => {
    // Create a new server
    try {
      const user = await validateUser(req.headers);
      if (!user) {
        return res
          .status(401)
          .json({ error: "Invalid or expired session token" });
      }

      const { name, bio, categories, channels, roles } = req.body;
      const members = JSON.stringify([user.id]);

      await query(
        `
        INSERT INTO servers (name, bio, owner_id, members, categories, channels, roles)
        VALUES (${name}, ${bio}, ${user.id}, ${members}, ${JSON.stringify(categories)}, ${JSON.stringify(channels)}, ${JSON.stringify(roles)})
        `,
        [],
      );

      res
        .status(201)
        .json({
          id,
          name,
          bio,
          owner_id: user.id,
          members: [user.id],
          categories,
          channels,
          roles,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create server" });
    }
  });

  app.get(route, async (req, res) => {
    // Fetch server information
    try {
      const user = await validateUser(req.headers);
      if (!user) {
        return res
          .status(401)
          .json({ error: "Invalid or expired session token" });
      }

      const { id } = req.query;
      const [server] = await query(
        `
        SELECT * FROM servers WHERE id = ${id}
        `,
        [],
      );

      if (!server) {
        return res.status(404).json({ error: "Server not found" });
      }

      res.json(server);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch server" });
    }
  });
}
