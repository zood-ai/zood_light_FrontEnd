import { useState } from "react";

// Components
import { Button } from "@/components/ui/button";
import SinglePopularShift from "./SinglePopularShift";
import Avatar from "@/components/ui/avatar";
import SinglePopularInputs from "./SinglePopularInputs";
import { TDrawerType, TEmployee } from "../types/types";

import usePopularForm from "../hooks/usePopularForm";
import useScheduletHttp from "../queriesHttp/ScheduleHttp";
import useCommonRequests from "@/hooks/useCommonRequests";
import useFilterQuery from "@/hooks/useFilterQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { getHoursAndMinutes } from "../helpers/helpers";

type TPopularShiftDrawerBody = {
  isOpen: boolean;
  drawerType: TDrawerType;
  employees: TEmployee[];
};
const PopularShiftDrawerBody = ({
  isOpen,
  drawerType,
  employees,
}: TPopularShiftDrawerBody) => {
  const [createShift, setCreateShift] = useState(false);
  const [focusedInput, setFocusedInput] = useState("time_from");
  const { shiftTypesSelect } = useCommonRequests({
    getShiftTypes: true,
  });

  const { filterObj } = useFilterQuery();

  const handleClose = () => {
    setFocusedInput("");
    form.reset({
      time_from: "",
      time_to: "",
      branch_id: filterObj["filter[branch]"],
      shift_type_id: shiftTypesSelect?.find(
        (shift) => shift?.type === "regular"
      )?.value,
    });
  };
  const {
    addPopularShift,
    isAddingPopularShift,
    isFetchingPopularShift,
    PopularShiftData: PopularShifts,
  } = useScheduletHttp({
    handleCloseSheet: handleClose,
    fromTable: true,
  });

  const form = usePopularForm();

  return (
    isOpen && (
      <div className="w-full h-[495px] mt-2 overflow-auto text-center">
        {drawerType === "addShiftDrawer" ? (
          <>
            {createShift && focusedInput.length > 0 ? (
              <SinglePopularInputs
                focusedInput={focusedInput}
                handleClose={handleClose}
                shiftAction={createShift}
                setFocusedInput={setFocusedInput}
                form={form}
                popularShiftAction={addPopularShift}
                popularShiftActionLoading={isAddingPopularShift}
              />
            ) : (
              <Button
                variant="outline"
                className="w-[140px] mb-2 "
                onClick={(e) => {
                  e.stopPropagation();
                  setCreateShift(true);
                  setFocusedInput("time_from");
                }}
              >
                Add a Shift
              </Button>
            )}

            {isFetchingPopularShift ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    className="h-[32px] w-[140px] mx-auto rounded-xl"
                    key={i}
                  />
                ))}
              </div>
            ) : (
              PopularShifts?.map((shift) => (
                <SinglePopularShift key={shift.id} shift={shift} />
              ))
            )}
          </>
        ) : (
          <div className="space-y-2">
            {employees?.map((employee, i) => {
              const name = employee.first_name + " " + employee.last_name;
              return (
                <div
                  className="flex items-center pb-2 border-b border-gray-100"
                  key={i}
                >
                  <Avatar text={name} bg="secondary" className="w-5 h-5" />
                  <div className="flex flex-col items-start leading-2">
                    <span className="text-xs font-semibold leading-5 text-gray-600">
                      {name}
                    </span>
                    <span className="text-[10px] font-normal text-gray-500">
                      {getHoursAndMinutes(employee?.total_shifts)}/
                      {getHoursAndMinutes(employee?.contract_hrs)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    )
  );
};

export default PopularShiftDrawerBody;
