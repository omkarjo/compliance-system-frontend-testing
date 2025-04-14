import UserBadge from "@/components/includes/user-badge";
import { getStatusIcon, getStatusStyle } from "@/lib/getStatusStyleIcon";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronDown,
  Clock,
  Hourglass,
  Paperclip,
  UserCircleIcon,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import StateChangeSelector from "./state-change-selector";

const TaskAccordion = ({ data, defaultOpen }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || false);
  const accordionRef = useRef(null);

  const formattedDates = {
    created: format(new Date(data.created_at), "MMM d, yyyy"),
    updated: format(new Date(data.updated_at), "MMM d, yyyy"),
    deadline: format(new Date(data.deadline), "MMM d, yyyy"),
  };

  const isOverdue = data.state === "Overdue";
  const { bgColor, textColor, borderColor } = getStatusStyle(data.state);
  const statusIcon = getStatusIcon(data.state);

  useEffect(() => {
    if (defaultOpen && accordionRef.current) {
      accordionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [defaultOpen]);

  const contentVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: [0.33, 1, 0.68, 1] },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.25, ease: [0.33, 1, 0.68, 1] },
    },
  };

  return (
    <div className="mb-4 w-full" ref={accordionRef}>
      <div
        className={`relative z-[2] flex w-full cursor-pointer flex-col items-start gap-2 rounded-lg border p-4 text-sm leading-tight ${
          isOpen ? `${bgColor} bg-opacity-70` : `${bgColor} bg-opacity-50`
        } ${borderColor}`}
        onClick={() => setIsOpen(!isOpen)}
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
          <div className="flex items-center gap-2">
            <UserCircleIcon size={16} className="text-gray-800" />
            <p className="font-mono text-xs">
              {data.assignee_name || "Unassigned"}
            </p>
          </div>
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
                {formattedDates.deadline}
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
                    {formattedDates.created}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="flex items-center">
                    <Clock size={14} className="mr-1 text-gray-400" />
                    {formattedDates.updated}
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
                    {formattedDates.deadline}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">State</p>
                  <StateChangeSelector data={data} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-gray-200 pt-2 text-sm">
                <div>
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
                <div>
                  <p className="mb-1 text-xs text-gray-500">Attachments</p>
                  {data?.documents?.length > 0 ? (
                    <div className="flex flex-col gap-1 text-xs">
                      {data?.documents?.map((attachment, index) => (
                        <Link
                          key={index}
                          to={attachment.drive_link}
                          target="_blank"
                          rel="noreferrer noopener"
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

              <div className="border-t border-gray-200 pt-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div>
                    <p className="text-gray-500">Approver:</p>
                    <div className="mt-1 flex items-center gap-2">
                      <UserBadge name={data.approver_name} />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500">Reviewer:</p>
                    <div className="mt-1 flex items-center gap-2">
                      <UserBadge name={data.reviewer_name} />
                    </div>
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
