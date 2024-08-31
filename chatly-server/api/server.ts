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

      const defaultLayout = [
        {
          categoryName: "Welcome",
          channels: [
            { name: "general", type: "text" },
            { name: "voice", type: "voice" },
          ],
        },
      ];

      const roles = [];

      // Insert new server
      const [newServer] = await query(
        `
        INSERT INTO servers (name, bio, owner_id, layout, roles)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `,
        [name, bio, user.id, defaultLayout, roles],
      );

      // Add owner to server_relationships
      await query(
        `
        INSERT INTO server_relationships (user_id, server_id, roles)
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

      // If no server id is provided, return all servers where user_id equals user.id
      if (!id) {
        const servers = await query(
          `
          SELECT s.id, s.name, s.bio
          FROM servers s
          WHERE s.id IN (
            SELECT sr.server_id
            FROM server_relationships sr
            WHERE sr.user_id = $1
          )
          `,
          [user.id],
        );

        return res.json(servers);
      }

      // If server id is provided, return the specific server
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
