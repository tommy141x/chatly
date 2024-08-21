import { validateUser } from "@/lib/utils";

/*
How to validate if the request is from a logged in user or not

const user = await validateUser(req.headers);

if (user) {
  // If user is valid, return the user data
  res.json(user);
} else {
  // If user is invalid or token is expired, return an error
  res.status(401).json({ error: "Invalid or expired session token" });
}

*/

export default function handler(app, route) {
  app.post(route, async (req, res) => {
    //create server
  });
  app.get(route, async (req, res) => {
    //fetch server info
  });
}
