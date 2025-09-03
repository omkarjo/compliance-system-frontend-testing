import SheetFundView from "@/components/Fund/SheetFundView";
import { ServerDataTable } from "@/components/Table";
import { Button } from "@/components/ui/button";
import { useGetFundById } from "@/react-query/query/Funds/useGetFundById";
import { useGetFunds } from "@/react-query/query/Funds/useGetFunds";
import { fundColumns } from "@/schemas/columns/fundColumns";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";

export default function FundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const action = searchParams.get("action");

  const [sheet, setSheet] = useState({ isOpen: false, data: null });
  const columns = fundColumns();

  const { data: fundData, isLoading } = useGetFundById(id, {
    enabled: !!id && action === "view",
  });

  const handleOpenView = useCallback((fund) => {
    // Open sheet with fund data
    setSheet({ isOpen: true, data: fund });
  }, []);

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
        <ServerDataTable
          columns={columns}
          fetchQuery={useGetFunds}
          filterableColumns={[]}
          initialPageSize={10}
          onRowClick={(row) => {
            handleOpenView(row.original);
          }}
          searchPlaceholder="Search Activity..."
          emptyMessage="No activity logs found"
        />
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
