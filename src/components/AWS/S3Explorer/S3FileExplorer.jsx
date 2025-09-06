// import { AWS_BUCKET_NAME } from "@/aws/constant";
// import { Input } from "@/components/ui/input";
// import { getS3Client } from "@/lib/getS3Client";
// import { ListObjectsV2Command } from "@aws-sdk/client-s3";
// import Fuse from "fuse.js";
// import { useEffect, useState } from "react";
// import { useAuth } from "react-oidc-context";
// import { useNavigate, useParams } from "react-router-dom";
// import FileTable from "./FileTable";
// import FolderList from "./FolderList";

// export default function S3Explorer() {
//   const auth = useAuth();
//   const { "*": path = "" } = useParams();
//   const navigate = useNavigate();
//   const [folders, setFolders] = useState([]);
//   const [files, setFiles] = useState([]);
//   const [allFiles, setAllFiles] = useState([]);
//   const [folderCounts, setFolderCounts] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [error, setError] = useState("");

//   const currentPrefix = path ? (path.endsWith("/") ? path : path + "/") : "";

//   useEffect(() => {
//     if (!auth.isAuthenticated || !auth.user?.id_token) return;
//     const fetch = async () => {
//       setError("");
//       try {
//         const s3 = getS3Client({ idToken: auth.user.id_token });
//         const res = await s3.send(
//           new ListObjectsV2Command({
//             Bucket: AWS_BUCKET_NAME,
//             Prefix: currentPrefix,
//             Delimiter: "/",
//           }),
//         );
//         setFolders(res.CommonPrefixes?.map((f) => f.Prefix) || []);
//         setFiles(res.Contents?.filter((f) => f.Key !== currentPrefix) || []);
//       } catch (err) {
//         setError(err.message || "Failed to fetch files");
//       }
//     };
//     fetch();
//   }, [auth.isAuthenticated, auth.user, currentPrefix]);

//   useEffect(() => {
//     if (!auth.isAuthenticated || !auth.user?.id_token || folders.length === 0) {
//       setFolderCounts({});
//       return;
//     }
//     const fetchCounts = async () => {
//       const s3 = getS3Client({ idToken: auth.user.id_token });
//       const result = {};
//       await Promise.all(
//         folders.map(async (prefix) => {
//           try {
//             const data = await s3.send(
//               new ListObjectsV2Command({
//                 Bucket: AWS_BUCKET_NAME,
//                 Prefix: prefix,
//                 Delimiter: "/",
//               }),
//             );
//             const countFiles = data.Contents
//               ? data.Contents.filter((f) => f.Key !== prefix).length
//               : 0;
//             const countFolders = data.CommonPrefixes
//               ? data.CommonPrefixes.length
//               : 0;
//             result[prefix] = countFiles + countFolders;
//           } catch {
//             result[prefix] = 0;
//           }
//         }),
//       );
//       setFolderCounts(result);
//     };
//     fetchCounts();
//   }, [folders, auth.isAuthenticated, auth.user, currentPrefix]);

//   // Global fetch of all files in the bucket for fuzzy search
//   useEffect(() => {
//     if (!auth.isAuthenticated || !auth.user?.id_token) return;
//     const fetchAllFiles = async () => {
//       const s3 = getS3Client({ idToken: auth.user.id_token });
//       let isTruncated = true;
//       let continuationToken = undefined;
//       const all = [];

//       while (isTruncated) {
//         const res = await s3.send(
//           new ListObjectsV2Command({
//             Bucket: AWS_BUCKET_NAME,
//             ContinuationToken: continuationToken,
//           }),
//         );
//         all.push(...(res.Contents || []));
//         isTruncated = res.IsTruncated;
//         continuationToken = res.NextContinuationToken;
//       }
//       setAllFiles(all);
//     };
//     fetchAllFiles();
//   }, [auth.isAuthenticated, auth.user]);

//   const fuse = new Fuse(allFiles, {
//     keys: ["Key"],
//     threshold: 0.3,
//   });

//   const filteredFiles =
//     searchTerm.trim() === ""
//       ? files
//       : fuse.search(searchTerm).map((r) => r.item);

//   return (
//     <div className="px-6 py-8">
//       <div className="mb-6 flex items-center justify-between">
//         <h2 className="text-2xl font-semibold">Folders</h2>
//       </div>

//       <Input
//         placeholder="Search all files..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="mb-4 w-full max-w-md"
//       />

//       <FolderList
//         folders={folders}
//         folderCounts={folderCounts}
//         currentPrefix={currentPrefix}
//         onNavigate={(folder) => {
//           const folderName = folder
//             .replace(currentPrefix, "")
//             .replace(/\/$/, "");
//           navigate(folderName ? `${path ? path + "/" : ""}${folderName}` : "");
//         }}
//       />

//       <FileTable files={filteredFiles} currentPrefix={currentPrefix} />

//       {error && <div className="mt-4 text-red-500">{error}</div>}
//     </div>
//   );
// }
