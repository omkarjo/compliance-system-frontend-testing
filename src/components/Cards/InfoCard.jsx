import { Skeleton } from "../ui/skeleton";

export function InfoCards({ data }) {
  return (
    <div className="flex flex-wrap gap-4">
      {data.map((item, idx) => (
        <div
          key={idx}
          className={`flex w-[228px] flex-col rounded-xl border bg-white p-4 shadow-sm`}
        >
          <span className="text-xs text-gray-500">{item.label}</span>
          <span className="text-sm font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function InfoCardsSkeleton() {
  return (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className={`flex w-[228px] flex-col rounded-xl border bg-white p-4 shadow-sm`}
        >
          <Skeleton className="mb-2 h-4 w-20" />
          <Skeleton className="h-6 w-28" />
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          marginRight: 5,
        }}
      >
        <Skeleton className="rounded-full h-10 w-10" />
      </div>
    </div>
  );
}
