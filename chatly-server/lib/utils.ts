import { query } from "@/lib/db";

const TIMEOUT_MS = 5000; // Timeout duration in milliseconds

export const validateUser = async (headers: {
  [key: string]: string;
}): Promise<any> => {
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
    const timeoutPromise = new Promise<any>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), TIMEOUT_MS),
    );

    // Fetch user data with timeout
    const result = await Promise.race([
      query(
        `
          SELECT *
          FROM users
          WHERE sessions ? '${token}'
        `,
      ),
      timeoutPromise,
    ]);

    // Check if the user exists
    if (result.length === 0) {
      console.log("User not found");
      return false;
    }

    const user = result[0];
    const now = new Date().getTime();
    const sessions = user.sessions;
    const session = sessions[token];

    // Check if the session is still valid
    if (!session || now > session.expiresAt) {
      console.log("Expired by time");
      return false;
    }

    // Return the user data, excluding sensitive information
    delete user.password; // Remove sensitive information

    return user;
  } catch (error) {
    console.error("Error validating session token:", error);
    return false;
  }
};
