import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";

export function ExcelViewer({ viewUrl }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExcel() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(viewUrl);
        const arrayBuffer = await res.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0];
        const excelRows = [];
        worksheet.eachRow((row) => {
          excelRows.push(row.values.slice(1));
        });
        setRows(excelRows);
      } catch (err) {
        setError("Failed to load Excel file.");
        setRows([]);
      } finally {
        setLoading(false);
      }
    }
    fetchExcel();
  }, [viewUrl]);

  if (loading) return <div className="flex items-center justify-center h-96">Loading Excel...</div>;
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