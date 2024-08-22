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
      // Delete the session with the given token
      const result = await query(
        "DELETE FROM sessions WHERE id = $1 RETURNING *",
        [token],
      );

      if (result.length === 0) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while logging out" });
    }
  });
}
