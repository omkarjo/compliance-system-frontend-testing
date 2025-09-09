import DialogForm from "@/components/Dashboard/includes/dialog-form";
import PortfolioCompaniesTable from "@/components/PortfolioCompany/PortfolioCompaniesTable";
import SheetPortfolioCompanyView from "@/components/PortfolioCompany/SheetPortfolioCompanyView";
import { ServerDataTable } from "@/components/Table";
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
import { fastapiDateFormatter, formatDate } from "@/lib/formatter";
import { useCreatePortfolioCompany } from "@/react-query/mutations/PortfolioCompanies/useCreatePortfolioCompany";
import { useDeletePortfolioCompany } from "@/react-query/mutations/PortfolioCompanies/useDeletePortfolioCompany";
import { useGETPortfolioCompanies } from "@/react-query/query/PortfolioCompanies/useGetPortfolioCompanies";
import { useGetPortfolioCompanyFullData } from "@/react-query/query/PortfolioCompanies/useGetPortfolioCompaniesById";
import { portfolioCompanyColumns } from "@/components/Table/columns/portfolioCompanyColumns";
import { PortfolioCompanieCreateFeilds } from "@/schemas/feilds/PortfolioCompanieCreateFeilds";
import { PortfolioCompanieSchema } from "@/schemas/zod/PortfolioCompanieSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router";

const subSectorData = {
  SaaS: [
    { label: "Horizontal SaaS", value: "Horizontal SaaS" },
    { label: "Vertical SaaS", value: "Vertical SaaS" },
    {
      label: "Developer Tools & Infrastructure SaaS",
      value: "Developer Tools & Infrastructure SaaS",
    },
    { label: "Security SaaS", value: "Security SaaS" },
  ],
  AI: [
    { label: "Applied AI", value: "Applied AI" },
    { label: "AI Infrastructure", value: "AI Infrastructure" },
    { label: "AI Applications", value: "AI Applications" },
  ],
  Education: [
    { label: "K-12 Learning", value: "K-12 Learning" },
    {
      label: "Higher Education & Test Prep",
      value: "Higher Education & Test Prep",
    },
    {
      label: "Upskilling & Professional Learning",
      value: "Upskilling & Professional Learning",
    },
    { label: "Ed Infrastructure", value: "Ed Infrastructure" },
  ],
  Health: [
    { label: "Digital Health", value: "Digital Health" },
    { label: "Healthtech SaaS", value: "Healthtech SaaS" },
    { label: "Biotech & Life Sciences", value: "Biotech & Life Sciences" },
    {
      label: "Consumer Health & Wellness",
      value: "Consumer Health & Wellness",
    },
  ],
  Logistics: [
    {
      label: "First Mile & Last Mile Delivery",
      value: "First Mile & Last Mile Delivery",
    },
    {
      label: "Freight & Supply Chain Platforms",
      value: "Freight & Supply Chain Platforms",
    },
    {
      label: "Warehousing & Inventory Management",
      value: "Warehousing & Inventory Management",
    },
    {
      label: "Mobility & Fleet Management",
      value: "Mobility & Fleet Management",
    },
  ],
  Media: [
    { label: "Content Platforms", value: "Content Platforms" },
    { label: "Creator Economy Tools", value: "Creator Economy Tools" },
    {
      label: "Gaming & Interactive Media",
      value: "Gaming & Interactive Media",
    },
    {
      label: "Advertising & Marketing Tech",
      value: "Advertising & Marketing Tech",
    },
  ],
  Food: [
    {
      label: "Food Delivery & Cloud Kitchens",
      value: "Food Delivery & Cloud Kitchens",
    },
    { label: "Packaged Foods & FMCG", value: "Packaged Foods & FMCG" },
    {
      label: "Agritech & Farm-to-Consumer",
      value: "Agritech & Farm-to-Consumer",
    },
    {
      label: "Restaurant & Supply Chain Tech",
      value: "Restaurant & Supply Chain Tech",
    },
  ],
  "B2C Commerce": [
    { label: "Marketplaces", value: "Marketplaces" },
    { label: "D2C Brands", value: "D2C Brands" },
    { label: "Social & Live Commerce", value: "Social & Live Commerce" },
    { label: "Subscription Commerce", value: "Subscription Commerce" },
  ],
  Finance: [
    { label: "Fintech Infra", value: "Fintech Infra" },
    { label: "Lending & Credit", value: "Lending & Credit" },
    { label: "Wealth & Investing", value: "Wealth & Investing" },
    { label: "Insurance & Insurtech", value: "Insurance & Insurtech" },
  ],
  "Deep Tech": [
    { label: "Semiconductors & Hardware", value: "Semiconductors & Hardware" },
    { label: "Robotics & Drones", value: "Robotics & Drones" },
    { label: "Space Tech", value: "Space Tech" },
    { label: "Quantum Computing", value: "Quantum Computing" },
  ],
  "B2B Commerce": [
    {
      label: "Horizontal B2B Marketplaces",
      value: "Horizontal B2B Marketplaces",
    },
    { label: "Vertical B2B Marketplaces", value: "Vertical B2B Marketplaces" },
    {
      label: "Procurement & Supply Chain SaaS",
      value: "Procurement & Supply Chain SaaS",
    },
    {
      label: "Cross-border B2B Platforms",
      value: "Cross-border B2B Platforms",
    },
  ],
};


  const searchTypeOptions = [
    {
      label: "Name",
      value: "query",
    },
    {
      label: "Sector",
      value: "sector",
    },
    {
      label: "Product Description",
      value: "product_description",
    },
    {
      label: "Registered Address",
      value: "registered_address",
    },
  ];


