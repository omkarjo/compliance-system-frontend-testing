import { AWS_BUCKET_NAME } from "@/aws/constant";
import { Button } from "@/components/ui/button";
import { getS3Client } from "@/lib/getS3Client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Download, Eye } from "lucide-react";
import { useState } from "react";
import { useAuth } from "react-oidc-context";


export default function FileTableActions({ file }) {
  const auth = useAuth();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!auth.isAuthenticated || !auth.user?.id_token) return;
    setDownloading(true);
    try {
      const s3 = getS3Client({ idToken: auth.user.id_token });
      const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
      const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: file.key,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 300 });
      window.open(url, "_blank");
    } catch (err) {
        console.error("Download error:", err);
      alert("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  const handleView = async () => {
    if (!auth.isAuthenticated || !auth.user?.id_token) return;
    try {
      const s3 = getS3Client({ idToken: auth.user.id_token });
      const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
      const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: file.key,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 300 });
      window.open(url, "_blank");
    } catch (err) {
        console.error("View error:", err);
      alert("View failed");
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="icon" onClick={handleView}>
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDownload}
        disabled={downloading}
      >
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
}