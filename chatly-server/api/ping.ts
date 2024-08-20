import { query } from "@/lib/db";
import { validateToken } from "@/lib/utils";

export default async function handler(app, route) {
  app.get(route, async (req, res) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const [authType, sessionToken] = authHeader.split(" ");

      if (authType === "Bearer") {
        try {
          // Validate the session token
          const isValid = await validateToken(sessionToken);

          if (isValid) {
            // Return the API key and secret if the token is valid
            return res.json({
              server_name: process.env.SERVER_NAME,
              server_description: process.env.SERVER_DESCRIPTION,
              api_key: process.env.API_KEY,
              api_secret: process.env.API_SECRET,
            });
          }
        } catch (error) {
          console.error("Error validating session token:", error);
        }
      }
    }

    // Return the server name and description if the token is not valid or not provided
    return res.json({
      server_name: process.env.SERVER_NAME,
      server_description: process.env.SERVER_DESCRIPTION,
    });
  });
}
