// Components
import { useState } from "react";
import ScheduledShift from "./ScheduledShift";

// Icons
import OpenShiftIcon from "@/assets/icons/OpenShift";
import { TScheduledDay } from "../types/types";

const OpenShiftRow = ({
  days,
  departmentId,
}: {
  days: TScheduledDay[];
  departmentId: string;
}) => {
  const [cellIndex, setCellIndex] = useState<number | null>(null);

  return (
    <tr className="open-shifts">
      <th className="min-w-[150px]  border-b border-l border-[#d4e2ed] px-2 py-1 text-left">
        <div className="flex items-center gap-2 px-4 min-h-[48px]">
          <i className=" bg-gray-100 rounded-full h-[32px] w-[32px]  relative">
            <OpenShiftIcon />
          </i>
          <div className="flex flex-col leading-2">
            <span className="font-semibold leading-5 text-gray-600">
              Open shifts
            </span>
            <span className="font-normal text-gray-500">0h 0m</span>
          </div>
        </div>
      </th>
      {days.map((day, i) => (
        <ScheduledShift
          setCellIndex={setCellIndex}
          cellIndex={cellIndex}
          index={i}
          nextDay={days[i + 1]?.date}
          key={day.day}
          departmentId={departmentId}
          day={day}
          fromOpenShift
          isAvaliabile={true}
        />
      ))}
    </tr>
  );
};

export default OpenShiftRow;
