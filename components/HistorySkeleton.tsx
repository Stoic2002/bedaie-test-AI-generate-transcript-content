import { Skeleton } from "./ui/Skeleton";

export const HistorySkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm shadow-black/5">
      <div className="divide-y divide-[var(--color-border)] flex flex-col">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="px-5 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 space-y-3">
                {/* Title skeleton */}
                <Skeleton className="h-5 w-2/3 max-w-[300px]" />
                
                {/* Meta details skeleton */}
                <div className="flex flex-wrap items-center gap-x-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              
              {/* Action buttons skeleton */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
