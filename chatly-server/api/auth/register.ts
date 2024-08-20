// routes/api/register.js
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
      // Check if the username already exists
      const existingUser = await query(
        "SELECT * FROM users WHERE username = $1",
        [username],
      );
      if (existingUser.length > 0) {
        return res.status(409).json({ error: "Username already exists" });
      }

      // Hash the password - happens client side
      //const hashedPassword = await Bun.password.hash(password);

      // Insert the new user into the database
      await query("INSERT INTO users (username, password) VALUES ($1, $2)", [
        username,
        password,
      ]);

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while registering the user" });
    }
  });
}
