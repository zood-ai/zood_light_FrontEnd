import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { ColumnDef } from "@tanstack/react-table";
import { IOrdersList } from "./types/type";
import moment from "moment";
import { useState } from "react";
import useOrdersHttp from "./queriesHttp/useOrdersHttp";
import {
  handleStatus,
  handleStatusBadge,
  handleStatusBadgeDetails,
} from "./helpers/helpers";
import { Badge } from "@/components/ui/badge";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formOrdersSchema } from "./schema/Schema";
import { z } from "zod";
import ContentOrder from "./components/ContentOrder";
import { StatusOptionsOrders } from "@/constants/dropdownconstants";
import { log } from "console";

const Orders = () => {
  const columns: ColumnDef<IOrdersList>[] = [
    {
      accessorKey: "reference",
      header: () => <div>Reference</div>,
      cell: ({ row }) => <>{row.getValue("reference")}</>,
    },
    {
      accessorKey: "number",
      header: () => <div>Number</div>,
      cell: ({ row }: any) => <>{row.getValue("number")}</>,
    },
    {
      accessorKey: "branch",
      header: () => <div>Branch</div>,
      cell: ({ row }: any) => <>{row.getValue("branch")?.name || "-"}</>,
    },
    {
      accessorKey: "status",
      header: () => <div>Status</div>,
      cell: ({ row }: any) => (
        <div>
          {" "}
          <Badge variant={`${handleStatusBadge(row.getValue("status"))}`}>
            {handleStatus(row.getValue("status")) || "-"}
          </Badge>{" "}
        </div>
      ),
    },
    {
      accessorKey: "source",
      header: () => <div>Source</div>,
      cell: ({ row }: any) => <>{row.getValue("source")}</>,
    },
    {
      accessorKey: "total_price",
      header: () => <div>Total</div>,
      cell: ({ row }: any) => <>{row.getValue("total_price")}</>,
    },
    {
      accessorKey: "business_date",
      header: () => <div>Business date</div>,
      cell: ({ row }: any) => (
        <>{moment(row.getValue("business_date")).format("LL") || "-"}</>
      ),
    },
    {
      accessorKey: "opened_at",
      header: () => <div>Opened at</div>,
      cell: ({ row }: any) => {
        console.log(
          row
            .getValue("opened_at")
            ?.slice(0, row.getValue("opened_at")?.lastIndexOf("-")),
          "row.getValue('opened_at')"
        );

        return (
          <>
            {moment(
              row
                .getValue("opened_at")
                ?.slice(0, row.getValue("opened_at")?.lastIndexOf("-"))
            ).format("LL") || "-"}
          </>
        );
      },
    },
  ];
  const [rowData, setRowData] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modalName, setModalName] = useState("");
  const handleCloseSheet = () => {
    setIsOpen(false);
  };

  const {
    OrdersData,
    isLoadingOrders,
    OrdersOne,
    isLoadingOrdersOne,
    ExportOrders,
    loadingExport,
  } = useOrdersHttp({
    handleCloseSheet: handleCloseSheet,
    IdOrder: rowData?.id,
  });

  const onSubmit = () => {};
  const defaultValues = {};
  const form = useForm<z.infer<typeof formOrdersSchema>>({
    resolver: zodResolver(formOrdersSchema),
    defaultValues,
  });

  return (
    <>
      <HeaderPage
        title="Orders"
        exportButton
        loading={loadingExport}
        onClickAdd={() => {
          // setIsOpen(true);
        }}
        handleExport={() => {
          ExportOrders();
        }}
        handleImport={() => {}}
      />
      <HeaderTable
        isStatus={true}
        isBranches={true}
        isOrderType={true}
        optionStatus={StatusOptionsOrders}
      />

      <CustomTable
        columns={columns}
        data={OrdersData?.data || []}
        height="h-[600px]"
        onRowClick={(row: any) => {
          setRowData(row);
          setIsEdit(true);
          setIsOpen(true);
        }}
        loading={isLoadingOrders}
        paginationData={{
          current_page: OrdersData?.current_page,
          to: OrdersData?.to,
          total: OrdersData?.total,
          last_page: OrdersData?.last_page,
        }}
      />

      <CustomSheet
        isOpen={isOpen}
        purchaseHeader={
          <>
            Order #{OrdersOne?.reference}
            <Badge variant={`${handleStatusBadgeDetails(OrdersOne?.status)}`}>
              {OrdersOne?.status || "-"}
            </Badge>
          </>
        }
        handleCloseSheet={handleCloseSheet}
        form={form}
        onSubmit={onSubmit}
        setModalName={setModalName}
        isLoadingForm={isLoadingOrdersOne}
      >
        <>
          <ContentOrder OrdersOne={OrdersOne} />
        </>
      </CustomSheet>
    </>
  );
};

export default Orders;
