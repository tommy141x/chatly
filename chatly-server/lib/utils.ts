import { query } from "@/lib/db";

const TIMEOUT_MS = 5000; // Timeout duration in milliseconds

export const validateUser = async (headers) => {
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

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), TIMEOUT_MS),
    );

    const result = await Promise.race([
      query(
        `
        SELECT u.*
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

    // Update the last_active field for the session
    await query(
      `
      UPDATE sessions
      SET last_active = CURRENT_TIMESTAMP
      WHERE id = $1
    `,
      [token],
    );

    // Remove the password field from the user object
    const user = result[0];
    delete user.password;

    return user;
  } catch (error) {
    console.error("Error validating session token:", error);
    return false;
  }
};
