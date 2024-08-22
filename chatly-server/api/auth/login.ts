// routes/api/login.ts
import { query } from "@/lib/db";

export default function handler(app, route) {
  app.post(route, async (req, res) => {
    const { user: emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res
        .status(400)
        .json({ error: "Email/username and password are required" });
    }
    try {
      // Fetch user from the database
      const [user] = await query(
        "SELECT * FROM users WHERE email = $1 OR username = $1",
        [emailOrUsername],
      );
      if (!user) {
        return res.status(401).json({ error: "Invalid user or password" });
      }
      // Verify password
      const isMatch = await Bun.password.verify(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid user or password" });
      }

      // Create a new session for the user
      const [session] = await query(
        "INSERT INTO sessions (user_id) VALUES ($1) RETURNING id",
        [user.id],
      );

      res.json({ sessionToken: session.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while logging in" });
    }
  });
}
