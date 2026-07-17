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
 * Sends a question to the Enterprise AI Knowledge Hub backend and
 * returns the grounded answer along with its source citations.
 * @param {string} question
 * @returns {Promise<{answer: string, sources: Array<{file: string, page: number}>}>}
 */
export async function sendChatMessage(question) {
  const response = await client.post("/chat", { question });
  return response.data;
}

export async function checkSystemHealth() {
  try {
    const response = await client.get("/", { timeout: 4000 });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export default client;
