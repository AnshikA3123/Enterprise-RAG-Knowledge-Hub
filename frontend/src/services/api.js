import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Send a chat message.
 * If conversationId is null, backend creates a new conversation.
 * Otherwise, backend continues the existing conversation.
 */
export async function sendChatMessage(
  question,
  conversationId = null
) {
  const response = await client.post("/chat", {
    question,
    conversation_id: conversationId,
  });

  return response.data;
}

export async function checkSystemHealth() {
  try {
    const response = await client.get("/", {
      timeout: 4000,
    });

    return response.status === 200;
  } catch {
    return false;
  }
}

export default client;