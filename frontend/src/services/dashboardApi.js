import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
export async function getDashboardStats() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/dashboard/stats`
    );

    return response.data;
  } catch (error) {
    console.error("Failed to load dashboard stats:", error);
    throw error;
  }
}