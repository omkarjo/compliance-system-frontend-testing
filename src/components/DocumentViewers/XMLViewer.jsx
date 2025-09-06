import React, { useEffect, useState } from "react";

export function XMLViewer({ viewUrl }) {
  const [xml, setXml] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchXML() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(viewUrl);
        const text = await res.text();
        setXml(text);
      } catch (err) {
        setError("Failed to load XML file.");
        setXml("");
      } finally {
        setLoading(false);
      }
    }
    fetchXML();
  }, [viewUrl]);

  if (loading) return <div className="flex items-center justify-center h-96">Loading XML...</div>;
  if (error) return <div>{error}</div>;
  if (!xml) return <div>No XML data found.</div>;

  return (
    <pre className="bg-gray-50 max-h-[70vh] overflow-auto p-2 border rounded whitespace-pre-wrap text-xs">
      {xml}
    </pre>
  );
}