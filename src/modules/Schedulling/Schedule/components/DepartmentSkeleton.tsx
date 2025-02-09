import { Skeleton } from "@/components/ui/skeleton";

const DepartmentSkeleton = () => {
  return (
    <>
      <tr className=" bg-white h-2 sticky z-10 top-[68px]">
        <th
          className={` !pt-2 min-w-[150px]   border-l border-[#d4e2ed] px-2 py-1 text-left`}
          colSpan={8}
        >
          <Skeleton className="w-[100px] h-[15px] mb-2" />
        </th>
      </tr>
      <tr className="bg-white sticky z-10 top-[96px] text-content-secondary">
        <th className="!pt-0 !pb-2 min-w-[150px] border-b border-l border-[#d4e2ed] px-2 py-1 text-left">
          <Skeleton className="w-[70px] h-[15px]" />
        </th>

        {Array.from({ length: 7 }).map((_, i) => (
          <th
            className="!border-x-0  pt-0  pb-2 min-w-[150px] border-b border-l border-[#d4e2ed] px-2 py-1 text-left"
            key={i}
          >
            <span className="flex justify-between px-1 text-xs font-normal text-gray-600">
              <span></span>
              <span></span>
            </span>
          </th>
        ))}
      </tr>
    </>
  );
};

export default DepartmentSkeleton;
