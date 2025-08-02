import { authApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

let allUsersCache = null;
const forceRefreshCache = true;

const getAllUsers = async ({ pageIndex, pageSize, returnAll }) => {
  try {
    if (forceRefreshCache || !allUsersCache || allUsersCache.length === 0) {
      const response = await apiWithAuth.get(authApiPaths.search, {
        params: {
          username: "",
        },
      });

      allUsersCache = response.data || [];
    }

    if (returnAll) {
      return {
        data: allUsersCache,
        totalCount: allUsersCache.length,
      };
    }

    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const paginatedData = allUsersCache.slice(start, end);

    return {
      data: paginatedData,
      totalCount: allUsersCache.length,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch users. Please try again.",
    );
  }
};

const fetchUserData = async ({ pageIndex, pageSize, search, returnAll }) => {
  const skip = pageIndex * pageSize;
  const limit = pageSize;

  try {
    if (search) {
      const response = await apiWithAuth.get(authApiPaths.search, {
        params: {
          username: search,
        },
      });

      const users = response?.data || [];

      if (returnAll) {
        return {
          data: users,
          totalCount: users.length,
        };
      }

      const start = skip;
      const end = skip + limit;
      const paginatedData = users.slice(start, end);

      return {
        data: paginatedData,
        totalCount: users.length,
      };
    } else {
      return await getAllUsers({ pageIndex, pageSize, returnAll });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch user data. Please try again.",
    );
  }
};

export const useGetUserByName = ({
  pageIndex = 0,
  pageSize = 10,
  search = "",
  returnAll = false,
}) => {
  return useQuery({
    queryKey: ["user-name-query", pageIndex, pageSize, search, returnAll],
    queryFn: () => fetchUserData({ pageIndex, pageSize, search, returnAll }),
    placeholderData: (previousData) => previousData,
    onError: (error) => {
      console.error("React Query Error:", error.message);
    },
  });
};
