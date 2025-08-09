import DataTable from "@/components/includes/data-table";
import { useMemo } from "react";
import FileTableActions from "./FileTableActions";

function formatSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024)
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
  return (bytes / 1024 / 1024 / 1024).toFixed(1) + " GB";
}

export default function FileTable({ files, currentPrefix }) {
  console.log("Rendering FileTable with files:", files);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "File Name",
        cell: ({ row }) => {
          const fileName = row.original.name.replace(currentPrefix, "");
          return <span className="flex items-center gap-2">{fileName}</span>;
        },
      },
      {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => row.original.size || "",
      },
      {
        accessorKey: "lastModified",
        header: "Last Modified",
        cell: ({ row }) =>
          row.original.lastModified
            ? new Date(row.original.lastModified).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                },
              )
            : "",
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <FileTableActions file={row.original} />,
      },
    ],
    [currentPrefix],
  );

  const data = files.map((f) => ({
    name: f.Key,
    size: formatSize(f.Size),
    lastModified: f.LastModified,
    key: f.Key,
    ...f,
  }));

  if (files.length === 0) {
    return (
      <div className="text-muted-foreground w-full rounded-xl p-6 text-center shadow">
        No documents in this folder
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-2xl font-semibold -mb-4">Files</h2>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
