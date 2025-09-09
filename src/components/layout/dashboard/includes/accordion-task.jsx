import UserBadge from "@/components/common/includes/UserBadge";
 import { Button } from "@/components/ui/button";
import { getStatusIcon, getStatusStyle } from "@/lib/getStatusStyleIcon";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ActionIcons, UIIcons, UtilityIcons } from "@/components/icons";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import StateChangeSelector from "./state-change-selector";
import useCheckRoles from "@/utils/check-roles";

const STATUS_OPTIONS_ADMIN = [
  { label: "Open", value: "Open" },
  { label: "Pending", value: "Pending" },
  { label: "Completed", value: "Completed" },
  { label: "Review Required", value: "Review Required" },
];

const STATUS_OPTIONS_USER = [{ label: "Completed", value: "Completed" }];

const TaskAccordion = ({ data, defaultOpen, buttons = [] }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || false);
  const accordionRef = useRef(null);
  const havePermission = useCheckRoles(["Fund Manager", "Compliance Officer"]);


  const formattedDates = {
    created: format(new Date(data.created_at), "MMM d, yyyy"),
    updated: format(new Date(data.updated_at), "MMM d, yyyy"),
    deadline: format(new Date(data.deadline), "MMM d, yyyy"),
  };

  const isOverdue = data.state === "Overdue";
  const { statusClass, bgSecondaryColor } = getStatusStyle(data.state);
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
        className={`relative z-[2] flex w-full cursor-pointer flex-col items-start gap-2 rounded-lg border p-4 text-sm leading-tight ${statusClass} ${
          isOpen ? "opacity-70" : "opacity-50"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ transform: "translateZ(0)" }}
      >
        <div className="flex-between w-full">
          <p className="flex items-center text-base font-medium">
            {isOverdue && (
              <UtilityIcons.Alert size={16} className="mr-1 text-destructive" />
            )}
            {data.description}
            {isOverdue ? "!" : ""}
          </p>
          <div className="flex items-center">
            <span className={`mr-2 rounded-full px-3 py-1 text-xs ${statusClass} flex items-center border font-medium shadow-sm`}>
              {statusIcon}
              <span className="ml-1">{data.state}</span>
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ transformOrigin: "center" }}
            >
              <UIIcons.ChevronDown size={18} className="text-current" />
            </motion.div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-muted-sm">Assigned to</p>
          <div className="flex items-center gap-2">
            <UIIcons.UserCircle size={16} className="text-foreground" />
            <p className="font-mono text-xs">
              {data.assignee_name || "Unassigned"}
            </p>
          </div>
        </div>
        <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
          <span className={`rounded px-2 py-1 ${statusClass} bg-opacity-50`}>
            {data.category}
          </span>
          {data.recurrence && (
            <>
              <span>|</span>
              <span className="flex items-center">
                <UIIcons.Clock size={12} className="mr-1" />
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
                <UIIcons.Hourglass size={12} className="mr-1" />
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
            className="relative z-0 -m-2 mx-1 overflow-hidden rounded-b-lg border-x border-b bg-card px-4 py-3 will-change-transform"
          >
            <div className="space-y-3">
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="flex items-center">
                    <Clock size={14} className="mr-1 text-muted-foreground" />
                    {formattedDates.created}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="flex items-center">
                    <Clock size={14} className="mr-1 text-muted-foreground" />
                    {formattedDates.updated}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                  <p
                    className={
                      isOverdue
                        ? "flex items-center font-semibold text-destructive"
                        : "flex items-center"
                    }
                  >
                    {isOverdue ? (
                      <AlertTriangle size={14} className="mr-1 text-destructive" />
                    ) : (
                      <Clock size={14} className="mr-1 text-muted-foreground" />
                    )}
                    {formattedDates.deadline}
                  </p>
                </div>
                <div>
                  <p className="mb-0.5 text-xs text-muted-foreground">State</p>
                  <StateChangeSelector
                    data={data}
                    options={
                      havePermission
                        ? STATUS_OPTIONS_ADMIN
                        : STATUS_OPTIONS_USER
                    }
                  />{" "}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-2 text-sm">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    Task Dependencies
                  </p>
                  {data.dependent_task_id ? (
                    <p className="font-mono text-xs">
                      {data.dependent_task_id}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">No dependencies</p>
                  )}
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Attachments</p>
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
                          <Paperclip size={14} className="text-muted-foreground" />
                          <span className="text-primary hover:underline">
                            {attachment.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No attachments</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div>
                    <p className="text-muted-foreground">Approver:</p>
                    <div className="mt-1 flex items-center gap-2">
                      <UserBadge name={data.approver_name} />
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reviewer:</p>
                    <div className="mt-1 flex items-center gap-2">
                      <UserBadge name={data.reviewer_name} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-2" />
            <div className="flex items-center justify-end gap-2">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant || "outline"}
                  size="sm"
                  onClick={() => button.onClick(data)}
                  className={cn(button.className, "flex items-center gap-1")}
                  disabled={button.disabled}
                >
                  {button.icon && (
                    <span className="mr-1">{<button.icon />}</span>
                  )}
                  {button.label}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskAccordion;
