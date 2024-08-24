// @/api/auth/signup.ts
import { query } from "@/lib/db";

export default function handler(app, route) {
  app.post(route, async (req, res) => {
    const { username, displayName, password, device } = req.body;
    if (!displayName || !username || !password || !device) {
      return res.status(400).json({
        error: "Username, display name, device, and password are required",
      });
    }
    try {
      // Check if the username or email already exists
      const [existingUser] = await query(
        "SELECT * FROM users WHERE username = $1",
        [username],
      );
      if (existingUser) {
        if (existingUser.username === username) {
          return res.status(409).json({ error: "Username already exists" });
        }
      }

      const hashedPassword = await Bun.password.hash(password);

      // Insert the new user into the database and return the id
      const [newUser] = await query(
        "INSERT INTO users (display_name, username, password) VALUES ($1, $2, $3) RETURNING id",
        [displayName, username, hashedPassword],
      );

      // Create a new session for the user
      const [session] = await query(
        "INSERT INTO sessions (user_id, device) VALUES ($1, $2) RETURNING id",
        [newUser.id, device],
      );

      res.status(201).json({
        message: "User registered successfully",
        sessionToken: session.id,
      });
    } catch (error) {
      console.error("An error occurred while registering the user", error);
      res
        .status(500)
        .json({ error: "An error occurred while registering the user" });
    }
  });
}
