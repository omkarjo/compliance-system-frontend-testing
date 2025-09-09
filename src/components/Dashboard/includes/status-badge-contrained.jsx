// import AnimateChangeInHeight from "@/components/includes/AnimateChangeInHeight";
// import FormGenerate from "@/components/includes/FormGenrate";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { getStatusIcon, getStatusStyle } from "@/lib/getStatusStyleIcon";
// import { cn } from "@/lib/utils";
// import {
//   FILE_CONSTRAIN_FORM,
//   TEXT_CONSTRAIN_FORM,
// } from "@/schemas/form/StatusConstrain";
// import {
//   fileConstrainSchema,
//   textConstrainSchema,
// } from "@/schemas/zod/statusContrainSchema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { motion } from "framer-motion";
// import { AnimatePresence } from "motion/react";
// import { useCallback, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";

// const STATUS_OPTIONS = [
//   { label: "Open", value: "Open", constrainedType: "text" },
//   { label: "Pending", value: "Pending", constrainedType: "file" },
//   { label: "Completed", value: "Completed", constrainedType: "file" },
//   { label: "Overdue", value: "Overdue", constrainedType: "text" },
//   { label: "Blocked", value: "Blocked", constrainedType: "text" },
// ];

// export default function StatusBadgeSelectorConstrained({
//   defaultStatus = "Open",
//   options = STATUS_OPTIONS,
//   isUpdating = false,
// }) {
//   const [selectedStatus, setSelectedStatus] = useState(defaultStatus);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [constrainedType, setConstrainedType] = useState("");

//   useEffect(() => {
//     if (selectedStatus === defaultStatus) return;
//     const selectedOption = options.find(
//       (option) => option.value === selectedStatus,
//     );
//     if (selectedOption) {
//       setConstrainedType(selectedOption.constrainedType);
//     } else {
//       setConstrainedType("");
//     }
//   }, [selectedStatus, defaultStatus, options]);

//   const textForm = useForm({
//     resolver: zodResolver(textConstrainSchema),
//     defaultValues: {
//       message: "",
//     },
//   });

//   const fileForm = useForm({
//     resolver: zodResolver(fileConstrainSchema),
//     defaultValues: {
//       attachments: [],
//     },
//   });

//   const handleSubmit = useCallback(async (data) => {
//     console.log("Form data:", data);
//   }, []);

//   const { bgColor, textColor, borderColor } = getStatusStyle(selectedStatus);
//   const icon = getStatusIcon(selectedStatus);

//   return (
//     <>
//       <Button
//         variant="outline"
//         className={cn(
//           bgColor,
//           textColor,
//           borderColor,
//           "flex cursor-pointer items-center space-x-2 rounded-md px-1 py-2 hover:opacity-90",
//           isUpdating && "cursor-not-allowed opacity-50",
//         )}
//         onClick={(e) => {
//           e.stopPropagation();
//           setDialogOpen(true);
//         }}
//       >
//         {icon}
//         <span className="ml-0">
//           {options.find((opt) => opt.value === selectedStatus)?.label}
//         </span>
//       </Button>
//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Change Status</DialogTitle>
//             <DialogDescription>
//               Select a new status for the task.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="w-full">
//             <Select
//               className="w-full max-w-none"
//               defaultValue={selectedStatus}
//               onValueChange={(value) => {
//                 setSelectedStatus(value);
//               }}
//             >
//               <SelectTrigger className={`w-full`}>
//                 <SelectValue placeholder="Select Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 {options.map((option) => {
//                   const { bgColor, textColor, borderColor } = getStatusStyle(
//                     option.value,
//                   );
//                   const icon = getStatusIcon(option.value);
//                   return (
//                     <SelectItem
//                       key={option.value}
//                       value={option.value}
//                       className={cn(
//                         "mx-2 my-1 flex items-center space-x-2 rounded-md py-2 hover:opacity-90",
//                         bgColor,
//                         textColor,
//                         borderColor,
//                       )}
//                     >
//                       {icon}
//                       <span className="ml-0">{option.label}</span>
//                     </SelectItem>
//                   );
//                 })}
//               </SelectContent>
//             </Select>
//           </div>

//           <AnimatePresence mode="sync" initial={false}>
//             <AnimateChangeInHeight>
//               <div className="">
//                 {constrainedType === "text" && (
//                   <FormGenerate
//                     formFields={TEXT_CONSTRAIN_FORM}
//                     submitText="Submit"
//                     form={textForm}
//                     onSubmit={textForm.handleSubmit(handleSubmit)}
//                   />
//                 )}
//                 {constrainedType === "file" && (
//                   <FormGenerate
//                     formFields={FILE_CONSTRAIN_FORM}
//                     form={fileForm}
//                     onSubmit={fileForm.handleSubmit(handleSubmit)}
//                     submitText="Submit"
//                   />
//                 )}
//               </div>
//             </AnimateChangeInHeight>
//           </AnimatePresence>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
