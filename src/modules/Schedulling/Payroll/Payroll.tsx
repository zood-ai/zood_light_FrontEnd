import CloseIcon from "@/assets/icons/Close";
import LateIcon from "@/assets/icons/Late";
import Avatar from "@/components/ui/avatar";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import CustomTooltip from "@/components/ui/custom/CustomTooltip";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { PayrollStatusOptions } from "@/constants/dropdownconstants";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";
import PopularShiftInput from "../Schedule/components/PopularShiftInput";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formPayrollSchema } from "./schema/schema";
import DetailsTimeCard from "./components/DetailsTimeCard";
import CustomModal from "@/components/ui/custom/CustomModal";
import MemoChecked from "@/assets/icons/Checked";
import usePayRollHttps from "./queriesHttp/usePayrollHttps";
import { set } from "date-fns";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import moment from "moment";
import { PERMISSIONS } from "@/constants/constants";
import AuthPermission from "@/guards/AuthPermission";
import useFilterQuery from "@/hooks/useFilterQuery";

const Payroll = () => {
  const [rowIndex, setRowIndex] = React.useState<number | null>(null);
  const [rowData, setRowData] = React.useState<number | null>(null);
  const [focusedInput, setFocusedInput] = React.useState("");
  const [showStartTime, setShowStartTime] = React.useState<any>();
  const [showEndTime, setShowEndTime] = React.useState<any>();
  const [unpaidBreak, setUnpaidBreak] = React.useState<any>();
  const [open, setOpen] = React.useState(false);
const {filterObj}=useFilterQuery()
const [rowsSelectedIds, setRowsSelectedIds] = React.useState<
    { id: string; status: number }[]
  >([]);
  const [modalName, setModalName] = React.useState("");
  const formEdit = useForm<z.infer<typeof formPayrollSchema>>({
    resolver: zodResolver(formPayrollSchema),
    defaultValues: {
      start_time: "",
      end_time: "",
    },
  });
  const handleClose = () => {
    setShowStartTime(null);
    setShowEndTime(null);
    setModalName("");
    setUnpaidBreak(null);
  };
  const {
    timeCardData,
    isLoadingtimeCardData,
    updatePayroll,
    isLoadingUpdatePayroll,
    approvePayroll,
    isLoadingApprovePayroll,
    deletePayroll,
    isLoadingDeletePayroll,
    timeCardOne,
    isLoadingTimeCardOne,
    exportPayroll,
        isLoadingExportPayroll
  } = usePayRollHttps({
    handleClose,
    timeCardId: rowData || 0,
    setTimeCardOne: (data: any) => {
      form.reset(data);
    },

  });

  const onSubmit = (values: z.infer<typeof formPayrollSchema>) => {
    updatePayroll(values);
  };
  

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        id: "select",

       
        cell: ({ row }: any) => (
          <Checkbox
          checked={rowsSelectedIds
            .map((d) => d.id)
            .includes(String(row.original.id))}
          disabled={
            rowsSelectedIds.length
              ? row.original.status !== rowsSelectedIds[0]?.status
              : false
          }
          onClick={(e) => {
            e.stopPropagation();
          }}
          onCheckedChange={(value) => {
            if (value) {
              setRowsSelectedIds((prev) => [
                ...prev,
                { id: String(row.original.id), status: row.original.status },
              ]);
            } else {
              setRowsSelectedIds((prev) =>
                prev.filter((id) => id.id != row.original.id)
              );
            }
          }}
          aria-label="Select row"
        />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "employee_name",
        header: () => <div>Name</div>,
        cell: ({ row }: any) => (
          <div>
            <div className="flex items-center gap-[10px] ">
              {row?.original?.status == 1 ? (
                <Avatar text={row?.original?.employee_name} type="Approved" />
              ) : (
                <>
                  {row?.original?.start_status == null ||
                  row?.original?.end_status == null ? (
                    <Avatar
                      text={row?.original?.employee_name}
                      type="Normal"
                      bg="danger"
                    />
                  ) : (
                    <Avatar text={row?.original?.employee_name} type="Normal" />
                  )}
                </>
              )}

              <div className="text-base ">
                <p className="text-sm font-bold">
                  {row?.original?.employee_name}
                </p>
                <p className="text-xs text-gray-500 ">
                  {row?.original?.position_name}
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: () => <div>Date</div>,
        cell: ({ row }: any) => <>{row.getValue("date")}</>,
      },
      {
        accessorKey: "branch_name",
        header: () => <div>Location</div>,
        cell: ({ row }: any) => <>{row.getValue("branch_name")}</>,
      },
      {
        accessorKey: "shift_time",
        header: () => <div>Shift Time</div>,
        cell: ({ row }: any) => <>{row.getValue("shift_time")}</>,
      },
      {
        accessorKey: "punch_time",
        header: () => <div>Punch Time</div>,
        cell: ({ row }: any) => (
          <>
            {row.getValue("punch_time") == " - "
              ? null
              : row.getValue("punch_time")}
          </>
        ),
      },
      {
        accessorKey: "start",
        header: () => <div>Start </div>,
        cell: ({ row }: any) => (
          <div
            className="flex items-center gap-2"
            onClick={(e) => {
              
              if (row?.original?.status == 0) {
                e.stopPropagation();
                setShowStartTime({
                  id: row?.original?.id,
                });
                setShowEndTime(row.original?.end);
                setUnpaidBreak(row.original?.unpaid_break);
                if (row?.original?.start == null) {
                  formEdit.setValue("start_time", null);
                } else {
                  formEdit.setValue("start_time", row?.original?.start);
                }
                if (row?.original?.end == null) {
                  formEdit.setValue("end_time", null);
                } else {
                  formEdit.setValue("end_time", row?.original?.end);
                }
              }
            }}
          >
            <>
              {row?.original?.id === showStartTime?.id ? (
                <AuthPermission
                  permissionRequired={[
                    PERMISSIONS.can_override_timecards,
                    PERMISSIONS.can_edit_timecards,
                  ]}
                >
                  <>
                    {isLoadingUpdatePayroll ? (
                      <Loader2 />
                    ) : (
                      <FormProvider {...formEdit}>
                        <PopularShiftInput
                          className="w-[50px] px-1 text-center h-[30px] "
                          name="start_time"
                          formkey="start_time"
                          focusedInput={focusedInput}
                          setFocusedInput={setFocusedInput}
                        />
                        <button
                          className={`border border-[#D1D5D7] w-[30px] h-[30px] flex items-center justify-center rounded-md cursor-pointer disabled:opacity-50`}
                          type="button"
                          onClick={() => {
                            onSubmit({
                              ...formEdit.getValues(),
                              id: row?.original?.id,
                            });
                          }}
                        >
                          <MemoChecked color="var(--secondary)" />
                        </button>
                      </FormProvider>
                    )}
                  </>
                </AuthPermission>
              ) : (
                <>
                  <p>
                    {row.getValue("start") === null
                      ? "--:--"
                      : row.getValue("start")}
                  </p>

                  {row?.original?.start_status !== "on time" && (
                    <CustomTooltip
                      tooltipContent={
                        row?.original?.start_status == "early"
                          ? "Early clock in"
                          : row?.original?.start_status == "late"
                          ? "Late clock in"
                          : "Missing clock in"
                      }
                      tooltipIcon={
                        row?.original?.start_status == null ? (
                          <LateIcon color="var(--warn)" />
                        ) : (
                          <LateIcon />
                        )
                      }
                    />
                  )}
                </>
              )}
            </>
          </div>
        ),
      },
      {
        accessorKey: "end",
        header: () => <div>End </div>,

        cell: ({ row }: any) => (
          <div
            className="flex items-center gap-2"
            onClick={(e) => {
              if (row?.original?.status == 0) {
                e.stopPropagation();
                setShowStartTime(row.getValue("start_time"));
                setUnpaidBreak(row.getValue("unpaid_break"));


                setShowEndTime({
                  id: row?.original?.id,
                });
                if (row?.original?.start == null) {
                  formEdit.setValue("start_time", null);
                } else {
                  formEdit.setValue("start_time", row?.original?.start);
                }
                if (row?.original?.end == null) {
                  formEdit.setValue("end_time", null);
                } else {
                  formEdit.setValue("end_time", row?.original?.end);
                }
              }
            }}
          >
            <>
              {row?.original?.id === showEndTime?.id ? (
                <AuthPermission
                  permissionRequired={[
                    PERMISSIONS.can_override_timecards,
                    PERMISSIONS.can_edit_timecards,
                  ]}
                >
                  <>
                    {isLoadingUpdatePayroll ? (
                      <Loader2 />
                    ) : (
                      <FormProvider {...formEdit}>
                        <PopularShiftInput
                          className="w-[50px] px-1 text-center h-[30px] "
                          name="end_time"
                          formkey="end_time"
                          focusedInput={focusedInput}
                          setFocusedInput={setFocusedInput}
                        />
                        <button
                          className={`border border-[#D1D5D7] w-[30px] h-[30px] flex items-center justify-center rounded-md cursor-pointer disabled:opacity-50`}
                          type="button"
                          onClick={() => {
                            onSubmit({
                              ...formEdit.getValues(),
                              id: row?.original?.id,
                            });
                          }}
                        >
                          <MemoChecked color="var(--secondary)" />
                        </button>
                      </FormProvider>
                    )}
                  </>
                </AuthPermission>
              ) : (
                <>
                  <p>
                    {row.getValue("end") === null
                      ? "--:--"
                      : row.getValue("end")}
                  </p>
                  {row?.original?.attend_status && (
                    <div className=" bg-primary rounded-md text-white py-[1px]">
                      🌜 +1
                    </div>
                  )}
                  {row?.original?.end_status !== "on time" && (
                    <CustomTooltip
                      tooltipContent={
                        row?.original?.end_status == "early"
                          ? "Early clock out"
                          : row?.original?.end_status == "late"
                          ? "Late clock out"
                          : "Missing clock out"
                      }
                      tooltipIcon={
                        row?.original?.end_status == null ? (
                          <LateIcon color="var(--warn)" />
                        ) : (
                          <LateIcon />
                        )
                      }
                    />
                  )}
                </>
              )}
            </>
          </div>
        ),
      },
      {
        accessorKey: "length",
        header: () => <div>Length</div>,
        cell: ({ row }: any) => <>{row.getValue("length")}</>,
      },
      {
        accessorKey: "unpaid_break",
        header: () => <div>Unpaid Break</div>,
        cell: ({ row }: any) => (
          <div
            className="flex items-center gap-3"
            onClick={(e) => {

              if (row?.original?.status == 0) {
                if (
                  row?.original?.start !== null ||
                  row?.original?.end !== null
                ) {
                  e.stopPropagation();
                  setShowStartTime(row.getValue("start"));
                  setShowEndTime(row.getValue("end"));
                  setUnpaidBreak({
                    id: row?.original?.id,
                  });
                  if (row?.original?.start == null) {
                    formEdit.setValue("start_time", null);
                  } else {
                    formEdit.setValue("start_time", row?.original?.start);
                  }
                  if (row?.original?.end == null) {
                    formEdit.setValue("end_time", null);
                  } else {
                    formEdit.setValue("end_time", row?.original?.end);
                  }
                }
              }
            }}
          >
            {row?.original?.id === unpaidBreak?.id ? (
              <AuthPermission
                permissionRequired={[
                  PERMISSIONS.can_override_timecards,
                  PERMISSIONS.can_edit_timecards,
                ]}
              >
                <>
                  {isLoadingUpdatePayroll ? (
                    <Loader2 />
                  ) : (
                    <FormProvider {...formEdit}>
                      <PopularShiftInput
                        className="w-[50px] px-1 text-center h-[30px] "
                        name="unpaid_break"
                        formkey="unpaid_break"
                        focusedInput={focusedInput}
                        setFocusedInput={setFocusedInput}
                      />
                      <button
                        className={`border border-[#D1D5D7] w-[30px] h-[30px] flex items-center justify-center rounded-md cursor-pointer disabled:opacity-50`}
                        type="button"
                        onClick={() => {
                          onSubmit({
                            ...formEdit.getValues(),
                            id: row?.original?.id,
                          });
                        }}
                      >
                        <MemoChecked color="var(--secondary)" />
                      </button>
                    </FormProvider>
                  )}
                </>
              </AuthPermission>
            ) : (
              <>
                {row.getValue("unpaid_break") == null
                  ? null
                  : row.getValue("unpaid_break")}
              </>
            )}
          </div>
        ),
      },
      {
        accessorKey: "wage",
        header: () => <div>Wages</div>,
        cell: ({ row }: any) => <>SAR {row.getValue("wage")}</>,
      },
      {
        accessorKey: "shift_type",
        header: () => <div>Shift Type</div>,
        cell: ({ row }: any) => (
          <div className="flex items-center gap-[10px]">
            <p> {row.getValue("shift_type")}</p>
            {row?.original?.status == 0 && (
              <>
                <AuthPermission
                  permissionRequired={[PERMISSIONS.can_override_timecards]}
                >
                  {row?.index == rowIndex ? (
                    <CloseIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        setRowData(row?.original?.id);
                        setModalName("delete");
                      }}
                    />
                  ) : (
                    <div className="w-[20px] h-[20px] "></div>
                  )}
                </AuthPermission>
              </>
            )}{" "}
          </div>
        ),
      },
    ],
    [showEndTime, showStartTime, isLoadingUpdatePayroll, rowIndex]
  );

  const defaultValues = {
    name: "",
    name_localized: "",
  };
  const form = useForm<z.infer<typeof formPayrollSchema>>({
    resolver: zodResolver(formPayrollSchema),
    defaultValues,
  });

  const handleConfirm = () => {
    if (modalName === "delete") {
      console.log(modalName);
      deletePayroll(rowData || "");
    } else {
      handleClose();
    }
  };
  const exportInventory = () => {
    exportPayroll();
  };

  return (
    <>
      <HeaderPage
        title="Timecards"
        textButton={rowsSelectedIds[0]?.status == 1 ? "Unapprove" : "Approve"}
        disabled={!rowsSelectedIds.length}
        loading={isLoadingApprovePayroll||isLoadingExportPayroll}

        onClickAdd={() => {
          approvePayroll({
            timecardIds: rowsSelectedIds.map((d) => d.id),
            approveCheck: rowsSelectedIds?.[0]?.status == 0 ? true : false,
          });
          setRowsSelectedIds([]);
        }}
        permission={[
          PERMISSIONS.can_export_timecards,
          PERMISSIONS.can_override_timecards,
          PERMISSIONS.can_approve_timecards,
        ]}
        exportInventory={true}
        onClickExportInventory={exportInventory}
        
      />
      <HeaderTable
        isStatus={true}
        isSearch={false}
        optionStatus={PayrollStatusOptions}
        isEmployees={true}
        isBranchesTimeCard={filterObj?.["filter[branch]"]?true:false}
        branchkey="filter[branch]"
      />
      <CustomTable
        loading={isLoadingtimeCardData}
        data={timeCardData?.data}
        columns={columns}
        paginationData={timeCardData?.meta}
        onRowClick={(row: any) => {
          setOpen(true);
          setRowData(row?.id);
        }}
        setRowIndex={setRowIndex}
      />

      <CustomSheet
        isOpen={open}
        headerLeftText={"Add Shift"}
        form={form}
        isLoadingForm={!isLoadingTimeCardOne}
        btnText={"Add Shift"}
        isEdit={false}
        isDirty={false}
        onSubmit={() => {}}
        handleCloseSheet={() => {
          setOpen(false);
        }}
        purchaseHeader={
          <div className="flex items-center gap-2">
            <Avatar text="Mostafa Tarek" bg="secondary" />
            <div className="text-sm">
              <p>{timeCardOne?.employee_name}</p>
              <p className="text-[12px] text-gray-300">
                {moment(timeCardOne?.date).format("DD MMM") || "-"} ,
                {timeCardOne?.shift_time}
              </p>
            </div>
          </div>
        }
      >
        <DetailsTimeCard timeCardOne={timeCardOne}/>
      </CustomSheet>

      <CustomModal
        modalName={modalName == "delete" ? "delete" : ""}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={"this's time card"}
        isPending={isLoadingDeletePayroll}
      />
    </>
  );
};

export default Payroll;
