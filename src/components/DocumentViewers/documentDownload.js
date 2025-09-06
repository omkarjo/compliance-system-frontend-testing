import { getS3SignedUrl } from "@/lib/S3Utils";
import { toast } from "sonner";

/**
 * Download a file using either a direct URL or an S3 object (signed URL).
 * @param {Object} params
 * @param {string} [params.url] - Direct file URL (optional if S3 params are provided)
 * @param {string} [params.filename] - Desired filename for download
 * @param {object} [params.s3Client] - S3 client from useS3Client
 * @param {string} [params.s3Bucket] - Bucket name
 * @param {string} [params.s3Key] - Object key
 * @param {string} [params.title] - Used as filename in S3 download
 */
export async function downloadFile({
  url,
  filename,
  s3Client,
  s3Bucket,
  s3Key,
  title,
}) {
  let fileUrl = url;
  let name = filename || title;

  // If S3 parameters are present, get signed URL first
  if (s3Client && s3Bucket && s3Key) {
    const signedUrl = await getS3SignedUrl(s3Client, s3Bucket, s3Key, {
      ResponseContentDisposition: `attachment; filename="${name || s3Key.split("/").pop() || "download"}"`,
    });
    fileUrl = signedUrl;
    if (!name) name = s3Key.split("/").pop();
  }

  const abortController = new AbortController();
  let toastId = toast.loading("Downloading...", {
    action: {
      label: "Cancel",
      onClick: () => {
        abortController.abort();
        toast.error("Download cancelled.", { id: toastId });
      },
    },
  });

  try {
    const response = await fetch(fileUrl, { signal: abortController.signal });
    if (!response.ok) throw new Error("Failed to fetch file for download");

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = name || fileUrl.split("/").pop() || "download";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl);
      document.body.removeChild(link);
    }, 1000);

    toast.success("Download started!", { id: toastId });
    setTimeout(() => toast.dismiss(toastId), 2000);
  } catch (err) {
    if (err.name === "AbortError") {
      // Already handled by action
    } else {
      toast.error("Download failed.", { id: toastId });
      setTimeout(() => toast.dismiss(toastId), 2000);
    }
  }
}
