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
import EmployeeRowSkeleton from "./EmployeeRowSkeleton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  formPeopleSchema,
  formUpdatePeopleSchema,
} from "../../People/Schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultValueUpdate } from "../../People/defaultValue";
import SharedPeopleEditModal from "../../../../sharedModals/SharedPeopleEditModal";
import usePeopleHttp from "../../People/queriesHttp/usePeopleHttp";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useSearchParams } from "react-router-dom";
import OpenShiftRow from "./OpenShiftRow";
import EmployeeRow from "./EmployeeRow";

type TScheduleTable = {
  isFetchingSchedule: boolean;
  ScheduleData: TScheduledData;
  showAvaliability: boolean;
  sortEmployees: boolean;
};

const ScheduleTable = ({
  isFetchingSchedule,
  ScheduleData,
  showAvaliability,
  sortEmployees,
}: TScheduleTable) => {
  const [isEdit, setIsEdit] = useState(false);
  const [modalName, setModalName] = useState("");

  const [sortBy, setSortBy] = useState<string>("people");

  const { filterObj } = useFilterQuery();

  const [, setSearchParam] = useSearchParams({});
  const [attendanceDays, setAttendanceDays] = useState<string>("30");

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
    isLoadingFeedback,
    employeeAttendace,
    editEmployee,
    isFetchingemployeeAttendace,
  } = usePeopleHttp({
    employeeId: filterObj?.id || "",
    handleCloseSheet: handleCloseSheet,
    setEmployeeOne: (data: any) => {
      form.reset(data);
    },
    attendanceDays,
    fromSchedule: true,
  });

  const onSubmit = (values: z.infer<typeof formPeopleSchema>) => {
    if (isEdit) {
      editEmployee({ ...values, _method: "PUT" });
    }
  };

  const employees = sortEmployees
    ? ScheduleData?.employees?.sort((a, b) =>
        a.first_name.localeCompare(b.first_name)
      )
    : ScheduleData?.employees?.sort((a, b) =>
        b.first_name.localeCompare(a.first_name)
      );

  return (
    <>
      <div className="flex" id="print">
        <DndProvider backend={HTML5Backend}>
          <div className="h-[calc(100vh-130px)]  overflow-y-scroll  w-full">
            <table className="mx-auto w-full  border-separate border-spacing-0 border-r border-[#d4e2ed] text-[14px] leading-4">
              <thead>
                <tr>
                  <th className="sticky top-0 z-20 border    border-r-0 box-border text-center align-top p-3 pt-4 bg-white w-72 mx-auto h-full border-separate border-spacing-0 border-[#d4e2ed] text-[14px] leading-4">
                    <CustomSelect
                      width="w-full"
                      removeDefaultOption
                      options={[
                        // { value: "departments", label: "Departments" },
                        { value: "people", label: "People" },
                        // { value: "positions", label: "Positions" },
                      ]}
                      defaultValue={sortBy}
                      onValueChange={(value) => {
                        setSortBy(value);
                      }}
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
                {isFetchingSchedule ? (
                  <>
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Fragment key={i}>
                        {/* <DepartmentSkeleton /> */}

                        {Array.from({ length: 3 }).map((_, i) => (
                          <EmployeeRowSkeleton key={i} />
                        ))}
                      </Fragment>
                    ))}
                  </>
                ) : (
                  <>
                    {sortBy === "people" && (
                      <>
                        <OpenShiftRow
                          days={ScheduleData?.days}
                          fromOpenShift
                          sortBy={sortBy}
                        />
                        {employees?.map((employee) => {
                          return (
                            <EmployeeRow
                              key={employee.first_name + employee.last_name}
                              employee={employee}
                              sortBy={sortBy}
                              showAvaliability={showAvaliability}
                              departmentId={employee?.departments?.[0]?.id}
                              positionId={
                                employee?.departments[0]?.pivot
                                  ?.forecast_position_id as number
                              }
                              days={ScheduleData?.days}
                              isPublished={ScheduleData?.table?.status === 2}
                              isFetchingSchedule={isFetchingSchedule}
                              setIsEdit={setIsEdit}
                            />
                          );
                        })}
                      </>
                    )}
                  </>
                )}

                {/* Departments */}
                {sortBy === "departments" &&
                  ScheduleData?.departments.map((department) => (
                    <SingleDepartment
                      key={department.id}
                      department={department}
                      showAvaliability={showAvaliability}
                      employees={ScheduleData?.employees}
                      days={ScheduleData?.days}
                      sortBy={sortBy}
                      isFetchingSchedule={isFetchingSchedule}
                      setIsEdit={setIsEdit}
                    />
                  ))}
              </tbody>
            </table>
          </div>

          <PopularShiftDrawer employees={employees} />
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
        isLoadingFeedback={isLoadingFeedback}
        resetFrom={(data) => form.reset(data)}
        employeeAttendace={employeeAttendace}
        setAttendanceDays={setAttendanceDays}
        attendanceDays={attendanceDays}
        isFetchingemployeeAttendace={isFetchingemployeeAttendace}
      />
    </>
  );
};

export default ScheduleTable;
