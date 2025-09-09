"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDebounce from "@/hooks/useDebounce";
import { useGetEntities } from "@/react-query/query/Entities/useGetEntities";
import { useMemo, useState } from "react";
import EntityCard, { EntityCardSkeleton } from "./EntityCard";

const ITEMS_PER_PAGE = 6;

export default function EntitiesSection({ openView = () => {} }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, error } = useGetEntities({
    pageIndex: page - 1,
    pageSize: ITEMS_PER_PAGE,
    search: debouncedSearch.trim() || undefined,
  });

  const totalPages = useMemo(() => {
    return Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);
  }, [data?.totalCount]);

  return (
    <section className="flex flex-col space-y-4 p-4">
      {/* Search */}
      <div className="flex items-center justify-between">
        <div className="w-full max-w-sm">
          <Label htmlFor="search" className="sr-only">
            Search Entities
          </Label>
          <Input
            id="search"
            placeholder="Search Entities..."
            className={"w-full"}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="flex min-h-[50vh]">
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading || isFetching ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <EntityCardSkeleton key={i} />
              ))
            ) : isError ? (
              <div className="text-destructive col-span-full py-10 text-center">
                {error.message || "Failed to load entities."}
              </div>
            ) : data?.data?.length === 0 ? (
              <div className="text-muted-foreground col-span-full py-10 text-center">
                No entities found.
              </div>
            ) : (
              data?.data.map((entity) => (
                <EntityCard
                  key={entity.entity_id}
                  data={entity}
                  onView={() => openView(entity)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t pt-4">
        <span className="text-muted-foreground text-sm">
          Page {page} of {totalPages || 1}
        </span>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
