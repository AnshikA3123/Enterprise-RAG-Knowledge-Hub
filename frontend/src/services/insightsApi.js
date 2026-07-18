import api from "./api";

export const getAIInsights = async () => {
  const response = await api.get("/insights");
  return response.data;
};