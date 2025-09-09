export function ImageViewer({ viewUrl }) {
  if (!viewUrl) {
    return (
      <div className="flex h-48 items-center justify-center bg-muted text-muted-foreground">
        No image to display.
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-muted p-4">
      <img
        src={viewUrl}
        alt="Document Preview"
        className="max-h-full max-w-full rounded border shadow-lg"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}
