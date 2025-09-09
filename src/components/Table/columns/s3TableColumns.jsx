import { DocumentDialog } from "@/components/DocumentViewers/DocumentDialog";
import { downloadFile } from "@/components/DocumentViewers/documentDownload";
import SortButton from "@/components/Table/SortButton";
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

export function getS3Columns({ bucket_name, onFolderClick }) {
  return [
    {
      accessorKey: "Key",
      header: ({ column }) => (
        <span className="ms-4 flex items-center">
          <SortButton column={column}>Name</SortButton>
        </span>
      ),
      enableSorting: true,
      sortDescFirst: false,
      cell: ({ row }) => {
        const key = row.getValue("Key");
        const type = getS3Type(key);
        const fileName = getFileName(key);

        if (type === "folder") {
          return (
            <div className="ms-4 flex items-center gap-2">
              <Button
                variant="link"
                onClick={() => onFolderClick(key)}
                className="flex items-center gap-2 px-0 text-base font-normal text-foreground hover:underline"
              >
                <FolderIcon size={16} />
                {fileName}
              </Button>
            </div>
          );
        }

        if (type === "file") {
          return (
            <div className="ms-4 flex items-center gap-2">
              <DocumentDialog
                s3Key={key}
                s3Bucket={bucket_name}
                title={fileName}
                trigger={
                  <Button
                    variant="link"
                    className="flex items-center gap-2 px-0 text-base font-normal text-foreground hover:underline"
                  >
                    <FileIcon size={16} />
                    {fileName}
                  </Button>
                }
              />
            </div>
          );
        }

        return <div className="ms-4 text-left text-sm text-foreground">{fileName}</div>;
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
        <SortButton column={column}>Last Modified</SortButton>
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const ts = row.getValue("LastModified");
        const formatted = ts && ts !== "-" ? new Date(ts).toLocaleString() : "-";
        return <div className="text-left text-sm text-muted-foreground">{formatted}</div>;
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
        <SortButton column={column}>Size</SortButton>
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const type = getS3Type(row.getValue("Key"));
        if (type === "folder") return <div className="text-left text-sm text-muted-foreground">-</div>;
        const size = row.getValue("Size");
        const formatted = size > 0 ? formatBytes(size) : "-";
        return <div className="text-left text-sm text-foreground">{formatted}</div>;
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
      header: () => (
        <span className="flex items-center">Action</span>
      ),
      id: "action",
      cell: ({ row }) => {
        const key = row.getValue("Key");
        const type = getS3Type(key);
        if (type !== "file") return null;
        const fileName = getFileName(key);
        return (
          <div className="flex gap-2">
            <DocumentDialog
              s3Key={key}
              s3Bucket={bucket_name}
              title={fileName}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Preview"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span className="sr-only">Preview</span>
                </Button>
              }
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
