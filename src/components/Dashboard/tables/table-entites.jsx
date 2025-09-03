import BadgeStatusTask from "@/components/includes/badge-status";
import { DataTable, SortButton } from "@/components/Table";
import { Button } from "@/components/ui/button";
import { useGetEntities } from "@/react-query/query/Entities/useGetEntities";
import { ArrowUpDown } from "lucide-react";

export default function TableEntitiesView({ openView = () => {} }) {
  const columns = [
    {
      accessorKey: "entity_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
        </Button>
      ),
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left">
          {row.getValue("entity_name") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "entity_type",
      header: "Type",
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left capitalize">
          {row.getValue("entity_type") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "entity_email",
      header: "Email",
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left">
          {row.getValue("entity_email") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "entity_telephone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left">
          {row.getValue("entity_telephone") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "entity_pan",
      header: "PAN",
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left uppercase">
          {row.getValue("entity_pan") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "entity_fund",
      header: "Link Fund",
      cell: ({ row }) => (
        <div className="truncate ps-2 text-left">
          {row.getValue("entity_link") || "-"}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      fetchData={useGetEntities}
      filterOptions={[]}
      initialPageSize={10}
      searchBox
      searchBoxPlaceholder="Search Entities..."
      openView={openView}
    />
  );
}
