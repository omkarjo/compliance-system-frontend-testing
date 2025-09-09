import FundForm from "@/components/layout/dashboard/includes/FundForm";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCreateFund } from "@/react-query/mutations/Funds/useCreateFund";
import { ArrowLeft } from "lucide-react";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

const initialValues = {
  // fund_Schmema_fields
  scheme_name: "Test Scheme",
  scheme_status: "active",
  scheme_structure_type: "Trust",
  scheme_pan: "ABCDE1234F",
  date_final_draft_ppm: new Date("2023-01-01"),
  date_sebi_ppm_comm: new Date("2023-02-01"),
  date_launch_of_scheme: new Date("2023-03-01"),
  date_initial_close: new Date("2023-04-01"),
  date_final_close: new Date("2023-05-01"),
  commitment_initial_close_cr: 250,
  target_fund_size: 500,
  greenshoe_option: 50,
  terms_end_date: new Date("2030-12-31"),
  extension_permitted: true,
  extended_end_date: new Date("2032-12-31"),
  nav: 100.0,
  date_of_appointment: new Date("2023-06-01"),

  // fund_bank_details_fields
  bank_name: "HDFC Bank",
  bank_ifsc: "HDFC0001234",
  bank_account_name: "Test Account",
  bank_account_no: "123456789012",
  bank_contact_person: "John Doe",
  bank_contact_phone: "+919999999999",

  // fundAIFSchema
  aif_name: "Test AIF",
  aif_pan: "AAAFA1234G",
  aif_registration_no: "INA123456789",
  legal_structure: "Trust",
  category_subcategory: "Category I - Venture Capital Fund",
  custodian_name: "XYZ Custodian",
  rta_name: "CAMS",

  // compliance_officer_details
  compliance_officer_name: "Jane Doe",
  compliance_officer_email: "jane.doe@example.com",
  compliance_officer_phone: "+911234567890",

  // investment_officer_details
  investment_officer_name: "Rohit Sharma",
  investment_officer_designation: "Fund Manager",
  investment_officer_pan: "ABCDE1234X",
  investment_officer_din: "01234567",
};

export default function FundCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync: createFund } = useCreateFund();

  const handleSubmit = async (data) => {
    try {
      await createFund(data);
      navigate("/dashboard/funds-details");
    } catch (error) {
      const data = error?.response?.data || {};
      console.log("Error creating fund:", data);
      console.log("Create Fund failed", error);
    }
  };

  const handleCancel = useCallback(() => {
    navigate("/dashboard/funds-details");
  }, [navigate]);

  return (
    <section className="p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/funds-details"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "flex items-center gap-2",
            )}
          >
            <span className="sr-only">Back to Funds</span>
            <ArrowLeft className="size-4" />
          </Link>
          <h1 className="text-xl font-semibold md:text-2xl">Add New Fund</h1>
        </div>
      </div>
      <main className="mx-4 flex-1 rounded-lg border bg-card p-4 shadow-md">
        <FundForm
          onSubmit={handleSubmit}
          initialValues={initialValues}
          onCancel={handleCancel}
        />
      </main>
    </section>
  );
}