const dummyData = {
  startup_brand: "",
  sector: [],
  subSector: [],
  pan: "",
  isin: "",
  product_description: "",
  founders: [{ name: "", email: "", role: "" }],
  fund_id: "",
  amount_invested: "",
  termsheet_sign_date: "",
  funding_date: "",
  ec_sign_date: "",
  latest_valuation: "",
  valuation_date: "",
};

export default function PortfolioCompaniesPage() {
  const [searchParams] = useSearchParams();
  const defaultId = searchParams.get("id");
  const defaultAction = searchParams.get("action");
  const [id, setId] = useState(defaultId);
  const [action, setAction] = useState(defaultAction);
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: deleteCompany } = useDeletePortfolioCompany();

  const isInitialMount = useRef(true);

  const memoID = useMemo(() => {
    return id;
  }, [id]);

  const memoAction = useMemo(() => {
    return action;
  }, [action]);

  const { data, isLoading } = useGetPortfolioCompanyFullData(memoID, {
    enabled: !!memoID && (memoAction === "view" || memoAction === "edit"),
  });

  const [sheet, setSheet] = useState({ isOpen: false, data: null });
  const [dialogProps, setDialogProps] = useState({
    isOpen: false,
    mode: "create",
    title: "",
    description: "",
    submitText: "",
  });

  const { mutateAsync: createPortfolioCompany } = useCreatePortfolioCompany();

  const form = useForm({
    resolver: zodResolver(PortfolioCompanieSchema),
    defaultValues: dummyData,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "founders",
  });

  const handleCreateOpen = useCallback(() => {
    form.reset(dummyData);
    setDialogProps({
      isOpen: true,
      mode: "create",
      title: "Onboard Company",
      description: "Add all relevant company details below",
      submitText: "Onboard",
    });
  }, [form]);

  const handleEditOpen = useCallback(
    (companyData) => {
      const prefill = {
        ...companyData,
        termsheet_sign_date: companyData.termsheet_sign_date
          ? format(new Date(companyData.termsheet_sign_date), "yyyy-MM-dd")
          : "",
        funding_date: companyData.funding_date
          ? format(new Date(companyData.funding_date), "yyyy-MM-dd")
          : "",
        ec_sign_date: companyData.ec_sign_date
          ? format(new Date(companyData.ec_sign_date), "yyyy-MM-dd")
          : "",
        valuation_date: companyData.valuation_date
          ? format(new Date(companyData.valuation_date), "yyyy-MM-dd")
          : "",
        founders: Array.isArray(companyData.founders)
          ? companyData.founders
          : Object.entries(companyData.founders || {}).map(
              ([name, details]) => ({
                name,
                ...details,
              }),
            ),
      };

      form.reset(prefill);

      setDialogProps({
        isOpen: true,
        mode: "edit",
        title: "Edit Company",
        description: "Update the company details below",
        submitText: "Save Changes",
      });
    },
    [form],
  );

  const handleDialogClose = useCallback(() => {
    form.reset(dummyData);
    setDialogProps((prev) => ({ ...prev, isOpen: false }));
  }, [form]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isLoading) return;
    if (data && memoID) {
      if (memoAction === "view") {
        setSheet((prev) => {
          if (
            !prev.isOpen ||
            prev.data?.company?.company_id !== data.company?.company_id
          ) {
            return { isOpen: true, data };
          }
          return prev;
        });
      } else if (memoAction === "edit") {
        handleEditOpen(data.company);
      }
      navigate(location.pathname, { replace: true });
    }
  }, [memoID, memoAction, data, isLoading, navigate, location, handleEditOpen]);

  const openView = useCallback((company) => {
    const cid = company.company_id;
    setId(cid);
    setAction("view");
    setSheet({ isOpen: true, data: company });
  }, []);

  const onSubmit = useCallback(
    async (formValues) => {
      const founders = formValues.founders.reduce((acc, curr) => {
        if (curr.name) {
          acc[curr.name] = {
            email: curr.email,
            role: curr.role,
          };
        }
        return acc;
      }, {});

      const payload = {
        startup_brand: formValues.startup_brand?.trim(),
        sector: formValues.sector,
        subSector: formValues.subSector,
        pan: formValues.pan?.trim().toUpperCase(),
        isin: formValues.isin?.trim().toUpperCase(),
        product_description: formValues.product_description?.trim(),
        founders,
        fund_id: 1,
        amount_invested: Number(formValues.amount_invested),
        termsheet_sign_date: formValues.termsheet_sign_date
          ? fastapiDateFormatter(formValues.termsheet_sign_date)
          : null,
        funding_date: formValues.funding_date
          ? fastapiDateFormatter(formValues.funding_date)
          : null,
        ec_sign_date: formValues.ec_sign_date
          ? fastapiDateFormatter(formValues.ec_sign_date)
          : null,
        latest_valuation: Number(formValues.latest_valuation),
        valuation_date: formValues.valuation_date
          ? fastapiDateFormatter(formValues.valuation_date)
          : null,
      };

      const formData = new FormData();
      formData.append("portfolio_data", JSON.stringify(payload));

      for (const file of formValues.sha_document || []) {
        formData.append("sha_document", file);
      }

      if (dialogProps.mode === "edit" && id) {
      } else {
        await createPortfolioCompany(formData);
      }

      handleDialogClose();
    },
    [createPortfolioCompany, dialogProps.mode, id, handleDialogClose],
  );

  const foundersError = form.formState.errors.founders;

  const sector = form.watch("sector");

  const subSectorOptions = useMemo(() => {
    if (!sector || sector.length === 0) return [];
    form.setValue("subSector" , []);
    return sector.flatMap((sec) => subSectorData[sec] || []);
  }, [sector]);

  const columns = portfolioCompanyColumns(openView, deleteCompany);

  return (
    <section>
      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <Button variant="default" className="px-3" onClick={handleCreateOpen}>
          Onboard Company
        </Button>
      </div>

      <main className="mx-4 flex-1">
        <ServerDataTable
          columns={columns}
          fetchQuery={useGETPortfolioCompanies}
          filterableColumns={[]}
          initialPageSize={10}
          searchableColumns={searchTypeOptions}
          onRowClick={(row) => {
            openView(row.original);
          }}
          searchPlaceholder="Search Activity..."
          emptyMessage="No activity logs found"
        />
      </main>

      <DialogForm
        title={dialogProps.title}
        description={dialogProps.description}
        submitText={dialogProps.submitText}
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        formFields={PortfolioCompanieCreateFeilds}
        isOpen={dialogProps.isOpen}
        onClose={handleDialogClose}
        specialProps={[
          {
            name: "subSector",
            props: {
              options: subSectorOptions,
            },
          },
        ]}
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
                    >
                      <FormControl>
                        <SelectTrigger>
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

              <FormField
                control={form.control}
                name={`founders.${index}.LinkedIn`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter LinkedIn profile URL"
                        {...field}
                      />
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
        onClose={() => {
          setId(null);
          setAction(null);
          setSheet({ isOpen: false, data: null });
        }}
      />
    </section>
  );
}
