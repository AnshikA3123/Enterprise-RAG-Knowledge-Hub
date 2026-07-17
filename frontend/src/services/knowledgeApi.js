const API_BASE = "http://127.0.0.1:8000";

export async function getKnowledgeBase() {
  const response = await fetch(`${API_BASE}/knowledge-base`);

  if (!response.ok) {
    throw new Error("Failed to load Knowledge Base.");
  }

  return await response.json();
}