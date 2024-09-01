import { validateUser } from "@/lib/utils";
import { query } from "@/lib/db";

async function getChatHistory(locationId: number, limit: number = 50) {
  const messages = await query(
    `
    SELECT m.*, u.username as author_name
    FROM messages m
    JOIN users u ON m.author_id = u.id
    WHERE m.location_id = $1
    ORDER BY m.timestamp DESC
    LIMIT $2
    `,
    [locationId, limit],
  );
  return messages.reverse();
}

export default function handler(app, route) {
  app.get(route, async (req, res) => {
    try {
      // Validate the user based on headers
      const user = await validateUser(req.headers);
      if (!user) {
        return res
          .status(401)
          .json({ error: "Invalid or expired session token" });
      }

      // Get the locationId from query parameters
      const locationId = parseInt(req.query.locationId as string, 10);

      // Validate locationId
      if (isNaN(locationId)) {
        return res.status(400).json({ error: "Invalid locationId" });
      }

      // Get chat history
      const history = await getChatHistory(locationId);

      // Return chat history
      res.status(200).json(history);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });
}
