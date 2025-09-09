export function ImageViewer({ viewUrl, fileType }) {
  if (!viewUrl) {
    return (
      <div className="flex h-48 items-center justify-center bg-gray-50">
        No image to display.
      </div>
    );
  }

  return (
    <div className="flex max-h-[70vh] items-center justify-center bg-gray-50 p-2">
      <img
        src={viewUrl}
        alt="Document Preview"
        className="max-h-[65vh] max-w-full rounded border"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}
