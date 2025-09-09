import EntityCard, {
  EntityCardSkeleton,
} from "@/components/business/entities/EntityCard";
import React from "react";

const ITEMS_PER_PAGE = 6;

const FundEntities = ({ data, isLoading, openView }) => {
  console.log(data);
  return (
    <div className="flex min-h-[50vh]">
      <div className="flex-1">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <EntityCardSkeleton key={i} />
            ))
          ) : data?.data?.length === 0 ? (
            <div className="text-muted-foreground col-span-full py-10 text-center">
              No entities found.
            </div>
          ) : (
            data?.map((entity) => (
              <EntityCard
                key={entity.entity_id}
                data={entity.entity_details}
                onView={() => openView(entity)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FundEntities;
