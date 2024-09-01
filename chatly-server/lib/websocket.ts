import { WebSocket } from "ws";
import { query } from "@/lib/db";

interface ChatMessage {
  content: string;
  locationId: number;
  sessionToken: string;
  reactions?: any;
  attachments?: any;
  mentions?: string[];
}

interface WebSocketData {
  userId: string;
  locationId: number;
}

const activeConnections: Map<number, WebSocket[]> = new Map();

async function validateSession(token: string): Promise<{ id: string } | null> {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Database query timed out")), 5000),
  );

  try {
    const result = await Promise.race([
      query(
        `
        SELECT u.id
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = $1 AND s.expires_at > CURRENT_TIMESTAMP
      `,
        [token],
      ),
      timeoutPromise,
    ]);

    if (result && result.length > 0) {
      return result[0];
    }
  } catch (error) {
    console.error("Error validating session:", error);
  }

  return null;
}

async function saveMessageToDB(message: ChatMessage, authorId: string) {
  try {
    const result = await query(
      `
      INSERT INTO messages (content, author_id, location_id, reactions, attachments, mentions)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, timestamp
      `,
      [
        message.content,
        authorId,
        message.locationId,
        JSON.stringify(message.reactions || {}),
        JSON.stringify(message.attachments || {}),
        message.mentions || [],
      ],
    );

    return result[0];
  } catch (error) {
    console.error("Error saving message to DB:", error);
    throw error;
  }
}

function broadcastToLocation(locationId: number, message: any) {
  const connections = activeConnections.get(locationId) || [];
  connections.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
}

export const handleWS = async (
  ws: WebSocket & { data: WebSocketData },
  msg: string,
) => {
  try {
    const message: ChatMessage = JSON.parse(msg);
    const user = await validateSession(message.sessionToken);

    if (!user) {
      ws.send(JSON.stringify({ error: "Invalid session" }));
      return;
    }

    // Save the message to the database
    const savedMessage = await saveMessageToDB(message, user.id);

    // Prepare the message to broadcast
    const broadcastMessage = {
      id: savedMessage.id,
      content: message.content,
      authorId: user.id,
      timestamp: savedMessage.timestamp,
      locationId: message.locationId,
      reactions: message.reactions,
      attachments: message.attachments,
      mentions: message.mentions,
    };

    // Broadcast the message to all clients in the same location
    broadcastToLocation(message.locationId, broadcastMessage);
  } catch (error) {
    console.error("Error processing message:", error);
    ws.send(JSON.stringify({ error: "Error processing message" }));
  }
};

// WebSocket connection handlers
export const wsHandlers = {
  open: (ws: WebSocket & { data: WebSocketData }) => {
    const { locationId, userId } = ws.data;
    console.log(
      `WebSocket opened for user ${userId} in location ${locationId}`,
    );

    // Add the connection to the activeConnections map
    if (!activeConnections.has(locationId)) {
      activeConnections.set(locationId, []);
    }
    activeConnections.get(locationId)!.push(ws);
  },
  close: (ws: WebSocket & { data: WebSocketData }) => {
    const { locationId, userId } = ws.data;
    console.log(
      `WebSocket closed for user ${userId} in location ${locationId}`,
    );

    // Remove the connection from the activeConnections map
    const connections = activeConnections.get(locationId) || [];
    const index = connections.indexOf(ws);
    if (index !== -1) {
      connections.splice(index, 1);
    }
    if (connections.length === 0) {
      activeConnections.delete(locationId);
    }
  },
  drain: (ws: WebSocket) => {
    console.log("WebSocket buffer drained");
  },
};
