import { FileInput, FileUploader } from "@/components/extension/file-uploader";
import DataTable from "@/components/includes/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { limitedPartnersApiPaths } from "@/constant/apiPaths";
import createPaginatedFetcher from "@/hooks/createPaginatedFetcher";
import { cn } from "@/lib/utils";
import { apiWithAuth } from "@/utils/api";
import { CheckCircle, Database, Upload, XCircle } from "lucide-react";
import Papa from "papaparse";
import { use, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import queryClient from "@/query/queryClient";

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
  const [uploadStatus, setUploadStatus] = useState({
    not_uploaded: 0,
    success: 0,
    failed: 0,
  });

  const columnsTable = requiredHeaders.map((header) => ({
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

  const filterOptions = [
    { type: "divider" },
    {
      type: "component",
      id: "state",
      name: "Status",
      icon: <CheckCircle />,
      relation: ["equals"],
      options: [
        {
          id: "Not Uploaded",
          label: "Not Uploaded",
          icon: <XCircle className="text-yellow-400" />,
        },
        {
          id: "Success",
          label: "Success",
          icon: <CheckCircle className="text-green-400" />,
        },
        {
          id: "Failed",
          label: "Failed",
          icon: <XCircle className="text-red-400" />,
        },
      ],
    },
  ];

  const columns = [
    {
      accessorKey: "upload_status",
      header: "Upload Status",
      cell: ({ cell }) => {
        const value = cell.getValue();
        const originalRow = cell.row.original;

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex cursor-default items-center gap-2">
                <Badge
                  variant={
                    originalRow?.error_message ? "destructive" : "secondary"
                  }
                  className={cn(
                    value === "Success" && "bg-green-500 text-white",
                    value === "Failed" && "bg-red-500 text-white",
                    value === "Pending" && "bg-yellow-500 text-white",
                    value === "Not Uploaded" && "bg-gray-500 text-white",
                  )}
                >
                  {value ?? "Not Uploaded"}
                </Badge>
              </div>
            </TooltipTrigger>
            {originalRow?.error_message && (
              <TooltipContent className="text-sm">
                {originalRow?.error_message}
              </TooltipContent>
            )}
          </Tooltip>
        );
      },
    },
    ...columnsTable,
  ];

  const handelData = useCallback((data) => {
    console.log("Parsed data:", data);
    setData(data);
    setUploadStatus({
      not_uploaded: data.length,
      success: 0,
      failed: 0,
    });
    setError(null);
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

    // Remove the row if it upload_status is "Success" and allow only requiredHeaders in the data
    const filteredData = data
      .filter((row) => row.upload_status !== "Success")
      .map((row) => {
        const filteredRow = {};
        requiredHeaders.forEach((header) => {
          filteredRow[header] = row[header];
        });
        return filteredRow;
      });

    if (filteredData.length === 0) {
      toast.error("No valid data to upload. Please check the file.");
      setIsDisabled(false);
      return;
    }

    // if (validData.length === 0) {
    //   toast.error("No valid data to upload. Please check the file.");
    //   setIsDisabled(false);
    //   return;
    // }
    // console.log("Valid data to upload:", validData);

    const csv = Papa.unparse(filteredData, {
      fields: requiredHeaders,
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const csv_file = new File([blob], "lp_data.csv", {
      type: "text/csv",
    });

    const formData = new FormData();
    formData.append("file", csv_file);

    try {
      const response = await apiWithAuth.post(
        limitedPartnersApiPaths.bulkUploadLimitedPartner,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 0,
        },
      );

      const { errors, failed, successful, total } = response.data;

      setData((prev) =>
        prev.map((row, index) => {
          const errorRow = errors.find((error) => error.row - 2 === index);

          if (errorRow) {
            return {
              ...row,
              upload_status: "Failed",
              error_message: errorRow.error,
            };
          }
          return { ...row, upload_status: "Success", error_message: null };
        }),
      );

      if (successful > 0) {
        toast.success(`${successful} limited partners uploaded successfully.`);
      }
      if (failed > 0) {
        toast.error(
          `${failed} limited partners failed to upload. Please check the errors.`,
        );
      }

      setUploadStatus({
        not_uploaded: total - successful - failed,
        success: successful,
        failed: failed,
      });

      queryClient.invalidateQueries("lp-query");
    
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
              <div className="flex items-center flex-wrap justify-between gap-2 px-2">
                <Card className={"gap-1"}>
                  {/* <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader> */}
                  <CardContent className={"grid grid-cols-2 gap-4 px-4"}>
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
                <Card className={"gap-1"}>
                  <CardContent
                    className={"grid gap-4 md:grid-cols-2 lg:grid-cols-3"}
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-gray-500">
                        <Database
                          className="inline-block text-yellow-500"
                          size={16}
                        />
                        Not Uploaded
                      </span>
                      <span className="text-lg font-semibold text-gray-700">
                        {uploadStatus.not_uploaded}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-gray-500">
                        <CheckCircle
                          className="inline-block text-green-500"
                          size={16}
                        />{" "}
                        Success
                      </span>
                      <span className="text-lg font-semibold text-gray-700">
                        {uploadStatus.success}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-gray-500">
                        <XCircle
                          className="inline-block text-red-500"
                          size={16}
                        />{" "}
                        Failed
                      </span>
                      <span className="text-lg font-semibold text-gray-700">
                        {uploadStatus.failed}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
            <DataTable
              columns={columns}
              filterOptions={filterOptions}
              fetchData={({ pageIndex, pageSize, filters }) => {
                let dataWorkingOn = data;
                const filteredOptions = filters?.at(0);

                if (filteredOptions) {
                  const { filterid, optionid } = filteredOptions;
                  if (filterid === "state") {
                    dataWorkingOn = data.filter(
                      (row) => row.upload_status === optionid,
                    );
                  }
                }

                const start = pageIndex * pageSize;
                const end = start + pageSize;
                const paginatedData = dataWorkingOn.slice(start, end);
                const totalCount = dataWorkingOn.length;
                return {
                  data: { data: paginatedData, totalCount },
                  loading: false,
                  error: null,
                };
              }}
            />
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
