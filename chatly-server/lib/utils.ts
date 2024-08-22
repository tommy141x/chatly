import { query } from "@/lib/db";

const TIMEOUT_MS = 5000; // Timeout duration in milliseconds

export const validateUser = async (headers: {
  [key: string]: string;
}): Promise<
  false | { id: string; username: string; email: string; display_name: string }
> => {
  try {
    // Extract the token from the Authorization header
    const authHeader = headers["authorization"];
    if (!authHeader) {
      return false;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return false;
    }

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), TIMEOUT_MS),
    );

    // Fetch session and user data with timeout
    const result = await Promise.race([
      query(
        `
        SELECT u.id, u.username, u.email, u.display_name
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = $1 AND s.expires_at > CURRENT_TIMESTAMP
      `,
        [token],
      ),
      timeoutPromise,
    ]);

    // Check if the session exists and is valid
    if (result.length === 0) {
      console.log("Valid session not found");
      return false;
    }

    // Return the user data
    return result[0];
  } catch (error) {
    console.error("Error validating session token:", error);
    return false;
  }
};
