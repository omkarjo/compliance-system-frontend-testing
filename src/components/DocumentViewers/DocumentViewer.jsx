import React from "react";
import { ImageViewer } from "./ImageViewer";
import { PDFViewer } from "./PDFViewer";
import { ExcelViewer } from "./ExcelViewer";
import { CSVViewer } from "./CSVViewer";
import { XMLViewer } from "./XMLViewer";
import { TextViewer } from "./TextViewer";
import ErrorPage from "@/pages/public/ErrorPage";

export function DocumentViewer({ viewUrl, fileType }) {
  if (!viewUrl || !fileType) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50">
        No document to display.
      </div>
    );
  }

  console.log("Rendering DocumentViewer for type:", fileType);

  switch (fileType) {
    case "image":
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <ImageViewer viewUrl={viewUrl} fileType={fileType} />;
    case "pdf":
      return <PDFViewer viewUrl={viewUrl} />;
    case "xlsx":
    case "xls":
    case "excel":
      return <ExcelViewer viewUrl={viewUrl} />;
    case "csv":
      return <CSVViewer viewUrl={viewUrl} />;
    case "xml":
      return <XMLViewer viewUrl={viewUrl} />;
    case "txt":
    case "text":
      return <TextViewer viewUrl={viewUrl} />;
    default:
      return (
        <ErrorPage
          title="Unsupported file type"
          message={`Cannot display files of type: ${fileType}`}
        />
      );
  }
}