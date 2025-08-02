"use client";

import DialogForm from "@/components/Dashboard/includes/dialog-form";
import EntitySheetView from "@/components/Dashboard/sheet/EntitySheetView";
import TableEntitiesView from "@/components/Dashboard/tables/table-entites";
import EntitiesSection from "@/components/Entities/EntitiesSection";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateEntity } from "@/react-query/mutations/Entity/useCreateEntity";
import { useUpdateEntity } from "@/react-query/mutations/Entity/useUpdateEntity";
import {
  alwaysVisibleFields,
  defaultValues,
  gstRequired,
  incorporationDateRequired,
  pocDinPanRequired,
  registrationRequired,
  tanRequired,
} from "@/schemas/constant/Entity";
import { entityFormFields } from "@/schemas/form/EntitiesSchema";
import { EntitySchema } from "@/schemas/zod/EntitiesSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate } from "date-fns";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EntitiesPage() {
  const [dialog, setDialog] = useState({
    isOpen: false,
    variant: "",
    defaultValues: {},
    entity_id: "",
  });

  const [viewEntity, setViewEntity] = useState({
    isOpen: false,
    data: null,
  });

  const [hiddenFields, setHiddenFields] = useState([]);

  const createEntity = useCreateEntity();
  const updateEntity = useUpdateEntity();

  const form = useForm({
    resolver: zodResolver(EntitySchema),
    defaultValues,
  });

  const entityType = form.watch("entity_type");

  useEffect(() => {
    const allFields = entityFormFields.map((field) => field.name);
    const breakingVisible = !entityType;

    const visibleFields = new Set([
      ...alwaysVisibleFields,
      ...(breakingVisible ? [] : ["entity_breaking"]),
      ...(registrationRequired.includes(entityType) ? ["entity_registration_number"] : []),
      ...(tanRequired.includes(entityType) ? ["entity_tan"] : []),
      ...(incorporationDateRequired.includes(entityType) ? ["entity_date_of_incorporation"] : []),
      ...(gstRequired.includes(entityType) ? ["entity_gst_number"] : []),
      ...(pocDinPanRequired.includes(entityType)
        ? ["entity_poc", "entity_poc_din", "entity_poc_pan"]
        : []),
    ]);

    const hidden = allFields.filter((f) => !visibleFields.has(f));
    setHiddenFields(hidden);

    const resetVals = {};
    hidden.forEach((key) => {
      resetVals[key] = defaultValues[key];
    });

    form.reset(
      { ...form.getValues(), ...resetVals },
      { keepDefaultValues: true },
    );
  }, [entityType]);

  const handleDialogOpen = useCallback((variant, data = null) => {
    if (variant === "edit" && data) {
      form.reset(data);
      setDialog({ isOpen: true, variant, defaultValues: data, entity_id: data.id });
    } else {
      form.reset(defaultValues);
      setDialog({ isOpen: true, variant: "create", defaultValues: {}, entity_id: "" });
    }
  }, []);

  const handleDialogClose = useCallback((isOpen) => {
    setDialog((prev) => ({ ...prev, isOpen }));
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      const { entity_date_of_incorporation, ...rest } = data;

      const payload = {
        ...rest,
        entity_date_of_incorporation: entity_date_of_incorporation
          ? formatDate(new Date(entity_date_of_incorporation), "yyyy-MM-dd")
          : null,
      };

      try {
        if (dialog.variant === "create") {
          createEntity.mutate(payload, {
            onSuccess: () => {
              handleDialogClose(false);
              form.reset(defaultValues);
            },
          });
        } else {
          updateEntity.mutate(
            { id: dialog.entity_id, data: payload },
            {
              onSuccess: () => {
                handleDialogClose(false);
                form.reset(defaultValues);
              },
            },
          );
        }
      } catch (error) {
        toast.error("Failed to submit entity data", {
          description: error?.response?.data?.detail || "Something went wrong",
        });
      }
    },
    [dialog.variant, dialog.entity_id],
  );

  const tabs = [
    { title: "Table", value: "table", children: <TableEntitiesView openView={(data) => setViewEntity({ isOpen: true, data })} /> },
    {
      title: "Card",
      value: "card",
      children: <EntitiesSection openView={(data) => setViewEntity({ isOpen: true, data })} />,
    },
  ];

  const defaultTab =
    typeof window !== "undefined" ? localStorage.getItem("entitiesTab") || "table" : "table";

  const handleTabChange = (value) => {
    localStorage.setItem("entitiesTab", value);
  };

  return (
    <section>
      <Tabs defaultValue={defaultTab} className="h-full w-full" onValueChange={handleTabChange}>
        <div className="flex items-center justify-between px-4 py-2">
          <Button className="flex items-center gap-1 px-3 text-sm" onClick={() => handleDialogOpen("create")}>            <Plus className="size-4" />
            <span className="max-md:hidden">Create Entity</span>
          </Button>
          <TabsList className="flex gap-2">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                <span className="text-xs md:text-sm">{tab.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <main className="mx-4 flex-1">
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.children}
            </TabsContent>
          ))}
        </main>
      </Tabs>

      <DialogForm
        title={dialog.variant === "create" ? "Create Entity" : "Edit Entity"}
        description={
          dialog.variant === "create"
            ? "Fill out the details to create an entity."
            : "Update entity details below."
        }
        submitText={dialog.variant === "create" ? "Create" : "Save Changes"}
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        formFields={entityFormFields}
        isOpen={dialog.isOpen}
        onClose={handleDialogClose}
        variant={dialog.variant}
        hiddenFields={hiddenFields}
        disabledFields={[]}
        specialProps={[]}
      />

      <EntitySheetView
        isOpen={viewEntity.isOpen}
        data={viewEntity.data}
        onClose={(open) => setViewEntity((prev) => ({ ...prev, isOpen: open }))}
      />
    </section>
  );
}