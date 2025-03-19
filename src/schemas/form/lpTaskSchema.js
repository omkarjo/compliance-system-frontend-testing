export const lpTaskFields = [
  {
    name: "attachments",
    label: "Supporting Documents",
    discription: "Add relevant task related documents if needed.",
    type: "file",
    placeholder: "",
    required: false,
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
