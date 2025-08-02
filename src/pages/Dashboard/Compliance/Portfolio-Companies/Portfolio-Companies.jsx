import DialogForm from "@/components/Dashboard/includes/dialog-form";
import PortfolioCompaniesTable from "@/components/PortfolioCompanies/PortfolioCompaniesTable";
import SheetPortfolioCompanyView from "@/components/PortfolioCompany/SheetPortfolioCompanyView";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatePortfolioCompany } from "@/react-query/mutations/PortfolioCompanies/useCreatePortfolioCompany";
import { useGetPortfolioCompanyById } from "@/react-query/query/PortfolioCompanies/useGetPortfolioCompaniesById";
import { PortfolioCompanieCreateFeilds } from "@/schemas/form/PortfolioCompanieCreateFeilds";
import { PortfolioCompanieSchema } from "@/schemas/zod/PortfolioCompanieSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router";

const dummyData = {
  startup_brand: "GreenHive Agrotech",
  sector: "Agritech",
  pan: "ABCDE1234F",
  isin: "INE123456789",
  product_description:
    "An AI-powered platform helping farmers optimize crop yields and reduce water usage.",
  founders: [
    {
      name: "Ananya Mehta",
      email: "ananya@greenhive.in",
      role: "CEO",
    },
    {
      name: "Ravi Kumar",
      email: "ravi@greenhive.in",
      role: "CTO",
    },
  ],
  fund_id: "fund-xyz-001",
  amount_invested: 20000000, // 2 Crores
  termsheet_sign_date: new Date("2023-04-15"),
  funding_date: new Date("2023-05-01"),
  ec_sign_date: new Date("2023-04-20"),
  latest_valuation: 75000000, // 7.5 Crores
  valuation_date: new Date("2024-01-10"),
};

export default function PortfolioCompaniesPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const action = searchParams.get("action");
  const navigate = useNavigate();
  const location = useLocation();

  const { data: portfolioData, isLoading: isLoadingPortfolioData } =
    useGetPortfolioCompanyById(id, {
      enabled: !!id && (action === "view" || action === "edit"),
    });

  const [sheet, setSheet] = useState({ isOpen: false, data: null });

  const [dialogProps, setDialogProps] = useState({
    isOpen: false,
    title: "",
    description: "",
    submitText: "",
  });

  const { mutateAsync: createPortfolioCompany } = useCreatePortfolioCompany();

  useEffect(() => {
    if (isLoadingPortfolioData) return;
    if (portfolioData && id) {
      if (action === "view") {
        setSheet({ isOpen: true, data: portfolioData });
      } else if (action === "edit") {
        setEditDialog({ isOpen: true, id, data: portfolioData });
      }
      navigate(location.pathname, { replace: true });
    }
  }, [id, action, portfolioData, isLoadingPortfolioData]);

  const form = useForm({
    resolver: zodResolver(PortfolioCompanieSchema),
    defaultValues: dummyData,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "founders",
  });

  const handleDialogOpen = useCallback(() => {
    setDialogProps({
      isOpen: true,
      title: "Onboard Company",
      description: "Add all relevant company details below",
      submitText: "Onboard",
    });
    form.reset();
  }, [form]);

  const handleDialogClose = useCallback(() => {
    form.reset();
    setDialogProps((prev) => ({ ...prev, isOpen: false }));
  }, [form]);

  const onSubmit = useCallback(
    async (data) => {
      const formData = new FormData();

      const founders = data.founders.reduce((acc, curr) => {
        if (curr.name) {
          acc[curr.name] = {
            email: curr.email,
            role: curr.role,
          };
        }
        return acc;
      }, {});

      const portfolioData = {
        startup_brand: data.startup_brand?.trim(),
        sector: data.sector?.trim(),
        pan: data.pan?.trim().toUpperCase(),
        isin: data.isin?.trim().toUpperCase(),
        product_description: data.product_description?.trim(),
        founders,
        fund_id: 1,
        amount_invested: Number(data.amount_invested),
        termsheet_sign_date: data.termsheet_sign_date
          ? format(new Date(data.termsheet_sign_date), "yyyy-MM-dd")
          : null,
        funding_date: data.funding_date
          ? format(new Date(data.funding_date), "yyyy-MM-dd")
          : null,
        ec_sign_date: data.ec_sign_date
          ? format(new Date(data.ec_sign_date), "yyyy-MM-dd")
          : null,
        latest_valuation: Number(data.latest_valuation),
        valuation_date: data.valuation_date
          ? format(new Date(data.valuation_date), "yyyy-MM-dd")
          : null,
      };

      formData.append("portfolio_data", JSON.stringify(portfolioData));

      for (const file of data.sha_document || []) {
        formData.append("sha_document", file);
      }

      createPortfolioCompany(formData);
      handleDialogClose();
      form.reset();
    },
    [createPortfolioCompany, handleDialogClose, form],
  );
  const foundersError = form.formState.errors.founders;
  console.log("Founders Error:", foundersError);

  return (
    <section className="">
      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <div className="flex w-full items-center justify-between gap-2 px-2">
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              className="px-3"
              onClick={handleDialogOpen}
            >
              Onboard Company
            </Button>
          </div>
        </div>
      </div>
      <main className="mx-4 flex-1">
        <PortfolioCompaniesTable
          openView={(data) => setSheet({ isOpen: true, data })}
        />
      </main>

      <DialogForm
        title={"Onboard Company"}
        description={"Add all relevant company details below"}
        submitText={"Onboard"}
        form={form}
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
        formFields={PortfolioCompanieCreateFeilds}
        isOpen={dialogProps.isOpen}
        onClose={handleDialogClose}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Founders</h3>
              <p className="text-muted-foreground text-xs">
                Add details regarding all founders of the company
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", email: "", role: "" })}
            >
              <Plus className="mr-1 h-3 w-3" />
              <span className="hidden sm:inline">Add Founder</span>
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="relative space-y-4 rounded-md border p-4 pt-4"
            >
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute top-1 right-2 text-red-500 hover:bg-transparent"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Remove</span>
                </Button>
              )}

              <FormField
                control={form.control}
                name={`founders.${index}.role`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="w-full"
                    >
                      <FormControl>
                        <SelectTrigger className={"w-full"}>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CEO">CEO</SelectItem>
                        <SelectItem value="CTO">CTO</SelectItem>
                        <SelectItem value="CFO">CFO</SelectItem>
                        <SelectItem value="COO">COO</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`founders.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter founder's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`founders.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter founder's email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
        {foundersError && (
          <p className="mt-2 text-sm text-red-500">
            {foundersError.message || "At least one founder is required."}
          </p>
        )}
      </DialogForm>

      <SheetPortfolioCompanyView
        isOpen={sheet.isOpen}
        data={sheet.data}
        onClose={() => setSheet({ isOpen: false, data: null })}
      />
    </section>
  );
}
