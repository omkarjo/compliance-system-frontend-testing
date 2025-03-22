import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchUserbyName = async ({ searchTerm }) => {
  try {
    const response = await apiWithAuth.get("/api/users/search", {
      params: {
        username: searchTerm,
      },
    });

    const users = response?.data || [];

    return users;
  } catch (error) {
    console.error("Error fetching data:", error);

    let message = "Failed to fetch activity logs";
    if (
      error.response?.data?.detail &&
      typeof error.response.data.detail === "string"
    ) {
      message = error.response.data.detail;
    }

    throw new Error(message);
  }
};

export const useGetUserbyName = ({ searchTerm }) => {
  return useQuery({
    queryKey: ["user-name-search", searchTerm],
    queryFn: () => fetchUserbyName({ searchTerm }),
    placeholderData: (keepPreviousData) => keepPreviousData,
  });
};
