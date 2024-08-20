import { query } from "@/lib/db";

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    // Fetch session data
    const sessions = await query("SELECT * FROM sessions WHERE token = $1", [
      token,
    ]);

    // Check if the session exists
    if (sessions.length === 0) {
      return false;
    }

    // Check if the session is still valid
    const session = sessions[0];
    const now = new Date().getTime();
    const expirationTime = new Date(session.expires_at).getTime();

    return now <= expirationTime;
  } catch (error) {
    console.error("Error validating session token:", error);
    return false;
  }
};
