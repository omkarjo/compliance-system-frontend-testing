import DataTable from "@/components/includes/data-table";
import { Button } from "@/components/ui/button";
import { useGetAllDocuments } from "@/query/docomentsQuerry";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ViewListDocument() {
  const navigate = useNavigate();

  const column = [
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "name",
      header: "Name",
    },

    {
      accessorKey: "process_id",
      header: "Linked Task",
      cell: ({ row }) => {
        const process_id = row.getValue("process_id");
        return (
          <div className="text-left">
            {process_id ? (
              <div className="text-xs text-gray-500">{process_id}</div>
            ) : (
              <div className="text-xs text-gray-500">No Task</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "date_uploaded",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date Uploaded
            <ArrowUpDown size={16} />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date_uploaded = row.getValue("date_uploaded");
        const date = new Date(date_uploaded);
        return (
          <div className="text-left">
            {date_uploaded ? (
              <div className="text-xs text-gray-500">
                {date.toLocaleDateString()}
              </div>
            ) : (
              <div className="text-xs text-gray-500">Invalid Date</div>
            )}
          </div>
        );
      },
    },
  ];

  const filterOptions = [];

  const [sorting, setSorting] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [filters, setFilters] = useState([]);
  const [searchOptions, setSearchOptions] = useState({
    filterId: "",
    search: "",
  });

  const { data, isLoading, error } = useGetAllDocuments({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortBy: sorting,
  });

  const onOpenViewDocument = (documentId) => {
    console.log("View document with id: ", documentId);
    navigate(`${documentId.file_path}`);
  };

  return (
    <DataTable
      columns={column}
      data={data?.data ?? []}
      totalCount={data?.totalCount ?? 0}
      loading={isLoading}
      sorting={sorting}
      setSorting={setSorting}
      pagination={pagination}
      setPagination={setPagination}
      // openView={onOpenViewDocument}
      error={error?.message}
      filter={{
        filters,
        filterOptions,
        searchOptions,
        setFilters,
        setSearchOptions,
      }}
    />
  );
}
