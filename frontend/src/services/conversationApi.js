import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ------------------------
// Get all conversations
// ------------------------
export async function getConversations() {
  const response = await client.get("/conversations");
  return response.data;
}
export async function getConversationMessages(id) {
  const response = await fetch(
    `http://127.0.0.1:8000/messages/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to load messages");
  }

  return response.json();
}

// ------------------------
// Create new conversation
// ------------------------
export async function createConversation() {
  const response = await client.post("/conversations");
  return response.data;
}

// ------------------------
// Delete conversation
// ------------------------
export async function deleteConversation(id) {
  await client.delete(`/conversations/${id}`);
}

export default client;