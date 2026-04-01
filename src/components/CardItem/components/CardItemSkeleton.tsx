import { Skeleton } from '@/components/ui/skeleton';

export function CardItemSkeleton() {
  return (
    <div className="h-full w-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-mainBorder bg-white">
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-gray-100 p-4">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>

        <div className="flex flex-col border-t border-mainBorder bg-white px-2 py-2">
          <div className="mb-1 flex h-8 w-full flex-col items-center justify-center gap-1">
            <Skeleton className="h-3 w-[85%] rounded-md" />
            <Skeleton className="h-3 w-[60%] rounded-md" />
          </div>
          <div className="mt-1 flex justify-center">
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
