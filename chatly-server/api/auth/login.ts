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

      // Generate session token
      const hasher = new Bun.CryptoHasher("sha256");
      hasher.update(user.username);
      hasher.update(Date.now().toString());
      hasher.update(Bun.hash(Math.random().toString()).toString()); // Add some randomness
      const sessionToken = hasher.digest("hex");

      // Modify the user object to include the session token
      const updatedSessions = {
        ...user.sessions,
        [sessionToken]: { expiresAt: Date.now() + 3600000 },
      };

      // Update the session object in the db
      await query("UPDATE users SET sessions = $1 WHERE id = $2", [
        updatedSessions,
        user.id,
      ]);

      // Store session token in the database
      res.json({ sessionToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while logging in" });
    }
  });
}
