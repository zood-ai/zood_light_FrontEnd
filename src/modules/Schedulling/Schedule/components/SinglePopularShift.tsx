import { useState } from "react";
import { useDrag } from "react-dnd";
import { formAddPopularShiftSchema } from "../Schema/schema";
import { z } from "zod";

// Icons
import CloseIcon from "@/assets/icons/Close";
import PenIcon from "@/assets/icons/Pen";

// Types
import { TPopularShift } from "../types/types";

// Components
import SinglePopularInputs from "./SinglePopularInputs";

// Hooks
import usePopularForm from "../hooks/usePopularForm";
import useScheduletHttp from "../queriesHttp/ScheduleHttp";

const SinglePopularShift = ({ shift }: { shift: TPopularShift }) => {
  const form = usePopularForm();
  const [isEdit, setIsEdit] = useState(false);
  const [focusedInput, setFocusedInput] = useState("time_from");

  const shiftValues = {
    shift_type_id: shift.shift_type_id,
    time_from: shift.time_from,
    time_to: shift.time_to,
    branch_id: shift.branch_id,
    isPopular: true,
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "shift",
    item: () => shiftValues,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleClose = () => {
    setFocusedInput("");
    setIsEdit(false);
  };

  const {
    deletePopularShift,
    updatePopularShift,
    isUpdatePopularShift,
    isdeletePopularShift,
  } = useScheduletHttp({
    handleCloseSheet: handleClose,
  });

  const setFormValues = (
    key: keyof z.infer<typeof formAddPopularShiftSchema>
  ) => {
    const isTimeKey = key === "time_from" || key === "time_to";
    form.setValue(key, isTimeKey ? shift[key].slice(0, 5) : shift[key], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <>
      {isEdit ? (
        <SinglePopularInputs
          shiftAction={isEdit}
          focusedInput={focusedInput}
          handleClose={handleClose}
          setFocusedInput={setFocusedInput}
          form={form}
          isEdit
          popularShiftAction={updatePopularShift}
          popularShiftActionLoading={isUpdatePopularShift}
        />
      ) : (
        <button
          ref={drag}
          className={`${
            isdeletePopularShift && "opacity-50 bg-gray-400"
          } bg-primary-foreground group text-white font-normal  flex items-center justify-between mb-2 p-2 rounded-xl mx-auto h-[32px] w-[140px]
        ${isDragging ? "opacity-50 bg-gray-400" : "bg-primary-foreground"}
      `}
          style={{
            cursor: isDragging ? "grabbing" : "pointer",
          }}
        >
          <div className="mx-auto ">
            {shift.time_from.slice(0, 5)}-{shift.time_to.slice(0, 5)}
          </div>

          <div
            className={`hidden gap-2 ml-1  ${
              isDragging ? "group-active:hidden" : "group-hover:flex"
            }`}
          >
            <PenIcon
              color="gray"
              className="w-[12px] h-[12px]"
              onClick={(e) => {
                e.stopPropagation();
                setIsEdit(true);
                setFormValues("time_from");
                setFormValues("time_to");
                setFormValues("branch_id");
                setFormValues("shift_type_id");
                setFormValues("id");
                setFocusedInput("time_from");
              }}
            />
            <button
              disabled={isdeletePopularShift}
              onClick={() => {
                deletePopularShift(shift.id);
              }}
            >
              <CloseIcon color="gray" className="w-[10px] h-[10px]" />
            </button>
          </div>
        </button>
      )}
    </>
  );
};

export default SinglePopularShift;
