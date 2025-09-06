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
import { LoadingState } from "../includes/LoadingErrorState";
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

  useEffect(() => {
    let active = true;
    async function fetchSignedUrl() {
      if (s3Key && s3Bucket && s3Client) {
        setLoading(true);
        const url = await getS3SignedUrl(s3Client, s3Bucket, s3Key, {
          ResponseContentDisposition: `attachment; filename="${title}"`,
        });
        if (active) setSignedUrl(url);
        setLoading(false);
      } else {
        setSignedUrl(null);
      }
    }
    fetchSignedUrl();
    return () => {
      active = false;
    };
  }, [s3Key, s3Bucket, s3Client, title]);

  const docUrl = signedUrl || viewUrl;
  const resolvedType = fileType || detectFileType(s3Key ? s3Key : viewUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button variant="primary">View</Button>}
      </DialogTrigger>
      <DialogContent className="w-full max-w-3xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          {loading ? (
            <LoadingState text="Loading document..." />
          ) : (
            <>
              <div className="max-h-[70vh] overflow-auto">
                <DocumentViewer viewUrl={docUrl} fileType={resolvedType} />
              </div>
              {docUrl && (
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() =>
                      downloadFile({ url: docUrl, filename: title, title })
                    }
                    variant={"secondary"}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
