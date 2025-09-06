import { useAppSelector } from "@/store/hooks";
import { S3Client } from "@aws-sdk/client-s3";
import { useMemo } from "react";

let globalS3Client = null;
let lastCredentials = "";

export function useS3Client() {
  const { isAuthenticated, aws_credentials } = useAppSelector(
    (state) => state.user,
  );

  const s3Client = useMemo(() => {
    if (!isAuthenticated || !aws_credentials) return null;
    const { AccessKeyId, SecretKey, SessionToken, region } = aws_credentials;
    const credsKey = `${AccessKeyId}:${SecretKey}:${SessionToken}:${region}`;
    if (!globalS3Client || lastCredentials !== credsKey) {
      globalS3Client = new S3Client({
        region,
        credentials: {
          accessKeyId: AccessKeyId,
          secretAccessKey: SecretKey,
          sessionToken: SessionToken,
        },
      });
      lastCredentials = credsKey;
    }
    return globalS3Client;
  }, [isAuthenticated, aws_credentials]);

  return s3Client;
}
