import { taskApiPaths } from "@/constant/apiPaths";
import { useAppSelector } from "@/store/hooks";
import { apiWithAuth } from "@/utils/api";
import useCheckRoles from "@/utils/check-roles";
import { usePermissionTaskChange } from "@/utils/havePermission";
import { useQuery } from "@tanstack/react-query";

const sortKeyMap = {
  assignee: "assignee",
  state: "status",
  deadline: "deadline",
};

const fetchData = async ({
  pageIndex,
  pageSize,
  sortBy = [],
  filters = [],
  multipleQuery = null,
}) => {
  try {
    let sortByParmas = null;
    if (sortBy && sortBy.length) {
      const sortValue = sortBy.split("_");
      const sortKey = sortValue[0];
      const sortOrder = sortValue[sortValue.length - 1];
      const mappedSortBy = sortKeyMap[sortKey]
        ? `${sortKeyMap[sortKey]}_${sortOrder}`
        : null;

      sortByParmas = mappedSortBy ? mappedSortBy : null;
    }

    const searchParams = {
      limit: pageSize,
      skip: pageIndex * pageSize,
      ...(sortByParmas && { sort: sortByParmas }),
      ...filters.reduce((acc, filter) => {
        acc[filter.filterid] = filter.optionid;
        return acc;
      }, {}),
    };

    if (!multipleQuery) {
      const response = await apiWithAuth.get(taskApiPaths.getTask, {
        params: searchParams,
      });

      const { tasks, total } = response.data;
      return { data: tasks || [], totalCount: total };
    } else {
      let data = [];
      let total = 0;
      for (const query of multipleQuery) {
        const response = await apiWithAuth.get(taskApiPaths.getTask, {
          params: { ...searchParams, ...query },
        });
        const { tasks, total: totalCount } = response.data;
        data.push(...tasks);
        total += totalCount;
      }

      // Remove duplicates based on task_id

      const uniqueData = new Map(
        data.map((item) => [item.compliance_task_id, item]),
      );
      data = Array.from(uniqueData.values());

      // Sort the data based on the sortByParmas

      // Return the paginated data and total count

      return { data: data || [], totalCount: total };
    }
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

export const useGetTask = ({
  pageIndex = 0,
  pageSize = 10,
  sortBy = [],
  filters = [],
}) => {
  const havePermission = useCheckRoles(["Fund Manager", "Compliance Officer"]);
  const { user } = useAppSelector((state) => state.user);
  const user_id = user.user_id;
  const first_sort = sortBy.at(0);
  const sort = first_sort
    ? `${first_sort.id}_${first_sort.desc ? "desc" : "asc"}`
    : "";

  const multipleQuery = havePermission
    ? null
    : [
        { assignee_id: user_id },
        { reviewer_id: user_id },
        { approver_id: user_id },
      ];

  console.log("filters", filters);
  console.log("sort", sort);

  return useQuery({
    queryKey: ["task-query", pageIndex, pageSize, sort, filters, multipleQuery],
    queryFn: () =>
      fetchData({
        pageIndex,
        pageSize,
        sortBy: sort,
        filters,
        multipleQuery,
      }),
    placeholderData: (keepPreviousData) => keepPreviousData,
  });
};

const searchTask = async ({
  searchTerm,
  pageIndex,
  pageSize,
  filters = [],
  sortBy = [],
}) => {
  try {
    if (!searchTerm || searchTerm.length < 2) {
      console.log("searchTerm", searchTerm);
      const response = await fetchData({
        pageIndex,
        pageSize,
      });

      return response;
    }

    const first_sort = sortBy.at(0);
    const sort = first_sort
      ? `${first_sort.id}_${first_sort.desc ? "desc" : "asc"}`
      : "";

    const searchParams = {
      limit: pageSize,
      skip: pageIndex * pageSize,
      ...(sort && { sort }),
      ...(searchTerm && { description: searchTerm }),
      ...filters.reduce((acc, filter) => {
        acc[filter.filterid] = filter.optionid;
        return acc;
      }, {}),
    };

    const response = await apiWithAuth.get(taskApiPaths.searchTask, {
      params: searchParams,
    });
    const { tasks, total } = response.data;
    return { data: tasks || [], totalCount: total };
  } catch (error) {
    console.error("Error fetching data:", error);

    let message = "Failed to fetch Task";
    if (
      error.response?.data?.detail &&
      typeof error.response.data.detail === "string"
    ) {
      message = error.response.data.detail;
    }

    throw new Error(message);
  }
};

export const useSearchTask = ({
  searchTerm,
  pageIndex = 0,
  pageSize = 100,
  filters = [],
  sortBy = [],
}) => {
  return useQuery({
    queryKey: [
      "task-search-query",
      searchTerm,
      pageIndex,
      pageSize,
      filters,
      sortBy,
    ],
    queryFn: () =>
      searchTask({ searchTerm, pageIndex, pageSize, filters, sortBy }),
    placeholderData: (keepPreviousData) => keepPreviousData,
  });
};

const taskDetails = async ({ taskId, havePermission }) => {
  try {
    const response = await apiWithAuth.get(`${taskApiPaths.getTask}/${taskId}`);
    const responseData = response.data;

    const havePermissionTaskChange = havePermission(responseData);
    if (!havePermissionTaskChange) {
      throw new Error("You do not have permission to view this task.");
    }

    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    let message = "Failed to fetch task details";
    if (
      error.response?.data?.detail &&
      typeof error.response.data.detail === "string"
    ) {
      message = error.response.data.detail;
    }
    throw new Error(message);
  }
};
