import { useAppSelector } from "@/store/hooks";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchUserbyName = async ({ token, searchTerm }) => {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const response = await api.get("/api/users/search", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      username: searchTerm,
    },
  });

  const users = response?.data || [];

  return users;
};

export const useGetUserbyName = ({ searchTerm }) => {
  const { token } = useAppSelector((state) => state.user);
  return useQuery({
    queryKey: ["user-name-search", searchTerm],
    queryFn: () => fetchUserbyName({ token, searchTerm }),
    placeholderData: keepPreviousData => keepPreviousData,
  });
};
