export const taskFormFieldsPart1 = [
  {
    name: "title",
    label: "Title",
    type: "text",
    placeholder: "",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter the description...",
    required: true,
  },
  {
    name: "attachments",
    label: "Supporting Documents",
    discription: "Add relevant task related documents if needed.",
    type: "file",
    placeholder: "",
    required: false,
    multiple: false,
    dropZoneConfig: {
      useFsAccessApi: false,
      accept: {},
      maxFiles: 5,
      maxSize: 1024 * 1024 * 4,
      multiple: true,
    },
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    placeholder: "",
    required: true,
    options: [
      { label: "SEBI", value: "SEBI" },
      { label: "RBI", value: "RBI" },
      { label: "IT/GST", value: "IT/GST" },
      { label: "LP", value: "LP" },
      { label: "Portfolio Company", value: "Portfolio Company" },
    ],
  },
  {
    name: "completion_criteria",
    label: "Completion Criteria",
    type: "select",
    placeholder: "",
    required: true,
    options: [
      { label: "Document Upload", value: "Document Upload" },
      { label: "Textual Information", value: "Textual Information" },
    ],
  },
  {
    name: "deadline",
    label: "Deadline",
    type: "date",
    placeholder: "",
    required: true,
    pastDisable: true,
    futureDisable: false,
  },
  {
    name: "repeat",
    placeholder: "Repeat Task",
    type: "checkbox",
    required: false,
  },
];

export const taskFormFieldsPart2 = [
  {
    name: "every",
    label: "Every",
    type: "number",
    required: true,
    className: "w-1/2 inline-block pe-1",
  },
  {
    name: "recurrence",
    label: "Frequency",
    type: "select",
    required: true,
    className: "w-1/2 inline-block ps-1",
    options: [
      { label: "Day", value: "DAY" },
      { label: "Week", value: "WEEK" },
      { label: "Month", value: "MONTH" },
      { label: "Year", value: "YEAR" },
    ],
  },
];

export const taskFormFieldsPart3 = [
  {
    name: "predecessor_task",
    label: "Predecessor Task",
    type: "select",
    placeholder: "",
    required: true,
    options: [
      { label: "Task 1", value: "Task 1" },
      { label: "Task 2", value: "Task 2" },
      { label: "Task 3", value: "Task 3" },
      { label: "Task 4", value: "Task 4" },
    ],
  },
  {
    name: "assignee_id",
    label: "Assign To",
    type: "user_select",
    required: true,
  },
  {
    name: "reviewer_id",
    label: "Reviewer",
    type: "user_select",
    placeholder: "",
    required: true,
  },
  {
    name: "approver_id",
    label: "Final Reviewer",
    type: "user_select",
    placeholder: "",
    required: true,
  },
];
