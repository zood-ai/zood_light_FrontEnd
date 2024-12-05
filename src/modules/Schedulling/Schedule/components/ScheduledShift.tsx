import { useDrop } from "react-dnd";
import { TScheduledShift } from "../types/types";
import PlusIcon from "@/assets/icons/Plus";
import { useState } from "react";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import { formAddShiftSchema } from "../Schema/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ShiftDetailsForm from "./ShiftDetailsForm";
import useFilterQuery from "@/hooks/useFilterQuery";
import useScheduletHttp from "../queriesHttp/ScheduleHttp";
import SingleDraggedShift from "./SingleDraggedShift";
import CustomModal from "@/components/ui/custom/CustomModal";
import { Skeleton } from "@/components/ui/skeleton";
import { SHIFT_TYPES_IDS } from "../constants/constants";

const ScheduledShift = ({
  employeeId = null,
  day,
  nextDay,
  departmentId,
  positionId,
  index,
  setCellIndex,
  cellIndex,
  isAvaliabile,
  fromOpenShift,
}: TScheduledShift) => {
  const { filterObj } = useFilterQuery();
  const [isCreateShiftDrawerOpen, setIsCreateShiftDrawerOpen] =
    useState<boolean>(false);
  const [modalName, setModalName] = useState("");

  const [isEditShiftDrawerOpen, setIsEditShiftDrawerOpen] = useState(false);

  const [shiftId, setShiftId] = useState("");

  const handleCloseSheet = () => {
    setModalName("");
    setIsCreateShiftDrawerOpen(false);
    setIsEditShiftDrawerOpen(false);
    form.reset(defaultValues);
  };

  const {
    isAddingShift,
    addShiftData,
    deleteShiftData,
    isdeletingShift,
    updateShiftData,
    isUpdateShiftData,
  } = useScheduletHttp({ handleCloseSheet, setCellIndex });

  const defaultValues = {
    date: "",
    time_from: "",
    time_to: "",
    employee_id: "",
    department_id: "",
    position_id: 0,
    station_id: "",
    shift_type_id: "",
    notes: "",
    branch_id: filterObj["filter[branch]"],
  };

  const form = useForm<z.infer<typeof formAddShiftSchema>>({
    resolver: zodResolver(formAddShiftSchema),
    defaultValues,
  });

  const handleConfirm = async () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      deleteShiftData(shiftId);
    }
  };

  const handleSubmit = (values) => {
    if (isEditShiftDrawerOpen) {
      updateShiftData({ id: shiftId || "", data: values });
      return;
    }

    if (!values.notes) delete values.notes;
    addShiftData(values);
  };
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["shift", "shift-employee"],
    drop: (
      item: z.infer<typeof formAddShiftSchema> & {
        shiftId?: string;
        isPopular?: boolean;
      }
    ) => {
      const values = {
        ...item,
        ...(item.notes ? { notes: item.notes } : {}),
        employee_id: employeeId as string,
        position_id: positionId as number,
        department_id: departmentId as string,
        date: day.date,
      };

      if (item.isPopular) {
        addShiftData(values);
        return;
      }

      updateShiftData({ id: item.shiftId ?? "", data: values });
    },

    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const shiftsBelongToEmployee = day?.shifts?.filter(
    (shift) =>
      shift.employee_id === employeeId && shift.department_id === departmentId
  );

  const handleSetForm = () => {
    form.setValue("date", day?.date, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (employeeId) {
      form.setValue("employee_id", employeeId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    form.setValue("department_id", departmentId as string, {
      shouldValidate: true,
      shouldDirty: true,
    });

    form.setValue("position_id", positionId as number, {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue("station_id", "ca2a6c58-6169-4736-b5a0-250777e35ab8", {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue("shift_type_id", SHIFT_TYPES_IDS.REGULAR, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleSetFormValues = (
    key: keyof z.infer<typeof formAddShiftSchema>,
    value: string | number | null
  ) => {
    form.setValue(key, value, { shouldValidate: true, shouldDirty: true });
  };

  const handleUpdateShiftTime = (
    shiftId: string,
    time_from: string,
    time_to: string,
    cb: () => void
  ) => {
    updateShiftData({
      id: shiftId,
      data: { time_from: time_from, time_to: time_to },
      cb,
    });
  };

  return (
    <>
      <td
        ref={drop}
        className={`relative w-[150px]  cursor-pointer h-[56px]  text-center align-top p-1 border-b border-l border-[#d4e2ed] group/main`}
      >
        {isOver && (
          <div className="absolute  inset-0 m-1 z-20 bg-gray-100  border-b-[2px] border-primary rounded-sm">
            <div className="flex items-center justify-center h-full">🎯</div>
          </div>
        )}

        <div className="relative space-y-2 ">
          {shiftsBelongToEmployee?.map((shift) => (
            <SingleDraggedShift
              shift={shift}
              key={shift.id}
              nextDay={nextDay ?? ""}
              addShiftData={addShiftData}
              isAddingShift={isAddingShift}
              setIsCreateShiftDrawerOpen={setIsCreateShiftDrawerOpen}
              setIsEditShiftDrawerOpen={setIsEditShiftDrawerOpen}
              form={form}
              setShiftId={setShiftId}
              setCellIndex={setCellIndex}
              index={index}
              handleUpdateShiftTime={handleUpdateShiftTime}
              isUpdateShiftData={isUpdateShiftData}
            />
          ))}
        </div>

        {!isAvaliabile && !fromOpenShift && (
          <button
            className={`flex relative group  ${
              shiftsBelongToEmployee.length > 0 ? "mt-2" : ""
            } items-center  w-full bg-gray-100 rounded-sm h-[50px] `}
          >
            <div className="flex items-center justify-center w-full">
              <span className="">Unavailable ⏰</span>
            </div>
            <div className="absolute z-50 -translate-x-1/2 left-1/2  hidden gap-2 -bottom-[8px]  group-hover:flex">
              <button disabled={isAddingShift}>
                <PlusIcon
                  className="w-3 h-3 "
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCreateShiftDrawerOpen(true);
                    const values = {
                      employee_id: employeeId || null,
                      position_id: positionId,
                      department_id: departmentId,
                      date: day.date,
                      branch_id: filterObj["filter[branch]"],
                    };

                    form.reset(values);
                  }}
                />
              </button>
            </div>
          </button>
        )}

        {(cellIndex === index ||
          isUpdateShiftData ||
          (!cellIndex && isAddingShift)) && (
          <div
            className={`relative w-[145px] ${
              !!shiftsBelongToEmployee.length && "mt-2"
            } cursor-pointer h-[50px] text-center align-top`}
          >
            <Skeleton className="w-full h-full" />
          </div>
        )}

        {!shiftsBelongToEmployee?.length && (
          <div
            className={`items-center justify-center hidden  w-full h-full bg-gray-100 rounded-sm ${
              isUpdateShiftData || isAddingShift || !isAvaliabile
                ? ""
                : "group-hover/main:flex"
            } `}
            onClick={() => {
              handleSetForm();
              setIsCreateShiftDrawerOpen(true);
            }}
          >
            <div className="flex items-center justify-center h-full">
              <PlusIcon className="w-3 h-3" />
            </div>
          </div>
        )}
      </td>

      <CustomSheet
        isOpen={isCreateShiftDrawerOpen}
        headerLeftText={isEditShiftDrawerOpen ? "Edit Shift" : "Add Shift"}
        form={form}
        isLoading={isAddingShift || isUpdateShiftData}
        btnText={"Add Shift"}
        isEdit={isEditShiftDrawerOpen}
        isDirty={form.formState.isDirty}
        handleCloseSheet={handleCloseSheet}
        onSubmit={handleSubmit}
        setModalName={setModalName}
      >
        <ShiftDetailsForm
          formData={form.getValues()}
          handleSetFormValues={handleSetFormValues}
        />
      </CustomSheet>

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={"this shift"}
        isPending={isdeletingShift}
      />
    </>
  );
};

export default ScheduledShift;
