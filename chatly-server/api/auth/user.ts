import { validateUser } from "@/lib/utils";

export default function handler(app, route) {
  app.get(route, async (req, res) => {
    // Validate the user based on headers
    const user = await validateUser(req.headers);

    if (user) {
      // If user is valid, return the user data
      res.json(user);
    } else {
      // If user is invalid or token is expired, return an error
      res.status(401).json({ error: "Invalid or expired session token" });
    }
  });
}
