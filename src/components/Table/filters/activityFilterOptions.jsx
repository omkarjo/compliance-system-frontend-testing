import { useGetUserByName } from "@/react-query/query/user/userQuery";
import { CheckCircle, CircleUserRound, Eye, Watch } from "lucide-react";
import { useMemo } from "react";

/**
 * Hook to get filter options for the Activity Table.
 * Returns an array of filter config objects for DataTable.
 */
export function activityFilterOptions() {
  const { data } = useGetUserByName({ search: "" });

  const users = useMemo(() => {
    if (!data?.data || !data?.data?.length) return [];
    return data.data.map((user) => ({
      id: user.UserName,
      label: user.UserName,
      icon: <CircleUserRound size={16} />,
    }));
  }, [data]);

  return [
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
}
