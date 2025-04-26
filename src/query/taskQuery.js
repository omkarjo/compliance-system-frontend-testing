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

const fetchTaskData = async ({
  pageIndex,
  pageSize,
  sortBy = [],
  filters = [],
  multipleQuery = null,
}) => {
  try {
    let sortByParams = null;
    if (sortBy && sortBy.length) {
      const sortValue = sortBy.split("_");
      const sortKey = sortValue[0];
      const sortOrder = sortValue[sortValue.length - 1];
      const mappedSortBy = sortKeyMap[sortKey]
        ? `${sortKeyMap[sortKey]}_${sortOrder}`
        : null;
      sortByParams = mappedSortBy ? mappedSortBy : null;
    }

    const searchParams = {
      limit: pageSize,
      skip: pageIndex * pageSize,
      ...(sortByParams && { sort: sortByParams }),
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

      // Remove duplicates based on compliance_task_id
      const uniqueData = new Map(
        data.map((item) => [item.compliance_task_id, item])
      );
      data = Array.from(uniqueData.values());

      return { data: data || [], totalCount: total };
    }
  } catch (error) {
    console.error("Error fetching task data:", error);
    let message = "Failed to fetch task data";
    if (
      error.response?.data?.detail &&
      typeof error.response.data.detail === "string"
    ) {
      message = error.response.data.detail;
    }
    throw new Error(message);
  }
};

const searchTaskData = async ({
  search,
  pageIndex,
  pageSize,
  sortBy = [],
  filters = [],
  multipleQuery = null,
}) => {
  try {
    if (!search || search.length < 1) {
      // Fallback to normal fetch if no search
      return fetchTaskData({ pageIndex, pageSize, sortBy, filters, multipleQuery });
    }

    let sortByParams = null;
    if (sortBy && sortBy.length) {
      const sortValue = sortBy.split("_");
      const sortKey = sortValue[0];
      const sortOrder = sortValue[sortValue.length - 1];
      const mappedSortBy = sortKeyMap[sortKey]
        ? `${sortKeyMap[sortKey]}_${sortOrder}`
        : null;
      sortByParams = mappedSortBy ? mappedSortBy : null;
    }

    const baseParams = {
      limit: pageSize,
      skip: pageIndex * pageSize,
      ...(sortByParams && { sort: sortByParams }),
      ...(search && { description: search }),
      ...filters.reduce((acc, filter) => {
        acc[filter.filterid] = filter.optionid;
        return acc;
      }, {}),
    };

    if (!multipleQuery) {
      const response = await apiWithAuth.get(taskApiPaths.searchTask, {
        params: baseParams,
      });
      const { tasks, total } = response.data;
      return { data: tasks || [], totalCount: total };
    } else {
      let data = [];
      let total = 0;
      for (const query of multipleQuery) {
        const response = await apiWithAuth.get(taskApiPaths.searchTask, {
          params: { ...baseParams, ...query },
        });
        const { tasks, total: totalCount } = response.data;
        data.push(...tasks);
        total += totalCount;
      }

      const uniqueData = new Map(
        data.map((item) => [item.compliance_task_id, item])
      );
      data = Array.from(uniqueData.values());

      return { data: data || [], totalCount: total };
    }
  } catch (error) {
    console.error("Error searching tasks:", error);
    let message = "Failed to search tasks";
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

  return useQuery({
    queryKey: ["task-query", pageIndex, pageSize, sort, filters, multipleQuery],
    queryFn: () =>
      fetchTaskData({
        pageIndex,
        pageSize,
        sortBy: sort,
        filters,
        multipleQuery,
      }),
    placeholderData: (keepPreviousData) => keepPreviousData,
  });
};

export const useSearchTask = ({
  search = "",
  pageIndex = 0,
  pageSize = 100,
  filters = [],
  sortBy = [],
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

  return useQuery({
    queryKey: [
      "task-search-query",
      search,
      pageIndex,
      pageSize,
      sort,
      filters,
      multipleQuery,
    ],
    queryFn: () =>
      searchTaskData({
        search,
        pageIndex,
        pageSize,
        sortBy: sort,
        filters,
        multipleQuery,
      }),
    placeholderData: (keepPreviousData) => keepPreviousData,
  });
};

export const fetchTaskDetails = async ({ taskId, havePermission }) => {
  try {
    const response = await apiWithAuth.get(`${taskApiPaths.getTask}/${taskId}`);
    const responseData = response.data;

    const havePermissionTaskChange = havePermission(responseData);
    if (!havePermissionTaskChange) {
      throw new Error("You do not have permission to view this task.");
    }

    return responseData;
  } catch (error) {
    console.error("Error fetching task details:", error);
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
