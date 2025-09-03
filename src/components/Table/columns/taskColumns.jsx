import StateChangeSelector from "@/components/Dashboard/includes/state-change-selector";
import UserBadge from "@/components/includes/UserBadge";
import SortButton from "@/components/Table/SortButton";

/**
 * Returns column definitions for the Task Table.
 * @param {boolean} havePermission - Whether the current user has admin permissions.
 * @param {Array} actionType - Array of action objects for row actions.
 * @returns {Array}
 */
export function taskColumns(havePermission, actionType = []) {
  const STATUS_OPTIONS_ADMIN = [
    { label: "Open", value: "Open" },
    { label: "Pending", value: "Pending" },
    { label: "Completed", value: "Completed" },
    { label: "Review Required", value: "Review Required" },
  ];
  const STATUS_OPTIONS_USER = [{ label: "Completed", value: "Completed" }];

  return [
    {
      accessorKey: "category",
      header: () => (
        <span className="ms-4 flex items-center">{"Category"}</span>
      ),
      cell: ({ row }) => (
        <div className="ms-4 text-left uppercase">
          {row.getValue("category")}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-42 truncate text-left md:max-w-52 lg:max-w-64">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "deadline",
      header: ({ column }) => (
        <SortButton column={column}>
          <span className="flex items-center gap-2">Due Date</span>
        </SortButton>
      ),
      cell: ({ row }) => {
        const dueDate = row.getValue("deadline");
        const formatted = dueDate
          ? new Date(dueDate).toLocaleDateString("EN-IN")
          : "No Due Date";
        return <div className="ps-4 text-left font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "state",
      header: ({ column }) => <SortButton column={column}>Status</SortButton>,
      cell: ({ row }) => {
        const data = row.original;
        return (
          <StateChangeSelector
            data={data}
            options={
              havePermission ? STATUS_OPTIONS_ADMIN : STATUS_OPTIONS_USER
            }
          />
        );
      },
    },
    {
      accessorKey: "assignee_name",
      header: ({ column }) => <SortButton column={column}>Assignee</SortButton>,
      cell: ({ row }) => (
        <div className="flex w-28 items-center">
          <UserBadge name={row.getValue("assignee_name")} />
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="ms-auto flex w-24 items-center justify-end gap-1">
            {actionType?.map((action, index) => (
              <button
                key={index}
                type="button"
                className={`hover:bg-muted rounded px-2 py-1 text-xs transition ${action.className ?? ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(data);
                }}
                aria-label={action.title}
              >
                {action.title}
              </button>
            ))}
          </div>
        );
      },
    },
  ];
}
