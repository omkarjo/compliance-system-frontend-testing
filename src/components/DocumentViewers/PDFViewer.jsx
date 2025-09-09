import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import ErrorPage from "@/pages/public/ErrorPage";
import { LoadingState } from "@/components/common/includes/LoadingErrorState";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export function PDFViewer({ viewUrl }) {
  const [numPages, setNumPages] = React.useState(null);

  return (
    <div className="flex flex-col items-center w-full h-full bg-muted overflow-auto">
      <div className="w-full max-w-4xl p-4">
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
          className="flex flex-col items-center"
        >
          {Array.from({ length: numPages || 1 }, (_, i) => (
            <div key={i + 1} className="mb-4 shadow-lg">
              <Page 
                pageNumber={i + 1} 
                width={Math.min(window.innerWidth * 0.8, 800)}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}
