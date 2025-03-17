import BadgeStatusTask from "@/components/includes/badge-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CircleUserRound, File, Timer, TriangleAlert } from "lucide-react";
import { useCallback } from "react";
import { Link } from "react-router-dom";

const taskDataOrder = [
  "deadline",
  "recurrence",
  "attachements",
  "completionCriteria",
  "predecessorTask",
  "assignee_id",
  "reviewer_id",
  "approver_id",
  "created_at",
  "updated_at",
];

// export const dummyTaskData = {
//   title: "Create LP Report",
//   description: "",
//   supportingDocs: [
//     {
//       name: "example.pdf",
//       size: "2MB",
//       type: "application/pdf",
//     },
//   ],
//   category: "LP",
//   status: "In Progress",
//   completionCriteria: "Document Upload",
//   dueDate: "2025-02-28",
//   repeatTask: true,
//   every: 1,
//   frequency: "YEAR",
//   assignee: "Omkar Joshi",
//   reviewer: "Aviral Bhatnagar",
//   finalReviewer: "Aviral Bhatnagar",
//   predecessorTask: "Create LP Report",
//   createdAt: "2025-02-12",
//   updatedAt: "2025-02-12",
//   attachements: [
//     {
//       name: "example1.pdf",
//       size: "2MB",
//       type: "application/pdf",
//       link: "#",
//     },
//     {
//       name: "example1.pdf",
//       size: "2MB",
//       type: "application/pdf",
//       link: "#",
//     },
//     {
//       name: "example2.pdf",
//       size: "2MB",
//       type: "application/pdf",
//       link: "#",
//     },
//   ],
// };

export default function SheetTask({
  data = {},
  isOpen = true,
  onClose,
  openEdit = () => {},
}) {
  const renderCell = useCallback((key, data) => {
    if (!data) return null;
    const value = data[key];
    if (!value) return null;
    switch (key) {
      case "deadline":
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-gray-500">
              <Timer size={20} />
              Due by:
            </td>
            <td className="pb-4">
              {new Date(value).toLocaleDateString("EN-IN")}
            </td>
          </tr>
        );
      case "recurrence":
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-gray-500">
              Repeat Task:
            </td>
            <td className="pb-4 capitalize">
              <span>
                Every {data?.every} {data.recurrence}
                {data.every > 1 ? "s" : ""}
              </span>
            </td>
          </tr>
        );
      case "attachements":
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-gray-500">
              Attachements:
            </td>
            <td className="pb-4">
              {value?.map((file, index) => (
                <Link
                  key={index}
                  to={file.link}
                  className="my-1 flex items-center gap-2"
                >
                  <File size={20} className="text-gray-500" />
                  <span className="text-blue-600/60 hover:underline">
                    {file.name}
                  </span>{" "}
                </Link>
              ))}
            </td>
          </tr>
        );

      case "completionCriteria":
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-gray-500">
              Completion Criteria:
            </td>
            <td className="pb-4">{value}</td>
          </tr>
        );
      case "predecessorTask":
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-gray-500">
              <TriangleAlert size={20} className="text-yellow-500" />
              Predecessor Task:
            </td>
            <td className="pb-4">
              <Link to={`#`} className="text-blue-600/60 hover:underline">
                {value}
              </Link>
            </td>
          </tr>
        );
      case "assignee_id":
        return (
          <tr key={key} className="">
            <td className="mb-4 text-gray-500">Assignee:</td>
            <td className="flex items-center gap-2 pb-4">
              <CircleUserRound size={20} />
              <span>{value}</span>
            </td>
          </tr>
        );
      case "reviewer_id":
        return (
          <tr key={key} className="">
            <td className="mb-4 text-gray-500">Reviewer:</td>
            <td className="flex items-center gap-2 pb-4">
              <CircleUserRound size={20} />
              <span>{value}</span>
            </td>
          </tr>
        );
      case "approver_id":
        return (
          <tr key={key} className="">
            <td className="mb-6 text-gray-500">Final Reviewer:</td>
            <td className="flex items-center gap-2 pb-6">
              <CircleUserRound size={20} />
              <span>{value}</span>
            </td>
          </tr>
        );
      case "created_at":
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-gray-500">
              Created At:
            </td>
            <td className="pb-4">
              {new Date(value).toLocaleDateString("EN-IN")}
            </td>
          </tr>
        );
      case "updated_at":
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-gray-500">
              Last Updated:
            </td>
            <td className="pb-4">
              {new Date(value).toLocaleDateString("EN-IN")}
            </td>
          </tr>
        );

      default:
        return null;
    }
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right">
        <SheetHeader className={"mt-4 pb-0 md:mt-8"}>
          {data?.category && <Badge variant={"outline"}>{data.category}</Badge>}
          <SheetTitle>{data?.title}</SheetTitle>
          <SheetDescription>
            {data?.description || "No description provided"}
          </SheetDescription>
          <BadgeStatusTask
            type="sucess"
            text={data?.state}
            className={"mt-2"}
          />
          {data?.assignee_id && (
            <div className="mt-2 flex items-center gap-2">
              <CircleUserRound className="h-6 w-6" />
              <span className="text-sm font-semibold">{data.assignee_id}</span>
              <Badge variant={"secondary"}>Current Owner</Badge>
            </div>
          )}
        </SheetHeader>
        <hr className="mx-auto w-11/12" />

        <table className="mx-auto w-11/12 text-sm">
          <tbody className="">
            {taskDataOrder.map((key) => renderCell(key, data))}
          </tbody>
        </table>
        <Button onClick={() => openEdit(data)} className="mx-auto mt-4 w-11/12">
          Edit Task
        </Button>
      </SheetContent>
    </Sheet>
  );
}
