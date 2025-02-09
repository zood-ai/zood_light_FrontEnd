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
import { SHIFT_STATUS } from "../constants/constants";
import MessageIcon from "@/assets/icons/Message";
import TimeIcon from "@/assets/icons/Time";

type TSingleDraggedShift = {
  shift: TShift;
  nextDay: string;
  prevLastDay: string;
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
  prevLastDay,
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

  const isPublished = shift.status === SHIFT_STATUS.PUBLISHED || shift.attend;

  const isDefaultShift =
    shift.shift_type?.type === "time_off" ||
    shift.shift_type?.type === "holiday" ||
    shift.shift_type?.type === "sick_day";
  const shiftStyle = (shift: TShift) => {
    if (shift.overtime_rule_id && !isDefaultShift)
      return "bg-[#ffedd7] border-[#9f8062] shadow-sm border";
    if (!shift.employee_id && shift.status === SHIFT_STATUS.PUBLISHED)
      return "bg-white border-[#d1c8ac] shadow-sm border";

    if (isDefaultShift) {
      return "bg-gray-100";
    }
    if (shift.status === SHIFT_STATUS.DRAFT)
      return "bg-[repeating-linear-gradient(135deg,_#e7e1f480_0px,_#e7e1f480_4px,_#ded7fe80_4px,_#ded7fe80_8px)]";

    if (
      shift.status === SHIFT_STATUS.PUBLISHED &&
      !Object.keys(shift?.attend || {}).length
    )
      return "bg-white border border-[#e7e1f4]";

    return "bg-gray-100";
  };

  const handleOpenEditShiftModal = (e) => {
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
  };

  return (
    <div>
      <button
        ref={isAddingShift || isPublished || isDefaultShift ? null : drag}
        disabled={isAddingShift}
        onClick={(e) => {
          if (isPublished) {
            return;
          }

          if (isDefaultShift) {
            handleOpenEditShiftModal(e);
            return;
          }

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
        className={`${isAddingShift && "opacity-40"} ${shiftStyle(
          shift
        )} flex relative group  items-center  w-full ${
          shift.attend && !shift?.attend?.end_time && "!bg-[#fff4f8]"
        }  rounded-sm h-[50px] ${isDragging && "opacity-40"} `}
      >
        <div
          className={`flex items-center ${
            isDefaultShift
              ? "items-center justify-center"
              : "items-start justify-between"
          } w-full`}
        >
          <div
            className={`flex flex-col ${
              isDefaultShift ? "items-center justify-center" : "items-start"
            } gap-1 pl-2`}
          >
            {!isDefaultShift ? (
              <>
                <div
                  className={`flex items-center  w-full ${
                    isDefaultShift && "items-center justify-center"
                  }`}
                >
                  <span
                    className={`text-gray-300 ${
                      shift.attend && !shift.attend?.end_time && "text-red-500"
                    }`}
                  >
                    {shift.position?.name || "No Position"}
                  </span>
                  <span
                    className={`absolute text-gray-300 right-3 ${
                      shift.status !== SHIFT_STATUS.PUBLISHED &&
                      "group-hover:opacity-20"
                    } `}
                  >
                    {shift.shift_type?.icon}
                  </span>
                  {shift.notes && (
                    <MessageIcon className="absolute top-1 right-1" />
                  )}
                </div>
                <span
                  className={`flex items-center gap-1 font-medium ${
                    !shift?.attend?.end_time && shift.attend && "text-red-500"
                  } `}
                >
                  {shift.attend && (
                    <TimeIcon
                      color={!shift?.attend?.end_time ? "red" : "#8D6FC9"}
                    />
                  )}
                  {shift.attend
                    ? `${shift.attend?.start_time?.slice(0, 5)} - ${
                        shift.attend?.end_time?.slice(0, 5) || "??"
                      }`
                    : `${shift.time_from.slice(0, 5)} - ${shift.time_to.slice(
                        0,
                        5
                      )}`}
                </span>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center w-full gap-1">
                <div>
                  {shift.shift_type.name}
                  {shift.shift_type.icon}
                </div>
                <span className="absolute bottom-0 text-[10px] text-gray-500">
                  {shift?.time_from.slice(0, 5)} - {shift?.time_to.slice(0, 5)}
                </span>
              </div>
            )}
          </div>
          {!isPublished && !isDefaultShift && (
            <button
              disabled={isAddingShift}
              className="items-center justify-center hidden mr-2 group-hover:flex "
              onClick={(e) => handleOpenEditShiftModal(e)}
            >
              <div
                className={`after:content-[''] z-20 after:absolute after:top-0 after:right-0 after:w-[50px]  after:h-full  after:rounded-[4px] ${
                  shift.overtime_rule_id
                    ? ""
                    : "after:bg-[linear-gradient(90deg,_transparent_20%,_rgb(231,225,244)_94%)]"
                } `}
              />
              <PenIcon className="z-50" color="var(--primary)" />
            </button>
          )}
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

          {!isPublished && !isDefaultShift && (
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
                  date: nextDay || prevLastDay,
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
          )}
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
