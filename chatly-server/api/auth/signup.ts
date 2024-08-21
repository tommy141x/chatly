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

      // Generate session token
      const hasher = new Bun.CryptoHasher("sha256");
      hasher.update(username);
      hasher.update(Date.now().toString());
      hasher.update(Bun.hash(Math.random().toString()).toString()); // Add some randomness
      const sessionToken = hasher.digest("hex");

      const hashedPassword = await Bun.password.hash(password);

      // Insert the new user into the database
      await query(
        "INSERT INTO users (display_name, username, email, password, sessions) VALUES ($1, $2, $3, $4, $5)",
        [
          displayName,
          username,
          email,
          hashedPassword,
          {
            [sessionToken]: { expiresAt: Date.now() + 3600000 },
          },
        ],
      );

      res
        .status(201)
        .json({ message: "User registered successfully", sessionToken });
    } catch (error) {
      console.error("An error occurred while registering the user", error);
      res
        .status(500)
        .json({ error: "An error occurred while registering the user" });
    }
  });
}
