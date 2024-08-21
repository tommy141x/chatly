// routes/api/logout.ts
import { query } from "@/lib/db";

export default function handler(app, route) {
  app.post(route, async (req, res) => {
    const sessionToken = req.headers.authorization?.split(" ")[1];

    if (!sessionToken) {
      return res.status(400).json({ error: "No session token provided" });
    }

    try {
      // Remove the session token from the database
      await query(
        "UPDATE users SET sessions = sessions - $1 WHERE id = (SELECT user_id FROM sessions WHERE token = $1)",
        [sessionToken],
      );

      res.json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ error: "An error occurred while logging out" });
    }
  });
}
