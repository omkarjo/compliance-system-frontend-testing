import FormGenrate from "@/components/includes/FormGenrate";
import { combinedFormSchema } from "@/schemas/form/FundFormSchema";
import { combinedFundFormSchema } from "@/schemas/zod/fundSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function FundForm({ onSubmit, initialValues = {}, onCancel }) {
  const form = useForm({
    resolver: zodResolver(combinedFundFormSchema),
    defaultValues: initialValues,
  });

  return (
    <FormGenrate
      className="grid grid-cols-1 gap-2 md:grid-cols-2"
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      formFields={combinedFormSchema}
      submitText="Add Fund"
      submitButtonClassName={"col-span-1 -mt-4 md:-mt-8 py-1 font-semibold"}
      onCancel={onCancel}
    >
      <div className="col-span-1 md:col-span-2" />
    </FormGenrate>
  );
}
