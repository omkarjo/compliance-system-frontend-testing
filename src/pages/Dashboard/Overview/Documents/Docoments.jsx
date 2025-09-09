import { getS3Columns } from "@/components/Table/columns/s3TableColumns";
import { DataTable } from "@/components/Table/DataTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getBreadcrumbSegments } from "@/lib/S3Utils";
import ErrorPage from "@/pages/public/ErrorPage";
import { useS3Files } from "@/react-query/query/S3/useS3Files";
import { useAppSelector } from "@/store/hooks";
import { ArrowLeftIcon, RefreshCw } from "lucide-react";
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

  const { data, isLoading, error, isRefreshing, lastUpdated, refresh } = useS3Files({
    folder,
    search: searchValue,
  });

  const bucket_name = aws_credentials?.bucket_name || "";
  const region = aws_credentials?.region || "";

  if (!isAuthenticated || !aws_credentials) {
    return <ErrorPage title="Unauthorized" message="You must be logged in to view this page." />;
  }

  if (error) {
    return <ErrorPage title="Failed to fetch S3 files" message={typeof error === "string" ? error : error?.message || "Unknown error"} />;
  }

  const columns = getS3Columns({
    bucket_name,
    region,
    onFolderClick: (folderKey) => {
      setSearchValue("");
      setFolder(folderKey);
      let urlPath = folderKey.endsWith("/") ? folderKey.slice(0, -1) : folderKey;
      navigate(`/dashboard/documents/${urlPath}`);
    },
  });

  const breadcrumbSegments = getBreadcrumbSegments(folder);

  function handleBreadcrumbClick(path) {
    setSearchValue("");
    setFolder(path);
    let urlPath = path.endsWith("/") ? path.slice(0, -1) : path;
    navigate(`/dashboard/documents/${urlPath}`);
  }

  function handleGoUp() {
    if (!folder) return;
    const split = folder.split("/").filter(Boolean);
    const parent = split.length > 1 ? split.slice(0, -1).join("/") + "/" : "";
    setSearchValue("");
    setFolder(parent);
    let urlPath = parent.endsWith("/") ? parent.slice(0, -1) : parent;
    navigate(urlPath ? `/dashboard/documents/${urlPath}` : "/dashboard/documents");
  }

  return (
    <section>
      <main className="mx-4 flex-1">
        <div className="mb-4 flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Button variant="link" onClick={() => handleBreadcrumbClick("")} className="px-0 text-blue-600">
                    Root
                  </Button>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbSegments.map((seg) => (
                <React.Fragment key={seg.path}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Button variant="link" onClick={() => handleBreadcrumbClick(seg.path)} className="px-0 text-blue-600">
                        {seg.name}
                      </Button>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          {folder && (
            <Button variant="ghost" size="sm" onClick={handleGoUp} className="flex items-center gap-2">
              <ArrowLeftIcon size={16} />
              Up
            </Button>
          )}
        </div>
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