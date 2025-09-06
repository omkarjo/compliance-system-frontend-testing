export function getS3Type(key) {
  return key.endsWith("/") ? "folder" : "file";
}

export function getFileName(key) {
  if (!key) return "";
  const parts = key.split("/");
  const last = parts[parts.length - 1];
  return last === "" ? parts[parts.length - 2] : last;
}

export function getBreadcrumbSegments(folder) {
  if (!folder) return [];
  const split = folder.split("/").filter(Boolean);
  return split.map((segment, i) => ({
    name: segment,
    path: split.slice(0, i + 1).join("/") + "/",
  }));
}


export async function getS3SignedUrl(s3Client, bucket, key) {
  if (!s3Client || !bucket || !key) return null;
  try {
    const { GetObjectCommand } = await import("@aws-sdk/client-s3");
    const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 120 });
  } catch {
    return null;
  }
}