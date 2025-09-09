import DialogForm from "@/components/layout/dashboard/includes/dialog-form";
import FundDetails from "@/components/business/funds/FundDetails";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loading from "@/pages/public/Loading";
import { useCreateFundEntity } from "@/react-query/mutations/FundEntity/useCreateFundEntity";
import { useGetFundById } from "@/react-query/query/Funds/useGetFundById";
import { useGetFundEntitiesByFundId } from "@/react-query/query/Funds/useGetFundEntitiesByFundId";
import { fundEntityLinkFields } from "@/schemas/feilds/fundFormFields";
import { fundEntityLinkSchema } from "@/schemas/zod/fundSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import FundEntities from "./FundEntities";

const FundDetailsPage = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useGetFundById(id);

  const {
    data: fundData,
    isLoading: isFundLoading,
    isError: isFundError,
  } = useGetFundEntitiesByFundId(id);

  const { mutateAsync :  linkEntityToFund } = useCreateFundEntity();

  const form = useForm({
    resolver: zodResolver(fundEntityLinkSchema),
    defaultValues: {
      entity_id: undefined,
      is_primary: false,
    },
  });

  const [defaultTabs, setDefaultTabs] = useState("scheme");
  const [dialogFormProps, setDialogFormProps] = useState({
    isOpen: false,
  });

  const tabs = [
    {
      title: "Scheme",
      value: "scheme",
      children: <FundDetails fund={data} isLoading={isLoading} />,
    },
    {
      title: "Entities",
      value: "entities",
      children: (
        <FundEntities
          data={fundData}
          isLoading={isFundLoading}
          openView={(entity) => console.log("View entity:", entity)}
        />
      ),
    },
  ];

  const handleTabChange = useCallback((value) => {
    setDefaultTabs(value);
  }, []);

  const handleDialogOpen = useCallback(() => {
    setDialogFormProps({
      isOpen: true,
    });
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogFormProps({
      isOpen: false,
    });
  }, []);

  const onSubmit = useCallback(
    async (values) => {
      const payload = {
        fund_id: Number(id),
        entity_id: Number(values.entity_id),
        is_primary: values.is_primary ?? false,
      };

      await linkEntityToFund(payload);
      handleDialogClose();
      form.reset();
    },
    [id, linkEntityToFund, handleDialogClose],
  );

  if (isLoading) {
    return (<Loading message="Loading fund details..." />);
  }

  if (isError || isFundError) {
    return (
      <div className="flex h-96 items-center justify-center text-xl text-red-500">
        Error: {error?.message || "Failed to load fund details."}
      </div>
    );
  }

  console.log("Entities Linked to Fund:", form.getValues());
  return (
    <>
      <Tabs
        defaultValue={defaultTabs}
        className="h-full w-full"
        onValueChange={handleTabChange}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-2">
          <div className="px-4 py-2">
            <TabsList className="flex gap-2">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  <span className="px-0.5 py-0.5 text-xs md:text-sm">
                    {tab.title}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-1 px-3 text-sm"
            onClick={handleDialogOpen}
          >
            <span className="hidden md:inline">Link Entity</span>
            <Plus className="size-4" />
          </Button>
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
        title={"Link Entity"}
        description={"Select an entity to link with this fund."}
        submitText={"Link Entity"}
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        formFields={fundEntityLinkFields}
        isOpen={dialogFormProps.isOpen}
        onClose={handleDialogClose}
      />
    </>
  );
};

export default FundDetailsPage;
