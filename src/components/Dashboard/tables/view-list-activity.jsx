import DataTable from "@/components/includes/data-table";
import SortButton from "@/components/includes/SortButton";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetAllActivities } from "@/react-query/query/activity/activityQuery";
import { useGetUserByName } from "@/react-query/query/user/userQuery";
import {
  ArrowUpDown,
  CheckCircle,
  CircleUserRound,
  Eye,
  UserCircle,
  Watch,
} from "lucide-react";
import { useMemo } from "react";

export default function ViewListActivity() {
  const columns = [
    {
      accessorKey: "activity",
      header: () => (
        <span className="ms-4 flex items-center">{"Activity"}</span>
      ),
      cell: ({ row }) => (
        <div className="ms-4 text-left uppercase">
          {row.getValue("activity")}
        </div>
      ),
    },
    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger className="w-42 truncate text-left md:w-52 lg:w-64">
              {row.getValue("details")}
            </TooltipTrigger>
            <TooltipContent className="max-w-48 text-wrap">
              {row.getValue("details")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "timestamp",
      header: ({ column }) => (
        <SortButton column={column}>Timestamp</SortButton>
      ),
      cell: ({ row }) => {
        const timestamp = row.getValue("timestamp");
        const date = new Date(timestamp);
        return (
          <div className="text-left text-xs text-gray-500">
            {timestamp
              ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
              : "Invalid Date"}
          </div>
        );
      },
    },
    {
      accessorKey: "user_name",
      header: "User",
      cell: ({ row }) => {
        const userName = row.getValue("user_name");
        return (
          <div className="flex w-24 items-center truncate text-left md:w-28 lg:w-32">
            {/* <UserCircle className="inline-block mr-1" size={16} /> */}
            {userName}
          </div>
        );
      },
    },
  ];

  const { data: data } = useGetUserByName({ search: "" });

  const users = useMemo(() => {
    // console.log("usersData", usersData);
    if (!data?.data || !data?.data?.length) return [];
    return data.data.map((user) => ({
      id: user.UserName,
      label: user.UserName,
      icon: <CircleUserRound size={16} />,
    }));
  }, [data]);

  const filterOptions = [
    { type: "divider" },
    {
      type: "component",
      id: "activity",
      name: "Activity",
      icon: <CheckCircle />,
      relation: ["equals"],
      options: [
        {
          id: "user_search",
          label: "User Search",
          icon: <Eye className="text-yellow-400" />,
        },
        {
          id: "login",
          label: "Login",
          icon: <CheckCircle className="text-green-400" />,
        },
        {
          id: "document_upload",
          label: "Document Upload",
          icon: <Watch className="text-blue-400" />,
        },
      ],
    },
    {
      type: "component",
      id: "user_name",
      name: "User Name",
      icon: <CircleUserRound />,
      relation: ["equals"],
      options: users,
    },
  ];

  return (
    <DataTable
      columns={columns}
      fetchData={useGetAllActivities}
      filterOptions={filterOptions}
      initialPageSize={15}
    />
  );
}
