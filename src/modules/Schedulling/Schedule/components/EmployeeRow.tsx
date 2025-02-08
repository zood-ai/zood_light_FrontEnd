import Avatar from "@/components/ui/avatar";
import ScheduledShift from "./ScheduledShift";
import { TEmployee, TScheduledDay } from "../types/types";
import { useState } from "react";
import MoreIcon from "@/assets/icons/More";
import useScheduletHttp from "../queriesHttp/ScheduleHttp";
import useFilterQuery from "@/hooks/useFilterQuery";
import { Loader2 } from "lucide-react";

import { useSearchParams } from "react-router-dom";
import { getHoursAndMinutes } from "../helpers/helpers";
import CloseEyeIcon from "@/assets/icons/CloseEye";

type TEmployeeRow = {
  employee: TEmployee;
  days: TScheduledDay[];
  isFetchingSchedule: boolean;
  departmentId: string;
  positionId: number;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  sortBy: string;
  showAvaliability: boolean;
  isPublished?: boolean;
};
const EmployeeRow = ({
  employee,
  days,
  isFetchingSchedule,
  departmentId,
  positionId,
  setIsEdit,
  sortBy,
  showAvaliability,
  isPublished,
}: TEmployeeRow) => {
  const name = employee.preferred_name
    ? employee.preferred_name
    : `${employee?.first_name || ""} ${employee?.last_name || ""}`;

  const [, setSearchParam] = useSearchParams({});

  const { filterObj } = useFilterQuery();

  const [isHideEmployeeUi, setIsHideEmployeeUi] = useState(false);

  const [cellIndex, setCellIndex] = useState<number | null>(null);
  const [showEmployeeActions, setShowEmployeeActions] =
    useState<boolean>(false);

  const { hideEmployee, isHideEmployee, showEmployee, isShowEmployee } =
    useScheduletHttp({
      handleCloseSheet: () => setShowEmployeeActions(false),
    });

  return (
    <tr className={`${isHideEmployeeUi ? "hidden" : ""}`}>
      <th
        onMouseLeave={() => {
          setShowEmployeeActions(false);
        }}
        className="!p-0 font-normal relative hover:bg-gray-100 min-w-[150px] border-b border-l border-[#d4e2ed] px-2 py-1 text-left"
      >
        <div className="group flex items-center min-w-[285px] hover:bg-gray-100 border-l-0 justify-between px-4 text-gray-600">
          <div className="flex items-center p-2">
            <div className="flex cursor-pointer">
              {employee.image ? (
                <img
                  src={employee?.image}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <Avatar text={name} bg="secondary" />
              )}
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start justify-center ml-2 leading-tight text-s">
                  <span className="w-40 font-semibold text-left truncate">
                    {name}
                  </span>
                  <p className="font-normal text-gray-500">
                    {getHoursAndMinutes(employee?.total_shifts)}/
                    {getHoursAndMinutes(employee?.contract_hrs)}
                  </p>
                </div>
                <div className="absolute hidden group-hover:block right-4">
                  {employee.hided ? (
                    <button
                      disabled={isShowEmployee}
                      onClick={() => {
                        showEmployee({
                          branch_id: filterObj["filter[branch]"],
                          employee_id: employee.id,
                        });
                      }}
                    >
                      {isShowEmployee ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <CloseEyeIcon />
                      )}
                    </button>
                  ) : isHideEmployee ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <div
                      onClick={() =>
                        setShowEmployeeActions(!showEmployeeActions)
                      }
                      className="relative flex items-center justify-center rounded-md w-7 h-7 bg-slate-100"
                    >
                      <MoreIcon />
                      {showEmployeeActions && (
                        <div className="absolute  top-8 -left-2 z-30 w-[200px] bg-white shadow-lg rounded-md">
                          <div className="p-2">
                            <div className="">
                              <button
                                onClick={() => {
                                  setIsEdit(true);
                                  setSearchParam({
                                    id: employee?.id,
                                    ...filterObj,
                                  });
                                }}
                                className="block w-full px-2 py-2 text-left text-gray-500 rounded-md text-s hover:bg-primary-foreground hover:text-white"
                              >
                                Open Profile
                              </button>
                              <button
                                onClick={() => {
                                  setIsHideEmployeeUi(true);
                                  hideEmployee({
                                    branch_id: filterObj["filter[branch]"],
                                    employee_id: employee.id,
                                    from: filterObj.from,
                                    to: filterObj.to,
                                  });
                                  setShowEmployeeActions(false);
                                }}
                                className="block w-full px-2 py-2 text-left text-gray-500 rounded-md text-s hover:bg-primary-foreground hover:text-white"
                              >
                                Hide from list
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </th>

      {days?.map((day, i) => (
        <ScheduledShift
          key={day.date}
          day={day}
          showAvaliability={showAvaliability}
          availabilityTime={employee?.availability?.find(
            (avali) => avali.day === day.day
          )}
          index={i}
          isPublished={isPublished}
          isAvaliabile={
            employee?.availability?.find((avali) => avali.day === day.day)
              ?.is_available as boolean
          }
          employeeId={employee.id}
          departments={employee?.departments}
          nextDay={days[i + 1]?.date}
          prevLastDay={days[days.length - 2]?.date}
          isFetchingSchedule={isFetchingSchedule}
          departmentId={departmentId}
          positionId={positionId}
          sortBy={sortBy}
          setCellIndex={setCellIndex}
          cellIndex={cellIndex}
        />
      ))}
    </tr>
  );
};

export default EmployeeRow;
