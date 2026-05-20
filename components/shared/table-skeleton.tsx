import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export function TableSkeleton({ rows = 5, cols = 3 }: TableSkeletonProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-card/50 p-4">
      <Skeleton className="h-10 w-full rounded-lg" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
      <span className="sr-only">Loading table with {cols} columns</span>
    </div>
  );
}
