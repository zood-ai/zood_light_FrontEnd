import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomCircle from "@/components/ui/custom/CustomCircle";

import CustomModal from "@/components/ui/custom/CustomModal";
import useFilterQuery from "@/hooks/useFilterQuery";
import ChooseBranch from "@/components/ui/custom/ChooseBranch";

import { Button } from "@/components/ui/button";

import { set } from "date-fns";
import { formOrdersSchema } from "./schema/schema";
import { handleStatus, handleStatusShap } from "./helpers/helpers";
import { IOrders } from "./types/types";
import InvoiceDetails from "./components/InvoiceDetails";
import OrderItems from "./components/OrderItems";
import useOrdersHttp from "./queriesHttp/useOrderHttp";
import { StatusOptionsOrderCpu } from "@/constants/dropdownconstants";

const Orders = () => {
  const columns: ColumnDef<IOrders>[] = [
    {
      accessorKey: "branch_name",
      header: () => <div>Branch </div>,
      cell: ({ row }) => (
        <>
          <CustomCircle text={row.getValue("branch_name")} />
        </>
      ),
    },
    {
      accessorKey: "business_date",
      header: () => <div>Received Date</div>,
      cell: ({ row }) => {
        return (
          <div className="">
            {moment(row.getValue("business_date")).format("LL")}{" "}
          </div>
        );
      },
    },
    {
      accessorKey: "delivery_date",
      header: () => <div>Delivery Date</div>,
      cell: ({ row }) => (
        <div className="">
          {moment(row.getValue("delivery_date")).format("LL")}
        </div>
      ),
    },

    {
      accessorKey: "sub_total",
      header: () => <div>Order Value</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("sub_total") || "-"}</div>;
      },
    },

    {
      accessorKey: "status",
      header: () => <div>Status</div>,
      cell: ({ row }) => {
        return (
          <div className="">
            <Badge variant={handleStatusShap(row.getValue("status"))}>
              {handleStatus(row.getValue("status")) || "-"}
            </Badge>
          </div>
        );
      },
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [check, setCheck] = useState(false);
  const [rowData, setRowData] = useState<any>();

  const [modalName, setModalName] = useState("");
  const handleCloseSheet = () => {
    setIsOpen(false);
    setRowData("");
    form.reset(defaultValues);
    setModalName("");
  };

  const defaultValues = {
    item: { name: "", id: "" },
    invoice_number: "",
    purchase_order_id: "",
    invoice_date: "",
    business_date: "",
    total_tax: 0,
    sub_total: 0,
    status: "22",
    branch: "",
    total: 0,
    creditNotes: [],
    credit_notes_price: [],
    accept_price_change_from_supplier: 0,
    items: [],
    image: "",
  };

  const form = useForm({
    resolver: zodResolver(formOrdersSchema),
    defaultValues,
  });

  const {
    ordersData,
    orderCancel,
    orderAction,
    isLoadingOrderOrderOne,
    isorderLoading,
    OrderOne,
    isLoadingorderOrderAction,
    isLoadingorderOrderCancel,
  } = useOrdersHttp({
    orderId: rowData?.id,
    setIsEdit: setIsOpen,
    handleCloseSheet: handleCloseSheet,
    setOrderOne: (data: any) => {
      form.reset(data);
    },
  });

  const onSubmit = (values: any) => {

    if (check) {
      orderAction({ ...values, status: 2 });
    } else {
      orderAction({ ...values, status: 22 });
    }
  };

  const handleConfirm = () => {
    handleCloseSheet();

    if (modalName == "delete") {
      orderCancel({
        id: OrderOne?.purchase_order_id,
        status: 21,
      });
    }
  };



  return (
    <>
      <>
        <HeaderPage title="Orders" />
        <HeaderTable
          isStatus={true}
          optionStatus={StatusOptionsOrderCpu}
          isSearch={false}

        />
        <CustomTable
          columns={columns}
          data={ordersData?.data}
          loading={isorderLoading}
          paginationData={ordersData?.meta}
          onRowClick={(row: any) => {
            setIsOpen(true);
            setRowData(row);
            if (row?.status == 2) {
              // draft

              return;
            }
          }}
        />

        {/*----------------------- Requested--------------------------------- */}

        <CustomSheet
          width="w-[95%]"
          isOpen={isOpen}
          isEdit={isOpen}
          handleCloseSheet={handleCloseSheet}
          headerLeftText={"Waste details"}
          form={form}
          isLoadingForm={!isLoadingOrderOrderOne}
          setModalName={setModalName}
          headerStyle="border-b-0 flex items-center justify-between w-full"
          purchaseHeader={
            <div className="flex items-center gap-3">
              {" "}
              <CustomCircle text={rowData?.branch_name} />
              <p>• Delivery requested</p>
              <Badge variant={handleStatusShap(rowData?.status)}>
                {handleStatus(rowData?.status) || "-"}
              </Badge>
            </div>
          }
          receiveOrder={
            <>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  // setAddImage(true);
                }}
              >
                Print
              </Button>
              {rowData?.status == 2 && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={"outline"}
                    className="w-fit px-4 font-semibold text-warn border-warn"
                    loading={
                      isLoadingorderOrderAction || isLoadingorderOrderCancel
                    }
                    onClick={() => {
                      setModalName("delete");
                    }}
                  >
                    Cancel Order
                  </Button>
                  {form.formState.isDirty && (
                    <Button
                      type="submit"
                      loading={
                        isLoadingorderOrderAction || isLoadingorderOrderCancel
                      }
                      onClick={() => {
                        setCheck(true);
                      }}
                    >
                      Save
                    </Button>
                  )}

                  <Button
                    type="submit"
                    disabled={!form.formState.isValid}
                    loading={
                      isLoadingorderOrderAction || isLoadingorderOrderCancel
                    }
                  >
                    Accept & Send Order
                  </Button>
                </div>
              )}
            </>
          }
          // isAddText={}
          // isAddTextClick={() => {
          //   setAddImage(!isAddImage);
          // }}

          contentStyle="p-0"
          onSubmit={onSubmit}
          textEditButton="Receive order"
        >
          <>
            <InvoiceDetails />
            <OrderItems rowData={rowData} />
          </>
        </CustomSheet>
        {/*  */}
        <CustomModal
          modalName={modalName}
          setModalName={setModalName}
          handleConfirm={handleConfirm}
          confirmbtnText={modalName == "delete" ? "Yes, Cancel" : "Yes, Stop"}
          headerModal={
            modalName == "delete"
              ? `Are you sure you want to cancel order?`
              : "Are you sure you want to stop edit?"
          }
          descriptionModal={
            " You have unsaved changes. if you exit now, you’ll lose your changes."
          }
        />
      </>
    </>
  );
};

export default Orders;
