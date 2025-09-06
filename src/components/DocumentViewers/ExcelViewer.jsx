import ExcelJS from "exceljs";
import React, { useEffect, useRef, useState } from "react";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";

export function ExcelViewer({ viewUrl }) {
  const [columns, setColumns] = useState([]);
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
        if (excelRows.length === 0) {
          setColumns([]);
          setRows([]);
          setLoading(false);
          return;
        }
        const header = excelRows[0];
        const dataRows = excelRows.slice(1);
        setColumns(
          header.map((col, idx) => ({
            key: String(idx),
            name: col || `Column ${idx + 1}`,
            resizable: true,
            sortable: true,
            width: 160,
          })),
        );
        setRows(
          dataRows.map((rowArr, i) => {
            const obj = {};
            rowArr.forEach((cell, idx) => {
              obj[String(idx)] = cell ?? "";
            });
            obj.id = i;
            return obj;
          }),
        );
      } catch (err) {
        setError("Failed to load Excel file.");
        setColumns([]);
        setRows([]);
      } finally {
        setLoading(false);
      }
    }
    fetchExcel();
  }, [viewUrl]);

  function rowKeyGetter(row) {
    return row.id;
  }

  if (loading)
    return (
      <div className="flex h-48 items-center justify-center">
        Loading Excel...
      </div>
    );
  if (error) return <div>{error}</div>;
  if (!columns.length) return <div>No table data found.</div>;

  return (
    <div
      className="max-h-[70vh] w-full max-w-3xl min-w-0 overflow-y-auto md:max-w-4xl"
      style={{
        boxSizing: "border-box",
        padding: 0,
      }}
    >
      <DataGrid
        columns={columns}
        rows={rows}
        rowKeyGetter={rowKeyGetter}
        className="rdg-light"
      />
    </div>
  );
}
