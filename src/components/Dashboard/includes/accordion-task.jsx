import React, { useEffect, useRef } from "react";
import { getStatusStyle } from "@/lib/getStatusStyleIcon";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Circle,
  Clock,
  Hourglass,
  Paperclip,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const TaskAccordion = ({ data, defaultOpen }) => {
  const formattedCreatedDate = format(new Date(data.created_at), "MMM d, yyyy");
  const formattedDeadline = format(new Date(data.deadline), "MMM d, yyyy");
  const formattedUpdatedDate = format(new Date(data.updated_at), "MMM d, yyyy");

  const [isOpen, setIsOpen] = React.useState(defaultOpen || false);
  const accordionRef = useRef(null);

  // Scroll to the accordion if defaultOpen is true
  useEffect(() => {
    if (defaultOpen && accordionRef.current) {
      accordionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [defaultOpen]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const getStatusIcon = (state) => {
    switch (state) {
      case "Open":
        return <Circle size={16} className="text-gray-600" />;
      case "Pending":
        return <Hourglass size={16} className="text-blue-600" />;
      case "Completed":
        return <CheckCircle size={16} className="text-green-600" />;
      case "Overdue":
        return <AlertTriangle size={16} className="text-red-600" />;
      case "Blocked":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Circle size={16} className="text-blue-600" />;
    }
  };

  const isOverdue = data.state === "Overdue";
  const { bgColor, textColor, borderColor } = getStatusStyle(data.state);
  const statusIcon = getStatusIcon(data.state);

  const contentVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: [0.33, 1, 0.68, 1],
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.25,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  };

  return (
    <div className="mb-4 w-full" ref={accordionRef}>
      <div
        className={`relative z-[2] flex w-full cursor-pointer flex-col items-start gap-2 rounded-lg border p-4 text-sm leading-tight ${isOpen ? "bg-opacity-70" : ""} ${isOpen ? bgColor : "bg-opacity-50 " + bgColor} ${borderColor}`}
        onClick={toggleAccordion}
        style={{ transform: "translateZ(0)" }}
      >
        <div className="flex w-full items-center justify-between">
          <p className="flex items-center text-base font-medium">
            {isOverdue && (
              <AlertTriangle size={16} className="mr-1 text-red-500" />
            )}
            {data.description}
            {isOverdue ? "!" : ""}
          </p>
          <div className="flex items-center">
            <span
              className={`mr-2 rounded-full px-3 py-1 text-xs ${bgColor} ${textColor} flex items-center border font-medium shadow-sm ${borderColor}`}
            >
              {statusIcon}
              <span className="ml-1">{data.state}</span>
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ transformOrigin: "center" }}
            >
              <ChevronDown size={18} className={textColor} />
            </motion.div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500">Assigned to</p>
          <p className="">{data.assignee_id}</p>
        </div>
        <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
          <span className={`rounded px-2 py-1 ${bgColor} bg-opacity-50`}>
            {data.category}
          </span>
          {data.recurrence && (
            <>
              <span>|</span>
              <span className="flex items-center">
                <Clock size={12} className="mr-1" />
                {data.recurrence}
              </span>
            </>
          )}
          {data.deadline && (
            <>
              <span>|</span>
              <span
                className={cn(
                  "flex items-center",
                  isOverdue ? "font-semibold text-red-600" : "",
                )}
              >
                <Hourglass size={12} className="mr-1" />
                {formattedDeadline}
              </span>
            </>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative z-0 -m-2 mx-1 overflow-hidden rounded-b-lg border-x border-b bg-white px-4 py-3 will-change-transform"
          >
            <div className="space-y-3">
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="flex items-center">
                    <Clock size={14} className="mr-1 text-gray-400" />
                    {formattedCreatedDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="flex items-center">
                    <Clock size={14} className="mr-1 text-gray-400" />
                    {formattedUpdatedDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Deadline</p>
                  <p
                    className={
                      isOverdue
                        ? "flex items-center font-semibold text-red-600"
                        : "flex items-center"
                    }
                  >
                    {isOverdue ? (
                      <AlertTriangle size={14} className="mr-1 text-red-500" />
                    ) : (
                      <Clock size={14} className="mr-1 text-gray-400" />
                    )}
                    {formattedDeadline}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">State</p>
                  <p className={`${textColor} flex items-center`}>
                    {statusIcon}
                    <span className="ml-1">{data.state}</span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-gray-200 pt-2 text-sm">
                <div className="">
                  <p className="mb-1 text-xs text-gray-500">
                    Task Dependencies
                  </p>
                  {data.dependent_task_id ? (
                    <p className="font-mono text-xs">
                      {data.dependent_task_id}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">No dependencies</p>
                  )}
                </div>
                <div className="">
                  <div>
                    <p className="mb-1 text-xs text-gray-500">Attachments</p>
                    {data?.attachments?.length > 0 ? (
                      <div className="flex flex-col gap-1 text-xs">
                        {data.attachments.map((attachment, index) => (
                          <Link
                            key={index}
                            to={attachment.url}
                            className="flex items-center gap-1 truncate"
                          >
                            <Paperclip size={14} className="text-gray-500" />
                            <span className="text-blue-500 hover:underline">
                              {attachment.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">No attachments</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div>
                    <p className="text-gray-500">Approver:</p>
                    <p className="truncate font-mono">{data.approver_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Reviewer:</p>
                    <p className="truncate font-mono">{data.reviewer_id}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskAccordion;
