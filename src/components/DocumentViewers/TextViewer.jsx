import React, { useEffect, useState } from "react";

export function TextViewer({ viewUrl }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchText() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(viewUrl);
        const content = await res.text();
        setText(content);
      } catch (err) {
        setError("Failed to load text file.");
        setText("");
      } finally {
        setLoading(false);
      }
    }
    fetchText();
  }, [viewUrl]);

  if (loading) return <div className="flex items-center justify-center h-96">Loading text...</div>;
  if (error) return <div>{error}</div>;
  if (!text) return <div>No text data found.</div>;

  return (
    <pre className="bg-gray-50 max-h-[70vh] overflow-auto p-2 border rounded whitespace-pre-wrap text-xs">
      {text}
    </pre>
  );
}