import DialogForm from "@/components/layout/dashboard/includes/dialog-form";
import SheetLPViewFM from "@/components/layout/dashboard/sheet/sheet-lp-view-fm";
import { ServerDataTable } from "@/components/Table";
import { lpColumns } from "@/components/Table/columns/lpColumns";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { useCreateLimitedPartner } from "@/react-query/mutations/LP/useCreateLP";
import { useUpdateLimitedPartner } from "@/react-query/mutations/LP/useUpdateLimitedPartner";
import { useGetLP } from "@/react-query/query/lp/lpQuery";
import { useGetLimitedPartnerById } from "@/react-query/query/lp/useGetLimitedPartnerById";
import {
  CLASS_ISIN_MAP,
  lpCreateFeilds,
  lpFromFields,
} from "@/schemas/feilds/lpFromFields";
import { lpCreateZodSchema, lpSchema } from "@/schemas/zod/lpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Fuse from "fuse.js";
import { Plus, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { toast } from "sonner";

export function getMissingRequiredFields(lpFromFields, lpData) {
  return lpFromFields.filter(
    (field) =>
      field.required && field.name && lpData && lpData[field.name] === null,
  );
}

export function normalizeEnumFields(lpFromFields, lpData) {
  const newLpData = { ...lpData };
  lpFromFields.forEach((field) => {
    if (
      field.type === "select" &&
      field.options &&
      field.name &&
      lpData[field.name]
    ) {
      const value = lpData[field.name];
      const fuse = new Fuse(field.options, {
        keys: ["label", "value"],
        threshold: 0.3,
      });
      const results = fuse.search(String(value));
      if (results.length > 0) {
        newLpData[field.name] = results[0].item.value;
      }
    }
  });
  return newLpData;
}

export default function LPDashboard() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const action = searchParams.get("action");
  const navigate = useNavigate();
  const location = useLocation();

  const columns = lpColumns();

  const [sheet, setSheet] = useState({ isOpen: false, data: null });

  const [createDialog, setCreateDialog] = useState({ isOpen: false });
  const [editDialog, setEditDialog] = useState({
    isOpen: false,
    id: null,
    data: null,
  });

  const { data: lpData, isLoading: isLoadingLpData } = useGetLimitedPartnerById(
    id,
    {
      enabled: !!id && (action === "view" || action === "edit"),
    },
  );

  const createLpMutation = useCreateLimitedPartner();
  const updateLpMutation = useUpdateLimitedPartner();

  const createForm = useForm({
    resolver: zodResolver(lpCreateZodSchema),
  });

  const editForm = useForm({
    resolver: zodResolver(lpSchema),
  });

  useEffect(() => {
    if (isLoadingLpData) return;
    if (lpData && id) {
      const normalizedLpData = normalizeEnumFields(lpFromFields, lpData);

      if (action === "view") {
        setSheet({ isOpen: true, data: normalizedLpData });
      } else if (action === "edit") {
        const missingFields = getMissingRequiredFields(
          lpFromFields,
          normalizedLpData,
        );

        setEditDialog({
          isOpen: true,
          id,
          data: normalizedLpData,
          fields: missingFields.length ? missingFields : lpFromFields,
        });
      }
      // navigate(location.pathname, { replace: true });
    }
  }, [id, action, lpData, isLoadingLpData]);

  useEffect(() => {
    if (editDialog.isOpen && editDialog.data) {
      const { emaildrawdowns, dob, date_of_agreement, ...rest } =
        editDialog.data;
      const emailsArray = emaildrawdowns
        ? emaildrawdowns.split(",").map((email) => email.trim())
        : [];

      const formattedDob = dob ? new Date(dob) : null;
      const formattedDateOfAgreement = date_of_agreement
        ? new Date(date_of_agreement)
        : null;

      const updatedData = {
        ...rest,
        emaildrawdowns: emailsArray,
        dob: formattedDob,
        date_of_agreement: formattedDateOfAgreement,
      };
      console.log("Updated Data for Edit Form:", updatedData);
      editForm.reset(updatedData);
    } else {
      editForm.reset();
    }
  }, [editDialog.isOpen, editDialog.data, editForm]);

  const handleEditDialogOpen = useCallback((data) => {
    setEditDialog({ isOpen: true, id: data.lp_id, data });
  }, []);

  const handleCreateDialogOpen = useCallback(() => {
    setCreateDialog({ isOpen: true });
    createForm.reset();
  }, [createForm]);

  const handleCreateDialogClose = useCallback(() => {
    createForm.reset();
    setCreateDialog({ isOpen: false });
  }, [createForm]);

  const onSubmitCreate = useCallback(
    async (data) => {
      try {
        createLpMutation.mutate(data);
        createForm.reset();
        handleCreateDialogClose();
      } catch (error) {
        const description =
          error?.response?.data?.detail ||
          error?.response?.data?.msg ||
          (typeof error?.response?.data === "string"
            ? error.response.data
            : "Unknown error occurred");

        toast.error("Failed to onboard Limited Partner", { description });
      }
    },
    [createForm, handleCreateDialogClose, createLpMutation],
  );

  const onSubmitEdit = useCallback(
    async (data) => {
      try {
        await updateLpMutation.mutateAsync({ id: editDialog.id, values: data });
        editForm.reset();
        setEditDialog({ isOpen: false, id: null, data: null });
      } catch (error) {
        const description =
          error?.response?.data?.detail ||
          error?.response?.data?.msg ||
          (typeof error?.response?.data === "string"
            ? error.response.data
            : "Unknown error occurred");

        toast.error("Failed to update Limited Partner", { description });
      }
    },
    [editDialog.id, editForm, updateLpMutation],
  );

  const classOfShares = editForm.watch("class_of_shares");

  useEffect(() => {
    if (classOfShares) {
      editForm.setValue("isin", CLASS_ISIN_MAP[classOfShares] || "");
    }
  }, [editForm, classOfShares]);

  return (
    <section>
      <Tabs defaultValue="list" className="h-full w-full">
        <div className="flex items-center justify-between gap-4 px-4 py-2">
          <div className="flex w-full items-center justify-between gap-2 px-2">
            <div className="flex items-center gap-2">
              <Button
                className="flex items-center gap-1 px-3 text-sm"
                onClick={handleCreateDialogOpen}
              >
                <Plus className="size-4" />
                <span className="max-md:hidden">Onboard Limited Partner</span>
              </Button>
              <Button variant="outline" className="px-3" asChild>
                <Link to="/dashboard/limited-partners/bulk-upload">
                  <Upload className="size-4" /> Upload
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <main className="mx-4 flex-1">
          <ServerDataTable
            columns={columns}
            fetchQuery={useGetLP}
            filterableColumns={[]}
            initialPageSize={15}
            onRowClick={(row) => {
              setSheet({ isOpen: true, data: row.original });
            }}
            searchPlaceholder="Search Activity..."
            emptyMessage="No activity logs found"
          />
        </main>
      </Tabs>

      <DialogForm
        title={"Update Limited Partner"}
        description={"Update the details."}
        submitText={"Update"}
        form={editForm}
        onSubmit={editForm.handleSubmit(onSubmitEdit)}
        formFields={editDialog.fields || lpFromFields}
        isOpen={editDialog.isOpen}
        onClose={() => setEditDialog({ isOpen: false, id: null, data: null })}
      />
      <DialogForm
        title={"Onboard Limited Partner"}
        description={
          "You can upload the 'Contribution Agreement' to automatically fill all fields."
        }
        submitText={"Onboard"}
        form={createForm}
        onSubmit={createForm.handleSubmit(onSubmitCreate)}
        formFields={lpCreateFeilds}
        isOpen={createDialog.isOpen}
        onClose={handleCreateDialogClose}
      />

      <SheetLPViewFM
        isOpen={sheet.isOpen}
        data={sheet.data}
        onClose={() => setSheet({ isOpen: false, data: null })}
        onEdit={handleEditDialogOpen}
      />
    </section>
  );
}
