import { useAppSelector } from "@/store/hooks";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

// const data = [
//   {
//     id: "t1",
//     category: "SEBI",
//     title:
//       "Regulatory Compliance Review Regulatory Compliance Review Regulatory Compliance Review Regulatory Compliance Review",
//     dueDate: "2025-03-15",
//     status: "COMPLETED",
//     assignee: "John Doe",
//   },
//   {
//     id: "t2",
//     category: "RBI",
//     title: "Banking Guidelines Update",
//     dueDate: "2025-03-20",
//     status: "OPEN",
//     assignee: "Jane Smith",
//   },
//   {
//     id: "t3",
//     category: "IT/GST",
//     title: "Tax Filing for Q1",
//     dueDate: "2025-03-10",
//     status: "OVERDUE",
//     assignee: "Michael Johnson",
//   },
//   {
//     id: "t4",
//     category: "SEBI",
//     title: "Investment Portfolio Analysis",
//     dueDate: "2025-03-25",
//     status: "REVIEW_REQUIRED",
//     assignee: "Emily Davis",
//   },
//   {
//     id: "t5",
//     category: "RBI",
//     title: "Forex Compliance Check",
//     dueDate: "2025-03-18",
//     status: "PENDING",
//     assignee: "Robert Brown",
//   },
//   {
//     id: "t8",
//     category: "RBI",
//     title: "Forex Compliance Check",
//     dueDate: "2025-03-18",
//     status: "COMPLETED",
//     assignee: "Robert Brown",
//   },
//   {
//     id: "t9",
//     category: "SEBI",
//     title: "Regulatory Compliance Review",
//     dueDate: "2025-03-15",
//     status: "COMPLETED",
//     assignee: "John Doe",
//   },
//   {
//     id: "t1",
//     category: "SEBI",
//     title: "Regulatory Compliance Review",
//     dueDate: "2025-03-15",
//     status: "COMPLETED",
//     assignee: "John Doe",
//   },
//   {
//     id: "t1",
//     category: "SEBI",
//     title: "Regulatory Compliance Review",
//     dueDate: "2025-03-15",
//     status: "COMPLETED",
//     assignee: "John Doe",
//   },
//   {
//     id: "t1",
//     category: "SEBI",
//     title: "Regulatory Compliance Review",
//     dueDate: "2025-03-15",
//     status: "COMPLETED",
//     assignee: "John Doe",
//   },
//   {
//     id: "t1",
//     category: "SEBI",
//     title: "Regulatory Compliance Review",
//     dueDate: "2025-03-15",
//     status: "COMPLETED",
//     assignee: "John Doe",
//   },
//   {
//     id: "t1",
//     category: "SEBI",
//     title: "Regulatory Compliance Review",
//     dueDate: "2025-03-15",
//     status: "COMPLETED",
//     assignee: "John Doe",
//   },
// ];

const fetchData = async ({ token, pageIndex, pageSize, sortBy, filters }) => {
  if (!token) {
    throw new Error("Unauthorized");
  }
  console.log("filters", filters);
  console.log("sortBy", sortBy);
  const searchParams = {
    limit: pageSize,
    skip: pageIndex * pageSize,
    sort: sortBy,
    ...filters.reduce((acc, filter) => {
      acc[filter.filterid] = filter.optionid;
      return acc;
    }, {}),
  };
  const response = await api.get("/api/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: searchParams,
  });
  const { tasks, total } = response.data;
  return { data: tasks || [], totalCount: total };
};

export const useGetTask = ({
  pageIndex,
  pageSize,
  sortBy = [],
  filters = [],
}) => {
  const { token } = useAppSelector((state) => state.user);
  const first_sort = sortBy.at(0);
  const sort = first_sort
    ? `${first_sort.id}_${first_sort.desc ? "desc" : "asc"}`
    : "";
  return useQuery({
    queryKey: ["task-querry", pageIndex, pageSize, sort, filters],
    queryFn: () =>
      fetchData({ token, pageIndex, pageSize, sortBy: sort, filters }),
    keepPreviousData: true,
  });
};
