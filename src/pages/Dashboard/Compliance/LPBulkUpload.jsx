import { FileInput, FileUploader } from "@/components/extension/file-uploader";
import DataTable from "@/components/includes/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { limitedPartnersApiPaths } from "@/constant/apiPaths";
import createPaginatedFetcher from "@/hooks/createPaginatedFetcher";
import useGetDataWithPagination from "@/hooks/createPaginatedFetcher";
import { cn } from "@/lib/utils";
import { apiWithAuth } from "@/utils/api";
import { Upload } from "lucide-react";
import Papa from "papaparse";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const requiredHeaders = [
  "lp_name",
  "mobile_no",
  "email",
  "address",
  "nominee",
  "pan",
  "dob",
  "doi",
  "gender",
  "date_of_agreement",
  "commitment_amount",
  "acknowledgement_of_ppm",
  "dpid",
  "client_id",
  "cml",
  "isin",
  "class_of_shares",
  "citizenship",
  "type",
  "geography",
  "status",
];

const fileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => {
      return file.type === "text/csv";
    },
    {
      message: "Please upload a valid CSV file.",
    },
  ),
});

const dropZoneConfig = {
  reSelect: true,
  useFsAccessApi: false,
  accept: {
    "text/csv": [".csv"],
  },
  maxFiles: 1,
  maxSize: 1024 * 1024 * 4,
  multiple: false,
};

