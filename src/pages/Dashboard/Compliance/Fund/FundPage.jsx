import TableFundView from "@/components/Dashboard/tables/table-fund-view";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router";
import SheetFundView from "@/components/Fund/SheetFundView";
import { useGetFundById } from "@/react-query/query/Funds/useGetFundById";

export default function FundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const action = searchParams.get("action");

  const [sheet, setSheet] = useState({ isOpen: false, data: null });

  const { data: fundData, isLoading } = useGetFundById(id, {
    enabled: !!id && action === "view",
  });

  const handleOpenView = useCallback(
    (fund) => {
      // Open sheet with fund data
      setSheet({ isOpen: true, data: fund });
    },
    []
  );

  // Auto-open from query params
  useEffect(() => {
    if (isLoading) return;
    if (fundData && id && action === "view") {
      setSheet({ isOpen: true, data: fundData });
      navigate(location.pathname, { replace: true });
    }
  }, [id, action, fundData, isLoading, navigate, location]);

  return (
    <section>
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <div className="flex w-full items-center justify-between gap-2 px-2">
          <div className="flex items-center gap-2">
            <Button variant="default" className="px-3" asChild>
              <Link to="/dashboard/funds-details/create">
                <Plus className="size-4" />
                Add Funds
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <main className="mx-4 flex-1">
        <TableFundView openView={handleOpenView} />
      </main>

      {/* Fund Sheet */}
      <SheetFundView
        isOpen={sheet.isOpen}
        data={sheet.data}
        onClose={() => setSheet({ isOpen: false, data: null })}
      />
    </section>
  );
}
