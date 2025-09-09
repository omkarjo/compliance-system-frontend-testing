import { Skeleton } from "@/components/ui/skeleton";

export function InfoCards({ data }) {
  return (
    <div className="flex flex-wrap gap-4">
      {data.map((item, idx) => (
        <div key={idx} className="card-info">
          <span className="text-muted-sm">{item.label}</span>
          <span className="text-label">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function InfoCardsSkeleton() {
  return (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="card-info">
          <Skeleton className="mb-2 h-4 w-20" />
          <Skeleton className="h-6 w-28" />
        </div>
      ))}
      <div className="absolute right-0 bottom-0 mr-1">
        <Skeleton className="rounded-full h-10 w-10" />
      </div>
    </div>
  );
}
