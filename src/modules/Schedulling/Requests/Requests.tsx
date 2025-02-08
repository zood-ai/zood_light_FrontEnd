import FilterOptions from "@/components/FilterOption";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import {
  RequestsStatusOptions,
  TimeOffRequestsTypeOptions,
} from "@/constants/dropdownconstants";
import { IRequestsList } from "./types/types";
import { useMemo, useState } from "react";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  formRequestSchema,
  formShiftChangesSchema,
  formTimeOffSchema,
} from "./Schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useRequeststHttp from "./queriesHttp/RequestsHttp";
import CustomModal from "@/components/ui/custom/CustomModal";
import { Button } from "@/components/ui/button";
import AuthPermission from "@/guards/AuthPermission";
import { PERMISSIONS } from "@/constants/constants";
import useRequestsColumns from "./hooks/useRequestsColumns";
import useFilterQuery from "@/hooks/useFilterQuery";
import RequestModal from "./components/RequestModal";
import { Badge } from "@/components/ui/badge";
import { Status } from "./contants/contants";
import { getBadgeColor } from "./helpers/helpers";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Requests = () => {
  const { ApprovalsColumns, TimeOffColumns, ShiftChangesColumns } =
    useRequestsColumns();
  const { filterObj } = useFilterQuery();

  const columns = useMemo(() => {
    return {
      "4": ApprovalsColumns,
      "2": TimeOffColumns,
      "3": ShiftChangesColumns,
    };
  }, [
    ApprovalsColumns,
    TimeOffColumns,
    ShiftChangesColumns,
    filterObj.group_by,
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [rowData, setRowData] = useState<IRequestsList>();
  const [modalName, setModalName] = useState("");

  const handleCloseSheet = () => {
    setIsEdit(false);
    setIsOpen(false);
    setModalName("");
    setRowData(undefined);
    form.reset({});
  };
  const {
    RequestsData,
    isFetchingRequests,
    approveRequest,
    isApproveRequest,
    TotalRequests,
  } = useRequeststHttp({
    handleCloseSheet,
    getTotal: true,
  });

  const ScheduleApprovalTotalReq = TotalRequests?.totals?.find(
    (req) => req?.type_enum == 4
  )?.total

  const TimeOffTotalReq = TotalRequests?.totals?.find(
    (req) => req?.type_enum == 2
  )?.total;

  const ShiftChangesTotalReq =
    TotalRequests?.totals?.find((req) => req?.type_enum == 3)?.total ?? 0;

  const OpenShiftTotalReq =
    TotalRequests?.totals?.find((req) => req?.type_enum == 1)?.total ?? 0;

  // console.log({
  //   ShiftChangesTotalReq,
  //   OpenShiftTotalReq,
  //   show: ShiftChangesTotalReq || OpenShiftTotalReq,
  // });

  const schema =
    filterObj.group_by === "4"
      ? formRequestSchema
      : rowData?.type == "3"
      ? formShiftChangesSchema
      : formTimeOffSchema;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  console.log({ form: form.getValues() });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    console.log({ data });

    // approveRequest({ requestId: rowData?.id ?? 0, status: "11" });
  };

  const handleConfirm = async () => {
    if (modalName === "close edit") {
      handleCloseSheet();
      return;
    }
    approveRequest({ requestId: rowData?.id ?? "0", status: "12" });
  };

  const modalLeftText = () => {
    switch (filterObj?.group_by) {
      case "4":
        return "Approve schedule request";
      case "2":
        return `${
          rowData?.type == "2" && rowData?.details?.type
            ? "🏝 Paid Holiday"
            : "💤 Unpaid Day off"
        } `;
      case "3":
        return rowData?.type == "1"
          ? "Claim shift request"
          : rowData?.shift && rowData?.original_shift
          ? "Swap shift request"
          : "Drop shift request";
      default:
        return "Approve schedule request";
    }
  };

  return (
    <>
      <HeaderPage title="Employee Requests">
        <FilterOptions
          filters={[
            {
              label: "Approvals",
              group_by: "4",
              showBadge: ScheduleApprovalTotalReq,
              badgeValue: ScheduleApprovalTotalReq,
            },
            {
              label: "Time off",
              group_by: "2",
              showBadge: TimeOffTotalReq,
              badgeValue: TimeOffTotalReq,

              premission: [PERMISSIONS.can_approve_holiday_request],
            },
            {
              label: "Shift changes",
              group_by: "3",
              premission: [PERMISSIONS.can_approve_schedule],
              showBadge: !!ShiftChangesTotalReq || !!OpenShiftTotalReq,
              badgeValue: ShiftChangesTotalReq + OpenShiftTotalReq,
            },
          ]}
        />
      </HeaderPage>
      <HeaderTable
        isStatus
        isSearch={false}
        isType={filterObj.group_by === "2"}
        TypeOptions={TimeOffRequestsTypeOptions}
        optionStatus={RequestsStatusOptions}
      />
      <CustomTable
        columns={columns[filterObj?.group_by] || ApprovalsColumns}
        data={RequestsData?.data || []}
        loading={isFetchingRequests}
        paginationData={RequestsData?.meta}
        onRowClick={(row: IRequestsList) => {
          setRowData(row);
          setIsOpen(true);

          if (filterObj?.group_by === "2") {
            setRowData(row);
            form.setValue("details", row.details ?? []);
            setIsOpen(true);
          }
        }}
      />

      <CustomSheet
        isOpen={isOpen}
        isEdit={isOpen}
        isDirty={form.formState.isDirty}
        DeleteText="Reject"
        hideIcon={
          rowData?.type == "2" || rowData?.type == "1" || rowData?.type == "3"
        }
        isLoading={isApproveRequest}
        headerLeftText={modalLeftText()}
        textEditButton="Approve"
        form={form}
        handleCloseSheet={handleCloseSheet}
        onSubmit={handleSubmit}
        setModalName={setModalName}
        purchaseHeader={
          rowData?.status != "1" ? (
            <div className="flex items-center justify-between w-full ">
              <span className="text-lg font-semibold">{modalLeftText()}</span>{" "}
              <Badge variant={getBadgeColor(rowData?.status ?? "1")}>
                {Status[rowData?.status as string]}
              </Badge>
            </div>
          ) : undefined
        }
        receiveOrder={
          rowData?.status == "1" ? (
            <AuthPermission
              permissionRequired={[PERMISSIONS.can_approve_schedule]}
            >
              <Button
                type="button"
                loading={isApproveRequest}
                className="px-2 font-semibold min-w-20"
                onClick={() => {
                  const data =
                    filterObj.group_by == "2"
                      ? {
                          details: form.getValues("details"),
                        }
                      : rowData?.type == "3" &&
                        !!form.getValues("replacement_id")
                      ? {
                          replacement_id: form.getValues("replacement_id"),
                        }
                      : {};

                  approveRequest({
                    requestId: rowData?.id ?? 0,
                    status: "11",
                    data,
                  });
                }}
              >
                Approve
              </Button>
            </AuthPermission>
          ) : undefined
        }
        permission={[PERMISSIONS.can_approve_schedule]}
      >
        <RequestModal rowData={rowData} />
      </CustomSheet>

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        isPending={isApproveRequest}
        headerModal="Are you sure you want to reject this request"
        confirmbtnText="Yes , Reject this request"
        deletedItemName="This request"
        descriptionModal={
          <>
            <Label className="block text-left">Add a note</Label>
            <Textarea className="w-full" />
          </>
        }
      />
    </>
  );
};

export default Requests;
