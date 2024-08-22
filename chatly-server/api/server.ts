import { validateUser } from "@/lib/utils";
import { query } from "@/lib/db";

export default function handler(app, route) {
  app.post(route, async (req, res) => {
    try {
      const user = await validateUser(req.headers);
      if (!user) {
        return res
          .status(401)
          .json({ error: "Invalid or expired session token" });
      }
      const { name, bio } = req.body;

      const categories = [
        { id: 1, name: "Welcome" },
        { id: 2, name: "Lounge" },
      ];

      // Channels reference categories by ID
      const channels = [
        { name: "general", type: "text", category: 1 },
        { name: "voice", type: "voice", category: 2 },
      ];

      const roles = [];

      // Insert new server
      const [newServer] = await query(
        `
        INSERT INTO servers (name, bio, owner_id, categories, roles)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `,
        [name, bio, user.id, categories, roles],
      );

      // Add owner to server_relationships
      await query(
        `
        INSERT INTO server_relationships (user_id, server_id)
        VALUES ($1, $2, $3)
        `,
        [user.id, newServer.id, []],
      );

      res.status(201).json({
        id: newServer.id,
        name,
        bio,
        owner_id: user.id,
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
        SELECT s.*,
               (SELECT JSON_AGG(user_id)
                FROM server_relationships
                WHERE server_id = s.id) AS members
        FROM servers s
        WHERE s.id = $1
        `,
        [id],
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
