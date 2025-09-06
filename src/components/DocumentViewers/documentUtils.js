export function detectFileType(fileName) {
  if (!fileName) return "other";
  const name = fileName.toLowerCase();
  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".xml")) return "xml";
  if (name.endsWith(".csv")) return "csv";
  if (name.endsWith(".xls") || name.endsWith(".xlsx")) return "excel";
  if (/\.(png|jpe?g|gif|bmp|webp)$/i.test(name)) return "image";
  if (/\.(txt|log)$/i.test(name)) return "text";
  return "other";
}