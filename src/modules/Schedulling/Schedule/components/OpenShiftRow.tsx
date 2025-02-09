// Components
import { useState } from "react";
import ScheduledShift from "./ScheduledShift";

// Icons
import OpenShiftIcon from "@/assets/icons/OpenShift";
import { TScheduledDay } from "../types/types";
import useCommonRequests from "@/hooks/useCommonRequests";
import { getHoursAndMinutes } from "../helpers/helpers";

const OpenShiftRow = ({
  days,
  departmentId,
  fromOpenShift,
  sortBy,
}: {
  days: TScheduledDay[];
  departmentId?: string;
  fromOpenShift?: boolean;
  sortBy: string;
}) => {
  const [cellIndex, setCellIndex] = useState<number | null>(null);

  const { departmentsSelect } = useCommonRequests({
    getDepartments: true,
  });

  const totalHours = days?.reduce((acc, day) => {
    return (
      acc +
      day?.shifts?.reduce((acc, shift) => {
        if (!shift.employee_id) {
          return acc + shift.hours;
        }
        return acc;
      }, 0)
    );
  }, 0);

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
            <span className="font-normal text-gray-500">
              {getHoursAndMinutes(totalHours)}
            </span>
          </div>
        </div>
      </th>
      {days?.map((day, i) => (
        <ScheduledShift
          setCellIndex={setCellIndex}
          cellIndex={cellIndex}
          index={i}
          nextDay={days[i + 1]?.date}
          prevLastDay={days[days.length - 2]?.date}
          departments={departmentsSelect?.map((dep) => ({
            name: dep.label,
            id: dep.value,
          }))}
          key={day.day}
          departmentId={departmentId}
          day={day}
          fromOpenShift={fromOpenShift}
          isAvaliabile={true}
          sortBy={sortBy}
        />
      ))}
    </tr>
  );
};

export default OpenShiftRow;
