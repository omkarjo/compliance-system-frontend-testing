export const TEXT_CONSTRAIN_FORM = [
  {
    name: "message",
    label: "Message",
    placeholder: "Please enter a message",
    type: "textarea",
    required: true,
  },
];

export const FILE_CONSTRAIN_FORM = [
  {
    name: "attachments",
    label: "Documents",
    description: "Upload relevant documents",
    type: "file",
    placeholder: "",
    required: true,
    dropZoneConfig: {
      useFsAccessApi: false,
      accept: {
        "application/pdf": [".pdf"],
      },
      maxFiles: 5,
      maxSize: 1024 * 1024 * 4,
      multiple: true,
    },
  },
];
