import { Skeleton } from "@/components/ui/skeleton";
import { getRandomNumber } from "../helpers/helpers";

const EmployeeRowSkeleton = () => {
  return (
    <tr>
      <th className="!p-0 font-normal hover:bg-gray-100 min-w-[150px] border-b border-l border-[#d4e2ed] px-2 py-1 text-left">
        <div className="group flex items-center min-w-[285px] hover:bg-gray-100 border-l-0 justify-between px-4 text-gray-600">
          <div className="flex items-center p-2">
            <div className="flex gap-2">
              <Skeleton className="w-[40px] h-[40px] rounded-full" />
              <div>
                <Skeleton className="w-[100px] h-[15px] mb-2" />
                <Skeleton className="w-[70px] h-[15px]" />
              </div>
            </div>
          </div>
        </div>
      </th>
      {Array.from({ length: 7 }).map((_, i) => (
        <td
          key={i}
          className={`relative w-[150px]  cursor-pointer h-[56px] text-center align-top p-1 border-b border-l border-[#d4e2ed] group`}
        >
          {getRandomNumber() === i && <Skeleton className="w-full h-full" />}
        </td>
      ))}
    </tr>
  );
};

export default EmployeeRowSkeleton;
