import { 
  CircleDotDashed, 
  Cat, 
  CircleUser, 
  MessageSquareQuote, 
  BadgeCheck, 
  Calendar,
  CalendarPlus,
  CalendarSync,
  Eye, 
  Watch, 
  CheckCircle, 
  TriangleAlert 
} from "lucide-react";

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
      icon: <CircleDotDashed />,
      relation: ["equals"],
      options: [
        {
          id: "Open",
          label: "Open",
          icon: <Eye className="text-yellow-600 dark:text-yellow-400" />,
        },
        {
          id: "Pending",
          label: "Pending",
          icon: <Watch className="text-blue-600 dark:text-blue-400" />,
        },
        {
          id: "Completed",
          label: "Completed",
          icon: <CheckCircle className="text-green-600 dark:text-green-400" />,
        },
        {
          id: "Overdue",
          label: "Overdue",
          icon: <TriangleAlert className="text-red-600 dark:text-red-400" />,
        },
      ],
    },
    {
      type: "component",
      id: "category",
      name: "Category",
      icon: <Cat />,
      relation: ["equals"],
      options: [
        {
          id: "SEBI",
          label: "SEBI",
          icon: <BadgeCheck className="text-blue-600 dark:text-blue-400" />,
        },
        {
          id: "RBI",
          label: "RBI",
          icon: <BadgeCheck className="text-green-600 dark:text-green-400" />,
        },
        {
          id: "IT/GST",
          label: "IT/GST",
          icon: <BadgeCheck className="text-purple-600 dark:text-purple-400" />,
        },
        {
          id: "LP",
          label: "LP",
          icon: <CircleUser className="text-orange-600 dark:text-orange-400" />,
        },
        {
          id: "Portfolio Company",
          label: "Portfolio Company",
          icon: <BadgeCheck className="text-red-600 dark:text-red-400" />,
        },
        {
          id: "MCA",
          label: "MCA",
          icon: <BadgeCheck className="text-yellow-600 dark:text-yellow-400" />,
        },
      ],
    },
    ...(havePermission
      ? [
          { 
            type: "user_select", 
            id: "assignee_id", 
            name: "Assignee",
            icon: <CircleUser />
          },
          { 
            type: "user_select", 
            id: "reviewer_id", 
            name: "Reviewer",
            icon: <MessageSquareQuote />
          },
          { 
            type: "user_select", 
            id: "approver_id", 
            name: "Final Approver",
            icon: <BadgeCheck />
          },
        ]
      : []),
    { type: "divider" },
    {
      type: "date_range",
      id: "deadline",
      name: "Due Date",
      icon: <Calendar />,
      relation: ["equals"],
    },
    {
      type: "date_range",
      id: "created_date",
      name: "Created Date",
      icon: <CalendarPlus />,
      relation: ["equals"],
    },
    {
      type: "date_range",
      id: "updated_date",
      name: "Updated Date",
      icon: <CalendarSync />,
      relation: ["equals"],
    },
  ];
}