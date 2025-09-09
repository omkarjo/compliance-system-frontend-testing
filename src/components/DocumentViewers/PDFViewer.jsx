import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import ErrorPage from "@/pages/public/ErrorPage";
import { LoadingState } from "../includes/LoadingErrorState";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export function PDFViewer({ viewUrl }) {
  const [numPages, setNumPages] = React.useState(null);

  return (
    <div className="flex items-center justify-center bg-gray-50 p-2">
      <div className="flex-1">
        <Document
          file={viewUrl}
          loading={<LoadingState text="Loading PDF..." />}
          error={
            <ErrorPage
              title="Failed to load PDF"
              message="Unable to display the PDF document."
            />
          }
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from({ length: numPages || 1 }, (_, i) => (
            <Page key={i + 1} pageNumber={i + 1} width={600} />
          ))}
        </Document>
      </div>
    </div>
  );
}
