const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getKnowledgeBase() {
  const response = await fetch(
    `${API_BASE_URL}/knowledge-base`
  );

  if (!response.ok) {
    throw new Error("Failed to load Knowledge Base.");
  }

  return await response.json();
}