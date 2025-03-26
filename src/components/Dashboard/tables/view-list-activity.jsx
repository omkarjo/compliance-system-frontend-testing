import { Button } from "@/components/ui/button";
import DataTable from "@/components/includes/data-table";
import { useGetAllActivities } from "@/query/activityQuery";
import { useGetUserbyName } from "@/query/userQuery";
import {
  ArrowUpDown,
  CheckCircle,
  CircleUserRound,
  Eye,
  Watch,
} from "lucide-react";
import { useMemo } from "react";

export default function ViewListActivity() {
  const columns = [
    {
      accessorKey: "activity",
      header: "Activity",
    },
    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }) => (
        <div className="max-w-42 truncate text-left md:max-w-52 lg:max-w-64">
          {row.getValue("details")}
        </div>
      ),
    },
    {
      accessorKey: "timestamp",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Timestamp
          <ArrowUpDown size={16} />
        </Button>
      ),
      cell: ({ row }) => {
        const timestamp = row.getValue("timestamp");
        const date = new Date(timestamp);
        return (
          <div className="text-left text-xs text-gray-500">
            {timestamp ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` : "Invalid Date"}
          </div>
        );
      },
    },
    {
      accessorKey: "user_name",
      header: "User",
    },
  ];

  const { data: usersData } = useGetUserbyName({ searchTerm: "" });

  const users = useMemo(() => {
    // console.log("usersData", usersData);
    if (!usersData || !usersData?.length) return [];
    return usersData.map((user) => ({
      id: user.UserName,
      label: user.UserName,
      icon: <CircleUserRound size={16} />,
    }));
  }, [usersData]);

  const filterOptions = [
    { type: "divider" },
    {
      type: "component",
      id: "activity",
      name: "Activity",
      icon: <CheckCircle />,
      relation: ["equals"],
      options: [
        { id: "user_search", label: "User Search", icon: <Eye className="text-yellow-400" /> },
        { id: "login", label: "Login", icon: <CheckCircle className="text-green-400" /> },
        { id: "document_upload", label: "Document Upload", icon: <Watch className="text-blue-400" /> },
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