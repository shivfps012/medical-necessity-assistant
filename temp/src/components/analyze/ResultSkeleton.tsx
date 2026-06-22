import { Skeleton } from "@/components/ui/skeleton";

export function ResultSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Verdict */}
      <Skeleton className="h-16 w-full rounded-lg" />

      {/* Risk meter */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-2 w-full" />
      </div>

      {/* Reasoning */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Gaps */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>

      {/* Citation */}
      <div className="space-y-2 pt-3">
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-36" />
      </div>
    </div>
  );
}