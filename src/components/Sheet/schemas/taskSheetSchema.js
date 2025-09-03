/**
 * Returns task sheet schema array for generic sheet rendering (no icons).
 * @returns {Array}
 */
export function getTaskSheetSchema() {
  return [
    { key: "deadline", label: "Due by", type: "date" },
    { key: "recurrence", label: "Repeat Task", type: "text" },
    { key: "documents", label: "Attachments", type: "file" },
    { key: "predecessorTask", label: "Predecessor Task", type: "link" },
    { key: "category", label: "Category", type: "text" },
    { key: "assignee_name", label: "Assignee Name", type: "user" },
    { key: "reviewer_name", label: "Reviewer Name", type: "user" },
    { key: "approver_name", label: "Approver Name", type: "user" },
    { key: "created_at", label: "Created At", type: "date" },
    { key: "updated_at", label: "Last Updated", type: "date" },
  ];
}