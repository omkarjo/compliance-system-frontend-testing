import { taskApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "./api";

export const getTaskByID = async (taskId) => {
  try {
    const response = await apiWithAuth.get(
      `${taskApiPaths.getTaskByIdPrefix}${taskId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    throw error;
  }
};
