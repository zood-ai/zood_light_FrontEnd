import { useDrag } from "react-dnd";
import { TShift } from "../types/types";
import useFilterQuery from "@/hooks/useFilterQuery";
import { Dispatch, SetStateAction, useState } from "react";
import PenIcon from "@/assets/icons/Pen";
import PlusIcon from "@/assets/icons/Plus";
import CopyIcon from "@/assets/icons/Copy";
import RightIcon from "@/assets/icons/Right";
import { formAddShiftSchema } from "../Schema/schema";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import PopularShiftInput from "./PopularShiftInput";

type TSingleDraggedShift = {
  shift: TShift;
  nextDay: string;
  addShiftData: (data: z.infer<typeof formAddShiftSchema>) => void;
  setIsCreateShiftDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditShiftDrawerOpen: Dispatch<SetStateAction<boolean>>;
  form: UseFormReturn<z.infer<typeof formAddShiftSchema>>;
  setShiftId: Dispatch<SetStateAction<string>>;
  setCellIndex: Dispatch<SetStateAction<number | null>>;
  isUpdateShiftData: boolean;
  index: number;
  isAddingShift?: boolean;
  handleUpdateShiftTime: (
    shiftId: string,
    time_from: string,
    time_to: string,
    cb: () => void
  ) => void;
};
const SingleDraggedShift = ({
  shift,
  nextDay,
  addShiftData,
  setIsCreateShiftDrawerOpen,
  setIsEditShiftDrawerOpen,
  isAddingShift,
  form,
  setShiftId,
  setCellIndex,
  index,
  handleUpdateShiftTime,
  isUpdateShiftData,
}: TSingleDraggedShift) => {
  const [isEditShift, setIsEditShift] = useState(false);

  const [focusedInput, setFocusedInput] = useState<string>("");

  const { filterObj } = useFilterQuery();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "shift-employee",
    item: {
      branch_id: filterObj["filter[branch]"],
      time_from: shift.time_from,
      time_to: shift.time_to,
      ...(shift.notes ? { notes: shift.notes } : {}),
      shift_type_id: shift.shift_type_id,
      station_id: shift.station_id,
      shiftId: shift.id,
    },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div>
      <button
        ref={isAddingShift ? null : drag}
        disabled={isAddingShift}
        onClick={() => {
          form.setValue("time_from", shift.time_from.slice(0, 5), {
            shouldValidate: true,
            shouldDirty: true,
          });
          form.setValue("time_to", shift.time_to.slice(0, 5), {
            shouldValidate: true,
            shouldDirty: true,
          });

          setIsEditShift(true);
        }}
        className={`${
          isAddingShift && "opacity-40"
        } flex relative group  items-center  w-full bg-gray-100 rounded-sm h-[50px] ${
          isDragging && "opacity-40"
        } `}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start gap-1 pl-2">
            <div className="flex items-center justify-between w-full">
              <span className="text-gray-300">{shift.position?.name}</span>
              <span className="absolute text-gray-300 right-2 group-hover:opacity-20">
                {shift.shift_type?.icon}
              </span>
            </div>
            <span className="font-semibold ">
              {shift.time_from.slice(0, 5)} - {shift.time_to.slice(0, 5)}
            </span>
          </div>
          <button
            disabled={isAddingShift}
            className="hidden mr-2 group-hover:flex"
            onClick={(e) => {
              e.stopPropagation();
              setIsCreateShiftDrawerOpen(true);
              setIsEditShiftDrawerOpen(true);

              const values = {
                employee_id: shift.employee_id || null,
                position_id: shift.position_id,
                department_id: shift.department_id,
                shift_type_id: shift.shift_type_id,
                station_id: shift.station_id,
                date: shift.date,
                time_from: shift.time_from.slice(0, 5),
                time_to: shift.time_to.slice(0, 5),
                ...(shift.notes ? { notes: shift.notes } : {}),
                branch_id: filterObj["filter[branch]"],
              };

              setShiftId(shift.id);

              form.reset(values);
            }}
          >
            <PenIcon className="" color="var(--primary)" />
          </button>
        </div>
        <div className="absolute z-50 -translate-x-1/2 left-1/2  hidden gap-2 -bottom-[8px]  group-hover:flex">
          <button disabled={isAddingShift}>
            <PlusIcon
              className="w-3 h-3 "
              onClick={(e) => {
                e.stopPropagation();
                setIsCreateShiftDrawerOpen(true);
                const values = {
                  employee_id: shift.employee_id || null,
                  position_id: shift.position_id,
                  department_id: shift.department_id,
                  shift_type_id: shift.shift_type_id,
                  station_id: shift.station_id,
                  date: shift.date,
                  ...(shift.notes ? { notes: shift.notes } : {}),
                  branch_id: filterObj["filter[branch]"],
                };

                form.reset(values);
              }}
            />
          </button>
          <button
            disabled={isAddingShift}
            onClick={(e) => {
              e.stopPropagation();
              setCellIndex(index + 1);
              const data = {
                employee_id: shift.employee_id,
                position_id: shift.position_id,
                department_id: shift.department_id,
                shift_type_id: shift.shift_type_id,
                station_id: shift.station_id,
                date: nextDay,
                time_from: shift.time_from,
                time_to: shift.time_to,
                ...(shift.notes ? { notes: shift.notes } : {}),
                branch_id: filterObj["filter[branch]"],
              };
              addShiftData(data);
            }}
          >
            <CopyIcon className="w-3 h-3" />
          </button>
        </div>
      </button>
      {isEditShift && (
        <>
          <div
            className="fixed inset-0 z-30 rounded-md shadow-md cursor-default "
            onClick={(e) => {
              e.stopPropagation();
              setIsEditShift(false);
            }}
          ></div>

          <div className=" absolute p-3 z-40 top-0 bg-white rounded-md shadow-md w-[170px] ">
            <FormProvider {...form}>
              <div className="flex items-center justify-between gap-2 pb-2 mb-2">
                <PopularShiftInput
                  name="time_from"
                  className="w-[70px]"
                  formkey="time_from"
                  focusedInput={focusedInput}
                  setFocusedInput={setFocusedInput}
                />
                <PopularShiftInput
                  formkey="time_to"
                  name="time_to"
                  className="w-[70px]"
                  focusedInput={focusedInput}
                  setFocusedInput={setFocusedInput}
                />
              </div>
              <div className="flex items-center justify-between gap-2 mt-2">
                <button
                  className="text-primary"
                  onClick={() => setIsEditShift(false)}
                >
                  Cancel
                </button>
                <button
                  className={`p-2 border rounded-md broder-primary disabled:opacity-50`}
                  disabled={isUpdateShiftData}
                >
                  <RightIcon
                    color="var(--primary)"
                    onClick={() => {
                      handleUpdateShiftTime(
                        shift.id,
                        form.getValues().time_from,
                        form.getValues().time_to,
                        () => setIsEditShift(false)
                      );
                    }}
                  />
                </button>
              </div>
            </FormProvider>
          </div>
        </>
      )}
    </div>
  );
};

export default SingleDraggedShift;
