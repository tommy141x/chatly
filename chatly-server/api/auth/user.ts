// routes/api/user.js
import { query } from "@/lib/db";

export default function handler(app, route) {
  app.get(route, async (req, res) => {
    const sessionToken = req.headers.authorization?.split(" ")[1];

    if (!sessionToken) {
      return res.status(401).json({ error: "No session token provided" });
    }

    try {
      // Fetch session and user data
      const sessions = await query(
        "SELECT users.* FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.token = $1",
        [sessionToken],
      );

      if (sessions.length === 0) {
        return res.status(401).json({ error: "Invalid session token" });
      }

      const user = sessions[0];

      // Remove sensitive information
      delete user.password;

      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching user data" });
    }
  });
}
