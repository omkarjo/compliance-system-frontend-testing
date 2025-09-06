import { useAppSelector } from "@/store/hooks";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { get, set } from "idb-keyval";
import { useState } from "react";
import { useS3Client } from "./useS3Client";

const S3_INDEXEDDB_KEY = "s3-files-cache";
const S3_INDEXEDDB_META_KEY = "s3-files-cache-meta";

const fetchAllS3Objects = async ({ s3, bucket_name }) => {
  let allFiles = [];
  let token = undefined;
  do {
    const command = new ListObjectsV2Command({
      Bucket: bucket_name,
      ContinuationToken: token,
    });
    const response = await s3.send(command);
    allFiles = allFiles.concat(response.Contents || []);
    token = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (token);
  return allFiles;
};

export const useS3Files = ({ folder = "", search = "" }) => {
  const s3 = useS3Client();
  const { aws_credentials } = useAppSelector((state) => state.user);
  const bucket_name = aws_credentials?.bucket_name || "";
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const getCache = async () => {
    const cache = await get(S3_INDEXEDDB_KEY);
    const meta = await get(S3_INDEXEDDB_META_KEY);
    return { cache: cache || [], lastUpdated: meta?.lastUpdated || null };
  };

  const setCache = async (files) => {
    await set(S3_INDEXEDDB_KEY, files);
    const now = Date.now();
    await set(S3_INDEXEDDB_META_KEY, { lastUpdated: now });
    setLastUpdated(now);
  };

  const result = useQuery({
    queryKey: ["s3-files", bucket_name, folder, search],
    queryFn: async () => {
      if (!s3 || !bucket_name) return { data: [] };

      const { cache, lastUpdated } = await getCache();
      setLastUpdated(lastUpdated);

      const needsRefresh =
        !cache || !lastUpdated || Date.now() - lastUpdated > 60 * 60 * 1000;
      let files = cache;

      if (needsRefresh || isRefreshing) {
        files = await fetchAllS3Objects({ s3, bucket_name });
        await setCache(files);
      }

      const prefix = folder ? folder.replace(/^\//, "") : "";

      if (search) {
        let items = files.filter(
          (obj) => obj.Key.startsWith(prefix) && obj.Key !== prefix,
        );
        const folderSet = new Set();
        items.forEach((file) => {
          const rel = file.Key.substring(prefix.length);
          const parts = rel.split("/");
          if (parts.length > 1) {
            let path = prefix;
            for (let i = 0; i < parts.length - 1; i++) {
              path += parts[i] + "/";
              folderSet.add(path);
            }
          }
        });
        let folders = Array.from(folderSet).map((folderKey) => ({
          Key: folderKey,
          LastModified: "-",
          Size: "-",
          StorageClass: "-",
        }));
        let data = [...folders, ...items];
        const fuse = new Fuse(data, {
          keys: ["Key"],
          threshold: 0.5,
          ignoreLocation: true,
          includeScore: true,
          findAllMatches: true,
        });
        data = fuse.search(search).map((r) => r.item);
        return { data };
      } else {
        let items = files.filter(
          (obj) => obj.Key.startsWith(prefix) && obj.Key !== prefix,
        );
        const folderSet = new Set();
        items.forEach((file) => {
          const rel = file.Key.substring(prefix.length);
          const slash = rel.indexOf("/");
          if (slash !== -1) {
            const folderKey = prefix + rel.substring(0, slash + 1);
            folderSet.add(folderKey);
          }
        });
        let folders = Array.from(folderSet).map((folderKey) => ({
          Key: folderKey,
          LastModified: "-",
          Size: "-",
          StorageClass: "-",
        }));
        let directFiles = items.filter((file) => {
          const rel = file.Key.substring(prefix.length);
          return rel && !rel.includes("/");
        });
        const data = [...folders, ...directFiles];
        return { data };
      }
    },
    staleTime: 10 * 60 * 1000,
    keepPreviousData: true,
    enabled: !!s3 && !!bucket_name,
  });

  const refresh = async () => {
    setIsRefreshing(true);
    const files = await fetchAllS3Objects({ s3, bucket_name });
    await setCache(files);
    queryClient.invalidateQueries(["s3-files", bucket_name]);
    setIsRefreshing(false);
  };

  return {
    data: result.data?.data || [],
    isLoading: result.isLoading,
    error: result.error,
    isRefreshing,
    lastUpdated,
    refresh,
  };
};
