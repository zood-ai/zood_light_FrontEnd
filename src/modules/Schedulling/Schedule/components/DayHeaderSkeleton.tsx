import { Skeleton } from "@/components/ui/skeleton";

const DayHeaderSkeleton = () => {
  return Array.from({ length: 7 }).map((_, i) => (
    <th
      key={i}
      className=" sticky top-0 z-20  border border-r-0 box-border text-center align-top px-3 py-2 text-xs bg-white cursor-pointer hover:bg-gray-50 mx-auto  h-full border-separate border-spacing-0  border-[#d4e2ed] text-[14px] leading-4"
    >
      <div className="flex flex-col items-center justify-center min-w-32">
        <Skeleton className="w-[70px] h-[15px] mb-2" />
        <Skeleton className="w-[50px] h-[15px]" />
      </div>
    </th>
  ));
};

export default DayHeaderSkeleton;
