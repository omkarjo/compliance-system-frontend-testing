import { getS3Columns } from "@/components/Table/columns/s3TableColumns";
import { DataTable } from "@/components/Table/DataTable";
import { Button } from "@/components/ui/button";
import ErrorPage from "@/pages/public/ErrorPage";
import { useS3Files } from "@/react-query/query/S3/useS3Files";
import { useAppSelector } from "@/store/hooks";
import { RefreshCw } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function S3Browser() {
  const { isAuthenticated, aws_credentials } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const [folder, setFolder] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    let urlFolder = decodeURIComponent(location.pathname.replace(/^\/dashboard\/documents\/*/, ""));
    if (urlFolder && !urlFolder.endsWith("/")) urlFolder += "/";
    setFolder(urlFolder);
  }, [location.pathname]);

  const { data, error, isRefreshing, lastUpdated, refresh } = useS3Files({
    folder,
    search: searchValue,
  });

  const bucket_name = aws_credentials?.bucket_name || "";

  if (!isAuthenticated || !aws_credentials) {
    return <ErrorPage title="Unauthorized" message="You must be logged in to view this page." />;
  }

  if (error) {
    return <ErrorPage title="Failed to fetch S3 files" message={typeof error === "string" ? error : error?.message || "Unknown error"} />;
  }

  const columns = getS3Columns({
    bucket_name,
    onFolderClick: (folderKey) => {
      setSearchValue("");
      setFolder(folderKey);
      let urlPath = folderKey.endsWith("/") ? folderKey.slice(0, -1) : folderKey;
      navigate(`/dashboard/documents/${urlPath}`);
    },
  });

  return (
    <section>
      <main className="mx-4 flex-1">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-muted-foreground text-xs">
            Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "Never"}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={data || []}
          emptyMessage="No files or folders found."
          globalFilter={searchValue}
          onGlobalFilterChange={setSearchValue}
          showGlobalSearch={true}
        />
      </main>
    </section>
  );
}