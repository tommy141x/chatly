import { validateUser } from "@/lib/utils";

export default function handler(app, route) {
  app.get(route, async (req, res) => {
    try {
      // Validate the user based on headers
      const user = await validateUser(req.headers);

      if (user) {
        // If user is valid, return the API key and secret
        return res.json({
          server_name: process.env.SERVER_NAME,
          server_description: process.env.SERVER_DESCRIPTION,
          api_key: process.env.API_KEY,
          api_secret: process.env.API_SECRET,
        });
      } else {
        // If user is invalid or token is expired, return the server name and description
        // TODO: Return version number from package.json
        return res.json({
          server_name: process.env.SERVER_NAME,
          server_description: process.env.SERVER_DESCRIPTION,
        });
      }
    } catch (error) {
      console.error("Error validating session token:", error);
      // Return a generic server name and description if there is an error
      return res.json({
        server_name: process.env.SERVER_NAME,
        server_description: process.env.SERVER_DESCRIPTION,
      });
    }
  });
}
