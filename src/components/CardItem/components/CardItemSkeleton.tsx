import { Skeleton } from '@/components/ui/skeleton';

export function CardItemSkeleton() {
  return (
    <div className="flex flex-col rounded-none h-[290px] w-[210px]">
      <div className="flex flex-col pb-2 w-full bg-white rounded border border-gray-200 border-solid">
        {/* Image skeleton */}
        <div className="flex justify-center self-stretch px-5 pt-4 w-full bg-white rounded border border-gray-200 border-solid">
          <Skeleton className="aspect-[1.07] w-[165px] h-[154px]" />
        </div>

        <div className="px-[8px]">
          {/* Product name skeleton */}
          <div className="mt-2.5 w-full flex justify-center">
            <Skeleton className="h-5 w-32" />
          </div>

          {/* Price skeleton */}
          <div className="mt-2 flex justify-center">
            <Skeleton className="h-5 w-20" />
          </div>

          {/* Button skeleton */}
          <div className="mt-3 w-full">
            <Skeleton className="h-10 w-full rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
