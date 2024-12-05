import FilterOptions from "@/components/FilterOption";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { RequestsStatusOptions } from "@/constants/dropdownconstants";
import { ColumnDef, Row } from "@tanstack/react-table";
import { IRequestsList } from "./types/types";
import { format } from "date-fns";
import Avatar from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formRequestSchema } from "./Schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import RequestDetails from "./components/RequestDetails";
import useRequeststHttp from "./queriesHttp/RequestsHttp";
import { Status, Type } from "./contants/contants";
import CustomModal from "@/components/ui/custom/CustomModal";
import { getBadgeColor } from "./helpers/helpers";

const Requests = () => {
  const columns: ColumnDef<IRequestsList>[] = [
    {
      accessorKey: "created_at",
      header: () => <div>Requested date</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => (
        <>{format(row.getValue("created_at"), "dd MMM")}</>
      ),
    },
    {
      accessorKey: "employee",
      header: () => <div>Request by</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => {
        const name =
          row.original.employee.first_name +
          " " +
          row.original.employee.last_name;
        return (
          <div className="flex items-center gap-2">
            <Avatar text={name} />
            <div>{name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: () => <div>Location</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => (
        <>{row.original.branch.name || "-"}</>
      ),
    },
    {
      accessorKey: "type",
      header: () => <div>Type</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => {
        return (
          <div className="">{Type[row.getValue("type") as number] || "-"}</div>
        );
      },
    },
    // {
    //   accessorKey: "for",
    //   header: () => <div>For</div>,
    //   cell: ({ row }: { row: Row<IRequestsList> }) => {
    //     return <div className="">{row.getValue("for") || "-"}</div>;
    //   },
    // },
    // {
    //   accessorKey: "overlapwith",
    //   header: () => <div>Overlapwith</div>,
    //   cell: ({ row }: { row: Row<IRequestsList> }) => {
    //     return <div className="">SAR {row.getValue("overlapwith") || "-"}</div>;
    //   },
    // },
    {
      accessorKey: "status",
      header: () => <div>Status</div>,
      cell: ({ row }: { row: Row<IRequestsList> }) => {
        return (
          <div className="">
            <Badge variant={getBadgeColor(row.getValue("status"))}>
              {Status[row.getValue("status") as number]}
            </Badge>
          </div>
        );
      },
    },
  ];

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
  const { RequestsData, isFetchingRequests, approveRequest, isApproveRequest } =
    useRequeststHttp({
      handleCloseSheet,
    });

  const form = useForm<z.infer<typeof formRequestSchema>>({
    resolver: zodResolver(formRequestSchema),
  });

  const handleSubmit = async (data: z.infer<typeof formRequestSchema>) => {
    approveRequest({ requestId: rowData?.id ?? 0, status: "11" });
  };

  const handleConfirm = async () => {
    approveRequest({ requestId: rowData?.id ?? 0, status: "12" });
  };

  return (
    <>
      <HeaderPage
        title="Employee Requests"
        children={
          <FilterOptions
            filters={[
              { label: "Approvals", group_by: "4" },
              { label: "Time off", group_by: "2" },
              { label: "Shift changes", group_by: "3" },
            ]}
          />
        }
      />
      <HeaderTable
        isStatus
        isSearch={false}
        optionStatus={RequestsStatusOptions}
      />
      <CustomTable
        columns={columns}
        data={RequestsData?.data || []}
        loading={isFetchingRequests}
        paginationData={RequestsData?.meta}
        onRowClick={(row: IRequestsList) => {
          if (row.status == "1") {
            setRowData(row);
            setIsOpen(true);
          }
        }}
      />

      <CustomSheet
        isOpen={isOpen}
        isEdit={isOpen}
        DeleteText="Reject"
        isLoading={isApproveRequest}
        headerLeftText="Approve schedule request"
        textEditButton="Approve"
        form={form}
        handleCloseSheet={handleCloseSheet}
        onSubmit={handleSubmit}
        setModalName={setModalName}
      >
        <RequestDetails rowData={rowData} />
      </CustomSheet>

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        isPending={isApproveRequest}
        deletedItemName="this request"
      />
    </>
  );
};

export default Requests;
