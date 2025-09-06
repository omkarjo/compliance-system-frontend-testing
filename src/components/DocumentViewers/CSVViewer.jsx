import React, { useEffect, useState } from "react";
import Papa from "papaparse";

export function CSVViewer({ viewUrl }) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCSV() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(viewUrl);
        const text = await res.text();
        const result = Papa.parse(text, { skipEmptyLines: true });
        setRows(result.data);
      } catch (err) {
        setError("Failed to load CSV file.");
        setRows([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCSV();
  }, [viewUrl]);

  if (loading) return <div className="flex items-center justify-center h-96">Loading CSV...</div>;
  if (error) return <div>{error}</div>;
  if (!rows.length) return <div>No table data found.</div>;

  return (
    <div className="overflow-auto max-h-[70vh]">
      <table className="min-w-full bg-white border">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="border px-2 py-1">{cell ?? ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}