export default function LPBulkUpload() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const columns = requiredHeaders.map((header) => ({
    accessorKey: header,
    header: header.replace(/_/g, " ").toUpperCase(),
    cell: ({ cell }) => {
      const value = cell.getValue();
      return (
        <div
          className={cn(
            "flex items-center gap-2",
            !value &&
              "flex items-center justify-center rounded-md border-2 border-red-500",
          )}
        >
          <span className="max-w-36 truncate text-sm text-gray-700">
            {value || "-"}
          </span>
        </div>
      );
    },
  }));

  const handelData = useCallback((data) => {
    console.log("Parsed data:", data);
    setData(data);
  }, []);

  const handleFileChange = useCallback(
    async (files) => {
      setIsDisabled(true);
      setError(null);
      setFiles([]);

      if (files.length > 0) {
        const file = files[0];
        try {
          const parsedFile = await fileUploadSchema.parseAsync({
            file,
          });
          setFiles([parsedFile.file]);
          console.log("Parsed file:", parsedFile);
          Papa.parse(parsedFile.file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              const headers = results.meta.fields;

              const missingHeaders = requiredHeaders.filter(
                (header) => !headers.includes(header),
              );
              if (missingHeaders.length > 0) {
                toast.error(
                  `Missing required headers: ${missingHeaders.join(", ")}`,
                );
                setError(
                  `Missing required headers: ${missingHeaders.join(", ")}`,
                );
                setFiles([]);
                return;
              }

              console.log("CSV headers:", headers);
              console.log("Parsed CSV data:", results);
              handelData(results.data);
            },
            error: (error) => {
              console.error("Error parsing CSV file:", error);
              toast.error("Error parsing CSV file. Please check the format.");
              setError("Error parsing CSV file. Please check the format.");
            },
          });
        } catch (error) {
          console.error("File upload error:", error);
          if (error instanceof z.ZodError) {
            toast.error(error.errors[0].message);
            setError(error.errors[0].message);
            return;
          }
          toast.error("Failed to upload file. Please try again.");
        } finally {
          setIsDisabled(false);
        }
      }
    },
    [handelData],
  );
  const handleValidation = useMemo(() => {
    if (!data) return null;
    const total = data.length;
    const missingFields = requiredHeaders.reduce((acc, header) => {
      const missingCount = data.filter((row) => !row[header]).length;
      if (missingCount > 0) {
        acc[header] = missingCount;
      }
      return acc;
    }, {});
    return { total, missingFields };
  }, [data]);

  const clearInput = useCallback(() => {
    setFiles([]);
    setData(null);
    setError(null);
  }, []);

  const handleUpload = useCallback(async () => {
    setIsDisabled(true);
    if (!data || data?.length === 0) {
      toast.error("No data to upload. Please upload a valid file.");
      setIsDisabled(false);
      return;
    }
    const validData = data.filter((row) => {
      return requiredHeaders.every((header) => {
        const value = row[header];
        return value !== undefined && value !== null && value !== "";
      });
    });
    if (validData.length === 0) {
      toast.error("No valid data to upload. Please check the file.");
      setIsDisabled(false);
      return;
    }
    console.log("Valid data to upload:", validData);

    const csv = Papa.unparse(validData, {
      fields: requiredHeaders,
    });
    console.log("CSV data to upload:", csv);
    const blob = new Blob([csv], { type: "text/csv" });
    const csv_file = new File([blob], "lp_data.csv", {
      type: "text/csv",
    });

    const formData = new FormData();
    formData.append("file", csv_file);

    try {
      await apiWithAuth.post(
        limitedPartnersApiPaths.bulkUploadLimitedPartner,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 0,
        },
      );

      const invalidRows = data.filter((row) => {
        return requiredHeaders.some((header) => {
          const value = row[header];
          return value === undefined || value === null || value === "";
        });
      });
      if (invalidRows.length > 0) {
        setData(invalidRows);
        toast.success("Upload Data", {
          description:
            "Valid data uploaded successfully. Please correct the invalid data and try again.",
        });
      } else {
        setData([]);
        toast.success("Upload Data", {
          description: "Upload completed successfully.",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Upload failed.");
      } else {
        toast.error("Upload failed. Please try again.");
      }
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }
  }, [data]);

  const fetchData = createPaginatedFetcher(data, "my-table-id");

  return (
    <section className="flex flex-col">
      <header className="flex items-center justify-between gap-4 px-4 py-2">
        <h2 className="text-lg font-semibold md:text-xl">
          Limited Partners Bulk Upload
        </h2>
      </header>
      <main className="flex flex-col items-center justify-center gap-4 overflow-hidden px-4 py-2">
        {data && data.length > 0 ? (
          <div className="flex w-full flex-col items-center justify-between gap-2 px-2">
            <div className="flex w-full items-center justify-between gap-2 px-2">
              <Card className={"gap-1"}>
                {/* <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader> */}
                <CardContent
                  className={"grid gap-4 md:grid-cols-2 lg:grid-cols-3"}
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-gray-500">
                      Total Records
                    </span>
                    <span className="text-lg font-semibold text-gray-700">
                      {handleValidation?.total}
                    </span>
                  </div>
                  {handleValidation?.missingFields && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">
                        Missing Fields
                      </span>
                      <ul className="list-inside list-disc text-sm">
                        {Object.entries(handleValidation.missingFields).map(
                          ([header, count]) => (
                            <li key={header}>
                              {header.replace(/_/g, " ")}: {count}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
              <div className="flex items-center justify-between gap-2 px-2">
                <Button
                  variant=""
                  className=""
                  disabled={isDisabled}
                  onClick={handleUpload}
                >
                  <Upload className="mr-2" />
                  Upload
                </Button>
                <Button
                  variant="destructive"
                  className=""
                  disabled={isDisabled}
                  onClick={clearInput}
                >
                  Cancel
                </Button>
              </div>
            </div>
            <DataTable columns={columns} fetchData={fetchData} />
          </div>
        ) : (
          <FileUploader
            value={files}
            onValueChange={(files) => {
              handleFileChange(files); // Handle file change
            }}
            dropzoneOptions={{
              accept: dropZoneConfig.accept,
              disabled: isDisabled,
            }}
            reSelect={!isDisabled} // Allow re-selection
            className={cn(
              "bg-background relative h-full max-h-64 rounded-lg p-2",
            )}
          >
            <FileInput className="flex min-h-58 items-center justify-center rounded-lg outline-2 outline-gray-400 outline-dashed">
              <div className="flex flex-col items-center justify-center gap-2 pt-3 pb-4">
                <div className="mb-1 rounded-md bg-gray-100 p-4">
                  <Upload className="size-6 text-gray-500" />
                </div>
                <span className="text-sm text-gray-500">
                  Drag and drop your JSON file here or{" "}
                  <span className="text-blue-500 underline">browse</span>
                </span>
                <span className="text-xs text-gray-500">
                  Supported file type: CSV
                </span>
              </div>
            </FileInput>
          </FileUploader>
        )}
      </main>
    </section>
  );
}
