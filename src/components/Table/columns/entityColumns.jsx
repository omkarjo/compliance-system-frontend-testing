import SortButton from "@/components/Table/SortButton";

/**
 * Returns column definitions for the Entity Table using DataTableColumnHeader.
 * @returns {Array}
 */
export function entityColumns() {
  return [
    {
      accessorKey: "entity_name",
      header: ({ column }) => (
        <SortButton column={column}>Name</SortButton>
      ),
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left text-foreground">
          {row.getValue("entity_name") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "entity_type",
      header: ({ column }) => (
        <SortButton column={column}>Type</SortButton>
      ),
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left text-foreground capitalize">
          {row.getValue("entity_type") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "entity_email",
      header: ({ column }) => (
        <SortButton column={column}>Email</SortButton>
      ),
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left text-foreground">
          {row.getValue("entity_email") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "entity_telephone",
      header: ({ column }) => (
        <SortButton column={column}>Phone</SortButton>
      ),
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left text-foreground">
          {row.getValue("entity_telephone") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "entity_pan",
      header: ({ column }) => (
        <SortButton column={column}>PAN</SortButton>
      ),
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left text-foreground uppercase">
          {row.getValue("entity_pan") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "entity_link",
      header: ({ column }) => (
        <SortButton column={column}>Link Fund</SortButton>
      ),
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left text-foreground">
          {row.getValue("entity_link") || "-"}
        </div>
      ),
    },
  ];
}