// routes/api/login.js
import { query } from "@/lib/db";

export default function handler(app, route) {
  app.post(route, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    try {
      // Fetch user from the database
      const users = await query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
      if (users.length === 0) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const user = users[0];

      // Verify password
      const isMatch = await Bun.password.verify(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Generate session token using Bun.CryptoHasher
      const hasher = new Bun.CryptoHasher("sha256");
      hasher.update(username);
      hasher.update(Date.now().toString());
      hasher.update(Bun.hash(Math.random().toString())); // Add some randomness
      const sessionToken = hasher.digest("hex");

      // Store session token in the database
      await query("INSERT INTO sessions (user_id, token) VALUES ($1, $2)", [
        user.id,
        sessionToken,
      ]);

      res.json({ sessionToken });
    } catch (error) {
      res.status(500).json({ error: "An error occurred while logging in" });
    }
  });
}
