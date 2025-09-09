import { CheckCircle, Eye, Watch, TriangleAlert, Calendar } from "lucide-react";

/**
 * Returns filter options for the Task Table based on permissions.
 * @param {boolean} havePermission - Whether the current user has admin permissions.
 * @returns {Array}
 */
export function taskFilterOptions(havePermission) {
  return [
    { type: "divider" },
    {
      type: "component",
      id: "state",
      name: "Status",
      icon: <CheckCircle />,
      relation: ["equals"],
      options: [
        {
          id: "Open",
          label: "Open",
          icon: <Eye className="text-yellow-400" />,
        },
        {
          id: "Pending",
          label: "Pending",
          icon: <Watch className="text-blue-400" />,
        },
        {
          id: "Completed",
          label: "Completed",
          icon: <CheckCircle className="text-green-400" />,
        },
        {
          id: "Overdue",
          label: "Overdue",
          icon: <TriangleAlert className="text-red-400" />,
        },
      ],
    },
    ...(havePermission
      ? [
          { type: "user_select", id: "assignee_id", name: "Assignee" },
          { type: "user_select", id: "reviewer_id", name: "Reviewer" },
          { type: "user_select", id: "approver_id", name: "Final Reviewer" },
        ]
      : []),
    {
      type: "date_range",
      id: "deadline",
      name: "Date Range",
      icon: <Calendar />,
      relation: ["equals"],
    },
  ];
}