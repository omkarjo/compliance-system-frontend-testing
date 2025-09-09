import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getS3SignedUrl } from "@/lib/S3Utils";
import { useS3Client } from "@/react-query/query/S3/useS3Client";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingState } from "@/components/common/includes/LoadingErrorState";
import { downloadFile } from "./documentDownload";
import { detectFileType } from "./documentUtils";
import { DocumentViewer } from "./DocumentViewer";

export function DocumentDialog({
  open,
  onOpenChange,
  fileType,
  viewUrl,
  s3Key,
  s3Bucket,
  trigger,
  title = "View Document",
}) {
  const s3Client = useS3Client();
  const [signedUrl, setSignedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (open !== undefined) {
      setIsDialogOpen(open);
    }
  }, [open]);

  useEffect(() => {
    let active = true;
    async function fetchSignedUrl() {
      if (s3Key && s3Bucket && s3Client && isDialogOpen) {
        setLoading(true);
        try {
          const url = await getS3SignedUrl(s3Client, s3Bucket, s3Key, {
            ResponseContentDisposition: `attachment; filename="${title}"`,
          });
          if (active) setSignedUrl(url);
        } catch (error) {
          console.error("Failed to get signed URL:", error);
        }
        setLoading(false);
      } else if (!isDialogOpen) {
        setSignedUrl(null);
      }
    }
    fetchSignedUrl();
    return () => {
      active = false;
    };
  }, [s3Key, s3Bucket, s3Client, title, isDialogOpen]);

  const handleOpenChange = (newOpen) => {
    setIsDialogOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const docUrl = signedUrl || viewUrl;
  const resolvedType = fileType || detectFileType(s3Key ? s3Key : viewUrl);

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button variant="primary">View</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-4xl md:max-w-5xl max-h-[85vh] p-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="px-6 pb-6 flex flex-col" style={{ height: 'calc(85vh - 100px)' }}>
          <div className="flex-1 min-h-0 border rounded-lg bg-muted">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <LoadingState text="Loading document..." />
              </div>
            ) : (
              <DocumentViewer viewUrl={docUrl} fileType={resolvedType} />
            )}
          </div>
          
          {!loading && docUrl && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() =>
                  downloadFile({ url: docUrl, filename: title, title })
                }
                variant="secondary"
                size="sm"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
