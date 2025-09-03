// import { DataTable } from "@/components/Table";
// import { Button } from "@/components/ui/button";
// import { useGetSebiReports } from "@/react-query/query/Sebi/useGetSebiReports";
// import { ArrowUpDown } from "lucide-react";
// import { format } from "date-fns";

// export default function TableSebiReportsView() {
//   const columns = [
//     {
//       accessorKey: "quarter",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Quarter
//           <ArrowUpDown size={16} className="ml-2" />
//         </Button>
//       ),
//       cell: ({ row }) => (
//         <div className="ps-2 text-left font-medium capitalize">
//           {row.getValue("quarter") || "-"}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "created_at",
//       header: "Generated On",
//       cell: ({ row }) => {
//         const date = row.getValue("created_at");
//         return (
//           <div className="ps-2 text-left text-sm text-muted-foreground">
//             {date ? format(new Date(date), "dd MMM yyyy") : "-"}
//           </div>
//         );
//       },
//     },
//     {
//       accessorKey: "document",
//       header: "Document",
//       cell: ({ row }) => {
//         const doc = row.getValue("document");
//         return doc ? (
//           <a
//             href={doc}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="ps-2 text-left text-blue-600 underline"
//           >
//             View Report
//           </a>
//         ) : (
//           <div className="ps-2 text-left text-muted">Not Uploaded</div>
//         );
//       },
//     },
//   ];

//   return (
//     <DataTable
//       columns={columns}
//       fetchData={useGetSebiReports}
//       filterOptions={[]}
//       initialPageSize={10}
//       searchBox
//       searchBoxPlaceholder="Search by quarter..."
//     />
//   );
// }
