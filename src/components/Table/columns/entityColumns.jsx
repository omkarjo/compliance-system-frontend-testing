import { DataTableColumnHeader } from "@/components/Table/DataTableColumnHeader";

/**
 * Returns column definitions for the Entity Table using DataTableColumnHeader.
 * @returns {Array}
 */
export function entityColumns() {
  return [
    {
      accessorKey: "entity_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left">
          {row.getValue("entity_name") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "entity_type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left capitalize">
          {row.getValue("entity_type") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "entity_email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left">
          {row.getValue("entity_email") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "entity_telephone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left">
          {row.getValue("entity_telephone") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "entity_pan",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="PAN" />
      ),
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left uppercase">
          {row.getValue("entity_pan") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "entity_link",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Link Fund" />
      ),
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left">
          {row.getValue("entity_link") || "-"}
        </div>
      ),
    },
  ];
}