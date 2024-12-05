import { useState } from "react";

// Icons
import ArrowDownIcon from "@/assets/icons/ArrowDown";

// Components
import OpenShiftRow from "./OpenShiftRow";
import EmployeeRow from "./EmployeeRow";
import { TDepartment, TEmployee, TScheduledDay } from "../types/types";

type TSingleDepartment = {
  department: TDepartment;
  employees: TEmployee[];
  days: TScheduledDay[];
  isFetchingSchedule: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
};
const SingleDepartment = ({
  department,
  employees,
  days,
  isFetchingSchedule,
  setIsEdit,
}: TSingleDepartment) => {
  const [showDepartments, setShowDepartments] = useState(true);


  

  return (
    <>
      <tr className=" bg-white h-2 sticky z-10 top-[68px]">
        <th
          className={` !pt-2 min-w-[150px]   border-l border-[#d4e2ed] px-2 py-1 text-left`}
          colSpan={8}
          onClick={() => setShowDepartments(!showDepartments)}
        >
          <span className="text-gray-600 cursor-pointer select-none flex items-center text-[12px] leading-4 pr-2">
            {!showDepartments ? (
              <ArrowDownIcon className="w-[12px] h-[12px]  mr-1 text-gray-500" />
            ) : (
              <ArrowDownIcon className="w-[12px] h-[12px] rotate-180  mr-1 text-gray-500" />
            )}
            {department.name}
          </span>
        </th>
      </tr>
      <tr className="bg-white sticky z-10 top-[96px] text-content-secondary">
        <th className="!pt-0 !pb-2 min-w-[150px] border-b border-l border-[#d4e2ed] px-2 py-1 text-left">
          <span className="ml-5 font-normal text-content-secondary">
            <span className="scheduleTable__departments sub-title">
              SAR0 / 0%
            </span>
          </span>
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
      {showDepartments && (
        <>
          <OpenShiftRow days={days} departmentId={department.id}  />
          {employees
            .filter((employee) =>
              employee.departments?.find((dep) => dep.id === department.id)
            )
            .map((employee) => {
              // get the position of employee that realated to this department
              // because each employee can exist in multiple departments so have multiple position
              const positionId = employee.departments?.find(
                (dep) => dep.id === department.id
              )?.pivot.forecast_position_id;

              
              return (
                <EmployeeRow
                  key={employee.first_name + employee.last_name}
                  employee={employee}
                  departmentId={department.id}
                  positionId={positionId as number}
                  days={days}
                  isFetchingSchedule={isFetchingSchedule}
                  setIsEdit={setIsEdit}
                />
              );
            })}
        </>
      )}
    </>
  );
};

export default SingleDepartment;
