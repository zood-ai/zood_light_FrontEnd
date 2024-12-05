import { Fragment, useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

// Components
import CustomSelect from "@/components/ui/custom/CustomSelect";
import PopularShiftDrawer from "./PopularShiftDrawer";
import SingleDepartment from "./SingleDepartment";
import DayHeader from "./DayHeader";
import { TScheduledData } from "../types/types";
import DayHeaderSkeleton from "./DayHeaderSkeleton";
import DepartmentSkeleton from "./DepartmentSkeleton";
import EmployeeRowSkeleton from "./EmployeeRowSkeleton";
import useScheduletHttp from "../queriesHttp/ScheduleHttp";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formUpdatePeopleSchema } from "../../People/Schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultValueUpdate } from "../../People/defaultValue";
import SharedPeopleEditModal from "../../People/components/SharedPeopleEditModal";
import usePeopleHttp from "../../People/queriesHttp/usePeopleHttp";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useSearchParams } from "react-router-dom";

type TScheduleTable = {
  isFetchingSchedule: boolean;
  ScheduleData: TScheduledData;
};

const ScheduleTable = ({
  isFetchingSchedule,
  ScheduleData,
}: TScheduleTable) => {
  const { PopularShiftData } = useScheduletHttp({});

  const [isEdit, setIsEdit] = useState(false);
  const [modalName, setModalName] = useState("");

  const { filterObj } = useFilterQuery();

  const [, setSearchParam] = useSearchParams({});

  const form = useForm<z.infer<typeof formUpdatePeopleSchema>>({
    resolver: zodResolver(formUpdatePeopleSchema),
    defaultValues: defaultValueUpdate,
  });

  const handleCloseSheet = () => {
    setIsEdit(false);
    form.reset({});
    delete filterObj?.id;
    setSearchParam({ ...filterObj });
  };

  const {
    isLoadingAdd,
    employeeDataOne,
    isFetchingemployeeOne,
    isLoadingEdit,
    feedbackData,
    isLoadingFeedback,
  } = usePeopleHttp({
    employeeId: filterObj?.id || "",
    handleCloseSheet: handleCloseSheet,
    setEmployeeOne: (data: any) => {
      form.reset(data);
    },
  });

  const onSubmit = (values: z.infer<typeof formUpdatePeopleSchema>) => {
    if (isEdit) {
      // editEmployee({ ...values, _method: "PUT" });
      return;
    }
    // addEmployee(values);
  };
  return (
    <>
      <div className="flex">
        <DndProvider backend={HTML5Backend}>
          <div className="h-[calc(100vh-130px)]  overflow-y-scroll  w-full">
            <table className="mx-auto w-full  border-separate border-spacing-0 border-r border-[#d4e2ed] text-[14px] leading-4">
              <thead>
                <tr>
                  <th className="sticky top-0 z-20 border    border-r-0 box-border text-center align-top p-3 pt-4 bg-white w-72 mx-auto h-full border-separate border-spacing-0 border-[#d4e2ed] text-[14px] leading-4">
                    <CustomSelect
                      width="w-full"
                      options={[
                        { value: "departments", label: "Departments" },
                        { value: "people", label: "People" },
                        { value: "positions", label: "Positions" },
                        { value: "stations", label: "Stations" },
                      ]}
                      defaultValue={"departments"}
                      disabled
                    />
                    {/* <button
                  type="button"
                  className="w-full mt-4 text-xs font-normal text-left gray-600"
                >
                  Cost / COL %
                </button> */}
                  </th>
                  {/* Days */}
                  {isFetchingSchedule && <DayHeaderSkeleton />}
                  {ScheduleData?.days?.map((day) => (
                    <DayHeader
                      key={day.date}
                      day={day}
                      isFetchingSchedule={isFetchingSchedule}
                    />
                  ))}
                </tr>
              </thead>

              <tbody>
                {isFetchingSchedule && (
                  <>
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Fragment key={i}>
                        <DepartmentSkeleton />

                        {Array.from({ length: 3 }).map((_, i) => (
                          <EmployeeRowSkeleton key={i} />
                        ))}
                      </Fragment>
                    ))}
                  </>
                )}
                {/* Departments */}
                {ScheduleData?.departments.map((department) => (
                  <SingleDepartment
                    key={department.id}
                    department={department}
                    employees={ScheduleData?.employees}
                    days={ScheduleData?.days}
                    isFetchingSchedule={isFetchingSchedule}
                    setIsEdit={setIsEdit}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <PopularShiftDrawer
            employees={ScheduleData?.employees}
            PopularShifts={PopularShiftData}
          />
        </DndProvider>
      </div>

      <SharedPeopleEditModal
        isEdit={isEdit}
        setModalName={setModalName}
        form={form}
        onSubmit={onSubmit}
        isLoadingEdit={isLoadingEdit}
        isLoadingAdd={isLoadingAdd}
        handleCloseSheet={handleCloseSheet}
        employeeDataOne={employeeDataOne}
        isFetchingemployeeOne={isFetchingemployeeOne}
        feedbackData={feedbackData}
        isLoadingFeedback={isLoadingFeedback}
      />
    </>
  );
};

export default ScheduleTable;
