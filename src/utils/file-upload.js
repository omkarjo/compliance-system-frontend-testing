import { apiWithAuth } from "./api";

export default function fileUpload(file, category) {
  try {
    const formData = new FormData();
    formData.append("name", file.name);
    formData.append("file", file);
    formData.append("category", category);
    return apiWithAuth.post("/api/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.log(error);
  }
}
