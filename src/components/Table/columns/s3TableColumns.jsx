import { DocumentDialog } from "@/components/DocumentViewers/DocumentDialog";
import { downloadFile } from "@/components/DocumentViewers/documentDownload";
import { detectFileType } from "@/components/DocumentViewers/documentUtils";
import { DataTableColumnHeader } from "@/components/Table/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/formatter";
import { getFileName } from "@/lib/S3Utils";
import { useS3Client } from "@/react-query/query/S3/useS3Client";
import { DownloadIcon, EyeIcon, FileIcon, FolderIcon } from "lucide-react";
import React from "react";

export function getS3Type(key) {
  if (!key) return "other";
  if (key.endsWith("/")) return "folder";
  return "file";
}

function DownloadButton({ s3Bucket, s3Key, fileName }) {
  const s3Client = useS3Client();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Download"
      onClick={() =>
        downloadFile({
          s3Client,
          s3Bucket,
          s3Key,
          title: fileName,
        })
      }
    >
      <DownloadIcon className="h-4 w-4" />
      <span className="sr-only">Download</span>
    </Button>
  );
}

export function getS3Columns({ bucket_name, region, onFolderClick }) {
  return [
    {
      accessorKey: "Key",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" className={"ms-3"} />
      ),
      enableSorting: true,
      sortDescFirst: false,
      cell: ({ row }) => {
        const key = row.getValue("Key");
        const type = getS3Type(key);
        const fileName = getFileName(key);

        if (type === "folder") {
          return (
            <Button
              variant="link"
              onClick={() => onFolderClick(key)}
              className="flex items-center gap-2 px-0 text-blue-600"
            >
              <FolderIcon size={16} />
              {fileName}
            </Button>
          );
        }

        if (type === "file") {
          return (
            <Button
              variant="link"
              className="flex items-center gap-2 px-0 text-blue-600"
              onClick={() =>
                document.getElementById(`preview-dialog-${key}`)?.click()
              }
            >
              <FileIcon size={16} />
              {fileName}
              <DocumentDialog
                s3Key={key}
                s3Bucket={bucket_name}
                trigger={
                  <span
                    id={`preview-dialog-${key}`}
                    style={{ display: "none" }}
                  />
                }
                title={fileName}
              />
            </Button>
          );
        }

        return fileName;
      },
      sortingFn: (rowA, rowB) => {
        // Folders first, then lexicographic
        const typeA = getS3Type(rowA.original.Key);
        const typeB = getS3Type(rowB.original.Key);
        if (typeA !== typeB) return typeA === "folder" ? -1 : 1;
        return rowA.original.Key.localeCompare(rowB.original.Key);
      },
    },
    {
      accessorKey: "LastModified",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Modified" />
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const ts = row.getValue("LastModified");
        return ts && ts !== "-" ? new Date(ts).toLocaleString() : "-";
      },
      sortingFn: (rowA, rowB) => {
        const a = new Date(rowA.original.LastModified || 0).getTime();
        const b = new Date(rowB.original.LastModified || 0).getTime();
        return a - b;
      },
    },
    {
      accessorKey: "Size",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Size" />
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const type = getS3Type(row.getValue("Key"));
        if (type === "folder") return "-";
        const size = row.getValue("Size");
        return size > 0 ? formatBytes(size) : "-";
      },
      sortingFn: (rowA, rowB) => {
        const a =
          getS3Type(rowA.original.Key) === "folder"
            ? -1
            : rowA.original.Size || 0;
        const b =
          getS3Type(rowB.original.Key) === "folder"
            ? -1
            : rowB.original.Size || 0;
        return a - b;
      },
    },
    {
      header: "Action",
      id: "action",
      cell: ({ row }) => {
        const key = row.getValue("Key");
        const type = getS3Type(key);
        if (type !== "file") return null;
        const fileName = getFileName(key);
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Preview"
              onClick={() =>
                document.getElementById(`preview-dialog-action-${key}`)?.click()
              }
            >
              <EyeIcon className="h-4 w-4" />
              <span className="sr-only">Preview</span>
            </Button>
            <DocumentDialog
              s3Key={key}
              s3Bucket={bucket_name}
              trigger={
                <span
                  id={`preview-dialog-action-${key}`}
                  style={{ display: "none" }}
                />
              }
              title={fileName}
            />
            <DownloadButton
              s3Bucket={bucket_name}
              s3Key={key}
              fileName={fileName}
            />
          </div>
        );
      },
    },
  ];
}
