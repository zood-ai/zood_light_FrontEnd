import Avatar from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { typesPeople } from "@/constants/dropdownconstants";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formPeopleSchema, formUpdatePeopleSchema } from "./Schema/schema";
import { Button } from "@/components/ui/button";
import CreateModal from "./components/CreateModal/CreateModal";
import usePeopleHttp from "./queriesHttp/usePeopleHttp";
import { handleStatus, handleStatusShap } from "./helpers/helpers";
import { useSearchParams } from "react-router-dom";
import useFilterQuery from "@/hooks/useFilterQuery";
import SharedEditModal from "./components/SharedPeopleEditModal";
import { defaultValueUpdate } from "./defaultValue";

const People = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalName, setModalName] = useState("");
  const [rowData, setRowData] = useState<any>();
  const [, setSearchParam] = useSearchParams({});
  const { filterObj } = useFilterQuery();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: () => <div>Name</div>,
      cell: ({ row }: any) => (
        <div className="flex items-center gap-[10px]">
          <Avatar text={row.getValue("name")} bg="secondary" />
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: () => <div>Department</div>,
      cell: ({ row }: any) => <>{row.getValue("department")}</>,
    },
    {
      accessorKey: "position",
      header: () => <div>Position</div>,
      cell: ({ row }: any) => <>{row.getValue("position")}</>,
    },
    {
      accessorKey: "branch",
      header: () => <div>Home location</div>,
      cell: ({ row }: any) => <>{row.getValue("branch")}</>,
    },
    {
      accessorKey: "absences",
      header: () => <div>Absences</div>,
      cell: ({ row }: any) => <>{row.getValue("absences")}</>,
    },
    {
      accessorKey: "holiday_balance",
      header: () => <div>Holiday Balance</div>,
      cell: ({ row }: any) => <>{row.getValue("holiday_balance")}</>,
    },

    {
      accessorKey: "avg_weekly_hours",
      header: () => (
        <div>
          Avg weekly hours <p className="text-[#698392]">(contracted)</p>
        </div>
      ),
      cell: ({ row }: any) => (
        <>
          {row.getValue("avg_weekly_hours")}
          <span className="text-[#698392]"> (0)</span>
        </>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div>Status</div>,
      cell: ({ row }: any) => (
        <Badge variant={handleStatusShap(row.getValue("status"))}>
          {handleStatus(row.getValue("status"))}
        </Badge>
      ),
    },
  ];

  const handleCloseSheet = () => {
    setIsEdit(false);
    setIsOpen(false);
    form.reset(defaultValue);
    setRowData(null);
    setSearchParam({});
  };

  const defaultValue = {
    first_name: "",
    last_name: "",
    preferred_name: null,
    email: "",
    branch_id: "",
    forecast_department_id: "",
    forecast_position_id: 0,
    roles: [{ id: "" }],
    contact: "",
    contact_hrs: 0,
    start_date: "",
    birth_date: "",
    wage_type: "",
    wage: 0,
    documents: [],
    send_invitation: 0,
  };

  const getSchema = () => {
    if (isEdit == true) {
      return formUpdatePeopleSchema;
    }
    return formPeopleSchema;
  };
  const getDefaultValue = () => {
    if (isEdit == true) {
      return defaultValueUpdate;
    }
    return defaultValue;
  };

  const form = useForm<
    z.infer<typeof formPeopleSchema | typeof formUpdatePeopleSchema>
  >({
    resolver: zodResolver(getSchema()),
    defaultValues: getDefaultValue(),
  });

  const {
    PeopleData,
    addEmployee,
    isLoadingAdd,
    isLoadingPeople,
    employeeDataOne,
    editEmployee,
    isFetchingemployeeOne,
    isLoadingEdit,
    feedbackData,
    isLoadingFeedback,
    employeeAttendace
  } = usePeopleHttp({
    employeeId: filterObj?.id || "",
    handleCloseSheet: handleCloseSheet,
    setEmployeeOne: (data: any) => {
      form.reset(data);
    },
  });
  const onSubmit = (values: z.infer<typeof formPeopleSchema>) => {
    if (isEdit) {
      editEmployee({ ...values, _method: "PUT" });
      return;
    }
    addEmployee(values);
  };

  return (
    <>
      <HeaderPage
        title="People"
        textButton="Add person "
        exportButton
        onClickAdd={() => {
          setIsOpen(true);
        }}
      />
      <HeaderTable
        isType
        TypeOptions={typesPeople}
        statusTypeKey="filter[status]"
      />
      <CustomTable
        loading={isLoadingPeople}
        data={PeopleData?.data}
        columns={columns}
        paginationData={PeopleData?.meta}
        onRowClick={(row: any) => {
          setRowData(row);
          setIsEdit(true);

          setSearchParam({ id: row?.id });
        }}
      />

      {/***************************************** Create employee {/******************************************/}

      <CustomSheet
        isOpen={isOpen}
        isDirty={isOpen}
        handleCloseSheet={handleCloseSheet}
        form={form}
        onSubmit={onSubmit}
        btnText="Save Change"
        setModalName={setModalName}
        purchaseHeader={
          <div className="flex items-center gap-2">
            <div>
              <p>Add new Employee</p>
            </div>
          </div>
        }
        receiveOrder={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="px-4 w-fit "
              type="submit"
              disabled={!form.formState.isValid}
              loading={isLoadingAdd}
            >
              Save{" "}
            </Button>

            <Button
              className="px-4 w-fit "
              disabled={!form.formState.isValid}
              type="button"
              loading={isLoadingAdd}
              onClick={() => {
                addEmployee({ ...form.getValues(), send_invitation: 1 });
              }}
            >
              Send invite{" "}
            </Button>
          </div>
        }
        
      >
        <CreateModal />
      </CustomSheet>

      {/*--------------------------------------------------- Update employee---------------------------------------------------------- */}
      <SharedEditModal
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
        resetFrom={(data) => form.reset(data)}
        employeeAttendace={employeeAttendace}

      />
    </>
  );
};

export default People;
