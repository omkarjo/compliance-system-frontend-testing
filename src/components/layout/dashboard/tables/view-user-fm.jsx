// import { DataTable, SortButton } from "@/components/Table";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { cn } from "@/lib/utils";
// import { useGetUserByName } from "@/react-query/query/user/userQuery";
// import { MoreHorizontal, Trash, User, ViewIcon } from "lucide-react";
// import { cloneElement } from "react";
// import { toast } from "sonner";

// export default function ViewListUser({ actionType = [] }) {
//   const columns = [
//     {
//       accessorKey: "UserName",
//       header: "Name",
//       cell: ({ row }) => (
//         <div className="ms-4 text-left">{row.getValue("UserName")}</div>
//       ),
//     },
//     {
//       accessorKey: "email",
//       header: "Email",
//       cell: ({ row }) => (
//         <div className="text-left text-muted-foreground">{row.getValue("email")}</div>
//       ),
//     },
//     {
//       accessorKey: "role",
//       header: "Role",
//       cell: ({ row }) => (
//         <div className="text-left text-xs text-muted-foreground uppercase">
//           {row.getValue("role")}
//         </div>
//       ),
//     },
//     {
//       id: "actions",
//       enableHiding: false,
//       cell: ({ row }) => {
//         const data = row.original;
//         return (
//           <div className="ms-auto flex w-24 items-center justify-end">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="h-8 w-8 p-0"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <span className="sr-only">Open menu</span>
//                   <MoreHorizontal />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 align="end"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {actionType?.map((action, index) => (
//                   <DropdownMenuItem
//                     key={index}
//                     className={cn("text-sm", action?.className)}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       action.onClick(data);
//                     }}
//                   >
//                     <div className="flex items-center">
//                       {cloneElement(action.icon, {
//                         className: "w-5 h-5",
//                       })}
//                       <span className="ms-2">{action.title}</span>
//                     </div>
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         );
//       },
//     },
//   ];

//   const filterOptions = [
//     // { type: "divider" },
//     // {
//     //   type: "component",
//     //   id: "role",
//     //   name: "User Role",
//     //   icon: <User />,
//     //   relation: ["equals"],
//     //   options: [
//     //     {
//     //       id: "Admin",
//     //       label: "Admin",
//     //       icon: <User className="text-blue-500" />,
//     //     },
//     //     {
//     //       id: "Fund Manager",
//     //       label: "Fund Manager",
//     //       icon: <User className="text-green-500" />,
//     //     },
//     //     {
//     //       id: "Compliance Officer",
//     //       label: "Compliance Officer",
//     //       icon: <User className="text-yellow-500" />,
//     //     },
//     //     {
//     //       id: "Viewer",
//     //       label: "Viewer",
//     //       icon: <User className="text-muted-foreground" />,
//     //     },
//     //   ],
//     // },
//   ];

//   return (
//     <DataTable
//       columns={columns}
//       fetchData={useGetUserByName}
//       filterOptions={filterOptions}
//       initialPageSize={10}
//       searchBox={true}
//       searchBoxPlaceholder="Search users..."
//     />
//   );
// }
