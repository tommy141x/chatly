// @/api/auth/signup.ts
import { query } from "@/lib/db";

export default function handler(app, route) {
  app.post(route, async (req, res) => {
    const { username, displayName, password, email } = req.body;
    if (!username || !displayName || !password || !email) {
      return res.status(400).json({
        error: "Username, display name, password, and email are required",
      });
    }
    try {
      // Check if the username or email already exists
      const [existingUser] = await query(
        "SELECT * FROM users WHERE username = $1 OR email = $2",
        [username, email],
      );
      if (existingUser) {
        if (existingUser.username === username) {
          return res.status(409).json({ error: "Username already exists" });
        }
        if (existingUser.email === email) {
          return res.status(409).json({ error: "Email already exists" });
        }
      }

      const hashedPassword = await Bun.password.hash(password);

      // Insert the new user into the database and return the id
      const [newUser] = await query(
        "INSERT INTO users (display_name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [displayName, username, email, hashedPassword],
      );

      // Create a new session for the user
      const [session] = await query(
        "INSERT INTO sessions (user_id) VALUES ($1) RETURNING id",
        [newUser.id],
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
