import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getStatusIcon, getStatusStyle } from "@/lib/getStatusStyleIcon";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, UserCircleIcon } from "lucide-react";

const TaskHoverCard = ({ task, viewMode, onClick }) => {
  const isOverdue = task.state === "Overdue";
  const { bgColor, textColor, borderColor } = getStatusStyle(task.state);
  const statusIcon = getStatusIcon(task.state);

  return (
    <HoverCard key={task.compliance_task_id}>
      <HoverCardTrigger>
        <motion.button
          whileHover={{ scale: 1.02 }}
          className={cn(
            `my-1 flex cursor-pointer flex-col items-start gap-1 rounded-lg border p-2 text-xs leading-tight ${bgColor} ${borderColor}`,
            {
              "my-2": viewMode === "week",
            },
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (typeof onClick === "function") {
              onClick(task);
            }
          }}
        >
          <div className="flex w-full items-center justify-between">
            <p
              className={`leading-none font-medium ${textColor} flex max-w-full items-center`}
            >
              {isOverdue && (
                <AlertTriangle
                  size={12}
                  className="mr-1 flex-shrink-0 text-red-500"
                />
              )}
              <span className="line-clamp-2 break-words">
                {task?.description}
                {isOverdue ? "!" : ""}
              </span>
            </p>
          </div>
        </motion.button>
      </HoverCardTrigger>
      <HoverCardContent
        className="z-50 w-64 rounded-lg border bg-white p-4 shadow-lg"
        side="top"
        align="center"
      >
        <div className="mb-2 flex items-start justify-between">
          <p className="text-xs font-semibold">{task.description}</p>
        </div>
        <div className="space-y-1 text-xs">
          <p className="flex items-center">
            <span className="w-20 font-medium">Category:</span>
            <span className={`ml-1 rounded px-1.5 py-0.5 ${bgColor}`}>
              {task.category}
            </span>
          </p>
          <p className="flex items-center py-1">
            <span className="w-20 font-medium">State:</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${bgColor} ${textColor} flex items-center border font-medium shadow-sm ${borderColor}`}
            >
              {statusIcon}
              <span className="ml-1">{task.state}</span>
            </span>
          </p>
          {task.recurrence && (
            <p className="flex items-center">
              <span className="w-20 font-medium">Recurrence:</span>
              <span className="flex items-center">
                <Clock size={12} className="mr-1" />
                {task.recurrence}
              </span>
            </p>
          )}
          {task.deadline && (
            <p className="flex items-center">
              <span className="w-20 font-medium">Deadline:</span>
              <span
                className={
                  isOverdue
                    ? "flex items-center text-red-600"
                    : "flex items-center"
                }
              >
                {isOverdue ? (
                  <AlertTriangle size={12} className="mr-1 text-red-500" />
                ) : (
                  <Clock size={12} className="mr-1" />
                )}
                {new Date(task.deadline).toLocaleDateString("en-IN")}
              </span>
            </p>
          )}
          {task.assignee_name && (
            <p className="flex items-center">
              <span className="w-20 font-medium">Assignee:</span>
              <span className="flex items-center">
                <UserCircleIcon size={12} className="mr-1" />
                {task.assignee_name}
              </span>
            </p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default TaskHoverCard;
