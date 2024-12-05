import { useState } from "react";

// Components
import { Button } from "@/components/ui/button";
import SinglePopularShift from "./SinglePopularShift";
import Avatar from "@/components/ui/avatar";
import SinglePopularInputs from "./SinglePopularInputs";
import { TDrawerType, TEmployee, TPopularShift } from "../types/types";

import usePopularForm from "../hooks/usePopularForm";
import useScheduletHttp from "../queriesHttp/ScheduleHttp";

type TPopularShiftDrawerBody = {
  isOpen: boolean;
  drawerType: TDrawerType;
  employees: TEmployee[];
  PopularShifts: TPopularShift[];
};
const PopularShiftDrawerBody = ({
  isOpen,
  drawerType,
  employees,
  PopularShifts,
}: TPopularShiftDrawerBody) => {
  const [createShift, setCreateShift] = useState(false);
  const [focusedInput, setFocusedInput] = useState("time_from");

  const handleClose = () => {
    setFocusedInput("");
    form.reset();
  };
  const { addPopularShift, isAddingPopularShift } = useScheduletHttp({
    handleCloseSheet: handleClose,
  });

  const form = usePopularForm();

  return (
    isOpen && (
      <div className="w-full mt-2 text-center">
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

            {PopularShifts?.map((shift) => (
              <SinglePopularShift key={shift.id} shift={shift} />
            ))}
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
                    <span className="font-semibold leading-5 text-gray-600">
                      {name}
                    </span>
                    <span className="text-[10px] font-normal text-gray-500">
                      0/{employee.total_shifts}h
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
