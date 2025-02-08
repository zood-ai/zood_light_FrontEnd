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
import SharedEditModal from "../../../sharedModals/SharedPeopleEditModal";
import { defaultValueUpdate } from "./defaultValue";
import { PERMISSIONS } from "@/constants/constants";

const People = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [, setModalName] = useState("");
  const [, setRowData] = useState<any>();
  const [, setSearchParam] = useSearchParams({});
  const { filterObj } = useFilterQuery();
  const [attendanceDays, setAttendanceDays] = useState<string>("30");

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "Name",
      header: () => <div>Name</div>,
      cell: ({ row }: any) => (
        <div className="flex items-center gap-[10px]">

{ row?.original?.image == null ? (
             <Avatar
             text={
               row?.original?.preferred_name == null
                 ? `${row?.original?.first_name}  ${row?.original?.last_name}`
                 : `${row?.original?.preferred_name}`
             }
             bg="secondary"
           />
          ) : (
            <img
              src={ row?.original?.image}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
          )}
         

          {row?.original?.preferred_name == null ? (
            <>
              {row?.original?.first_name} {row?.original?.last_name}
            </>
          ) : (
            <>{row?.original?.preferred_name}</>
          )}
        </div>
      ),
      enableHiding: false,
     
    },
    {
      accessorKey: "Department",
      header: () => <div>Department</div>,
      cell: ({ row }: any) => <>{row?.original?.department}</>,
    },
    {
      accessorKey: "Position",
      header: () => <div>Position</div>,
      cell: ({ row }: any) => <>{row?.original?.position}</>,
    },
    {
      accessorKey: "Home branch",
      header: () => <div>Home location</div>,
      cell: ({ row }: any) => <>{row?.original?.branch}</>,
    },
    {
      accessorKey: "Lates",
      header: () => <div>Lates</div>,
      cell: ({ row }: any) => <>{row?.original?.lates}</>,
    },
    {
      accessorKey: "Absences",
      header: () => <div>Absences</div>,
      cell: ({ row }: any) => <>{row?.original?.absences}</>,
    },
    {
      accessorKey: "Holiday balance",
      header: () => <div>Holiday Balance</div>,
      cell: ({ row }: any) => <> {row?.original?.holiday_balance}</>,
    },

    {
      accessorKey: "Avg weekly hours",

      header: () => (
        <div>
          Avg weekly hours <p className="text-[#698392]">(contracted)</p>
        </div>
      ),
      cell: ({ row }: any) => (
        <>
          {row?.original?.avg_weekly_hours}
          <span className="text-[#698392]">
            {" "}
            ({row?.original?.contract_hrs})
          </span>
        </>
      ),
    },
    {
      accessorKey: "status",
      enableHiding: false,
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
    role_id: "",
    contact: "",
    contact_hrs: 0,
    start_date: "",
    birth_date: "",
    wage_type: "",
    wage: 0,
    documents: [],
    send_invitation: 0,
    notes: [],
    address: {
      home_number: null,
      street: null,
      town: null,
      city: null,
      postcode: null,
    },
    contact_name: "",
    contact_relation: "",
    contact_phone: 0,
    visa_date: new Date(),
    payroll_id:null,
    timecard_id:null,
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
    isLoadingFeedback,
    employeeAttendace,
    isFetchingemployeeAttendace,
    historyData
    
  } = usePeopleHttp({
    employeeId: filterObj?.id || "",
    handleCloseSheet: handleCloseSheet,
    setEmployeeOne: (data: any) => {
      form.reset(data);
    },
    attendanceDays: attendanceDays,
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
          form.setValue("pin", +Math.random().toFixed(4).slice(2, 6));
          setIsOpen(true);
        }}
        permissionExport={[PERMISSIONS.can_export_employee_data]}
        modalName="employee"
      />
      <HeaderTable
        isType
        TypeOptions={typesPeople}
        statusTypeKey="filter[status]"
        isBranches
      />
      <CustomTable
        loading={isLoadingPeople}
        data={PeopleData?.data}
        columns={columns}
        paginationData={PeopleData?.meta}
        onRowClick={(row: any) => {
          setRowData(row);
          setIsEdit(true);
          setSearchParam({ ...filterObj, id: row?.id });
        }}
        showBar={true}
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
        isLoadingFeedback={isLoadingFeedback}
        resetFrom={(data) => form.reset(data)}
        employeeAttendace={employeeAttendace}
        setAttendanceDays={setAttendanceDays}
        attendanceDays={attendanceDays}
        isFetchingemployeeAttendace={isFetchingemployeeAttendace}
        historyData={historyData}
      />
    </>
  );
};

export default People;
