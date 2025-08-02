import { useNavigate, useParams } from "react-router-dom";
import FundForm from "@/components/Dashboard/includes/FundForm";
import Loading from "@/pages/public/Loading";
import ErrorPage from "@/pages/public/ErrorPage";
import { useGetFundById } from "@/react-query/query/Funds/useGetFundById";
import { Button } from "@/components/ui/button";
import { useUpdateFund } from "@/react-query/mutations/Funds/useUpdateFund";

export default function FundEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, isError, } = useGetFundById(id);
  const { mutateAsync: updateFund } = useUpdateFund();

  const handleSubmit = async (formData) => {
    try {
      await updateFund({ id, data: formData });
      navigate("/dashboard/funds");
    } catch (error) {
      console.error("Update Fund failed", error);
    }
  };

  // Show loading screen
  if (isLoading) {
    return <Loading />;
  }

  // Show error screen if data fetch failed
  if (isError || !data) {
    return (
      <ErrorPage
        title="Unable to load fund"
        message="The fund you are trying to edit could not be found or an error occurred while fetching."
        action={
          <Button variant="outline" onClick={() => navigate("/dashboard/funds")}>
            Back to Funds
          </Button>
        }
      />
    );
  }

  // Render form if data is ready
  return (
    <section className="p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold md:text-2xl">Edit Fund Details</h1>
      </div>
      <main className="mx-4 flex-1 rounded-lg border bg-white p-4 shadow-md">
        <FundForm onSubmit={handleSubmit} initialValues={data} />
      </main>
    </section>
  );
}
