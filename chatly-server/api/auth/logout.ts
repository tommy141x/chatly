// routes/api/logout.ts
import { query } from "@/lib/db";

export default function handler(app, route) {
  app.post(route, async (req, res) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .json({ error: "No authorization header provided" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      // Find the user with the given session token
      const result = await query(
        `
          SELECT *
          FROM users
          WHERE sessions ? '${token}'
        `,
      );

      if (result.length === 0) {
        return res.status(404).json({ error: "Session not found" });
      }
      const user = result[0];

      // Remove the session from the user's sessions
      const updatedSessions = { ...user.sessions };
      delete updatedSessions[token];

      // Update the user's sessions in the database
      await query("UPDATE users SET sessions = $1 WHERE id = $2", [
        updatedSessions,
        user.id,
      ]);

      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while logging out" });
    }
  });
}
