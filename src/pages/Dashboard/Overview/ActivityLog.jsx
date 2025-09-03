import { ServerDataTable } from "@/components/Table/ServerDataTable";
import { useGetAllActivities } from "@/react-query/query/activity/useGetAllActivities";
import { activityColumns } from "@/components/Table/columns/activityColumns";
import { activityFilterOptions } from "@/components/Table/filters/activityFilterOptions";
import React from "react";

export default function ActivityLog() {
  // Prepare columns and filters
  const columns = activityColumns();
  const filterableColumns = activityFilterOptions();

  return (
    <section>
      <main className="mx-4 flex-1">
        <ServerDataTable
          columns={columns}
          fetchQuery={useGetAllActivities}
          filterableColumns={filterableColumns}
          initialPageSize={15}
          searchPlaceholder="Search Activity..."
          emptyMessage="No activity logs found"
        />
      </main>
    </section>
  );
}
