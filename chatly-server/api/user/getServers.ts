import { validateUser } from "@/lib/utils";
import { query } from "@/lib/db";

export default function handler(app, route) {
  app.get(route, async (req, res) => {
    try {
      // Validate the user
      const user = await validateUser(req.headers);
      if (!user) {
        return res
          .status(401)
          .json({ error: "Invalid or expired session token" });
      }

      // Fetch server IDs for the user
      const servers = await query(
        `
        SELECT server_id
        FROM server_relationships
        WHERE user_id = $1
        `,
        [user.id],
      );

      // Extract server IDs from the query result
      const serverIds = servers.map((server) => server.server_id);

      // Return the server IDs
      res.json({ servers: serverIds });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch servers" });
    }
  });
}
