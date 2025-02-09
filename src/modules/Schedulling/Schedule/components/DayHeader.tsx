import { Skeleton } from "@/components/ui/skeleton";

const DayHeader = ({ day, isFetchingSchedule }) => {
  return (
    <th
      key={day.date}
      className=" sticky top-0 z-20  border border-r-0 box-border text-center align-top px-3 py-2 text-xs bg-white cursor-pointer hover:bg-gray-50 mx-auto  h-full border-separate border-spacing-0  border-[#d4e2ed] text-[14px] leading-4"
    >
      <div className="flex flex-col items-center justify-center min-w-32">
        {isFetchingSchedule ? (
          <>
            <Skeleton className="w-[70px] h-[15px] mb-2" />
            <Skeleton className="w-[50px] h-[15px]" />
          </>
        ) : (
          <>
            <div className="flex mb-2 text-sm font-semibold text-gray-600 whitespace-nowrap">
              {day.day.slice(0, 3)}, {day.date.slice(8, 12)}{" "}
            </div>
            <div className="flex items-center justify-center w-full gap-1">
              <div>
                <div className="h-6 px-2 py-1 text-[#69777D] font-normal bg-popover rounded cursor-not-allowed">
                  SAR {day.sales}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </th>
  );
};

export default DayHeader;
