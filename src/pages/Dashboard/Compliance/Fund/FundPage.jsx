import TableFundView from "@/components/Dashboard/tables/table-fund-view";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCallback } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
export default function FundPage() {
  const navigate = useNavigate();
  const handleOpenView = useCallback((fund) => {
    console.log("Open fund view", fund);
    navigate(`/dashboard/funds-details/${fund.fund_id}`);
  }, [navigate]);
  return (
    <section className="">
      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <div className="flex w-full items-center justify-between gap-2 px-2">
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              className="px-3"
              // onClick={handleCapitalCallOpen}
              asChild
            >
              <Link to="/dashboard/funds-details/create">
              <Plus className="size-4" />
              Add Funds
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <main className="mx-4 flex-1">
        <TableFundView openView={handleOpenView} />
      </main>
    </section>
  );
}
