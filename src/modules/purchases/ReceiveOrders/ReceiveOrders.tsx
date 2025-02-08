import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { ColumnDef } from "@tanstack/react-table";
import { IReveiceOrders } from "./types/types";
import useReceiveOrdersHttp from "./queriesHttp/useReceiveOrdersHttp";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { handleStatus, handleStatusShap } from "./helpers/helpers";
import { useState } from "react";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomCircle from "@/components/ui/custom/CustomCircle";
import InvoiceDetails from "./components/InvoiceDetails";
import OrderItems from "./components/OrderItems";
import CustomModal from "@/components/ui/custom/CustomModal";
import useFilterQuery from "@/hooks/useFilterQuery";
import ChooseBranch from "@/components/ui/custom/ChooseBranch";
import {
  formReceiveOrderSchema,
  formReceiveOrderWithoutSchema,
  formTransferCPUSchema,
} from "./schema/Schema";
import SuppliersList from "./components/SelectSupplier";
import ItemsList from "./components/SelectItems";
import ArrowReturn from "@/assets/icons/ArrowReturn";
import SingleItem from "./components/SingleItem";
import Summary from "./components/Summary";
import DelivaryData from "./components/DelivaryData";
import PlaceOrderModal from "./components/PlaceOrderModal";
import { Button } from "@/components/ui/button";
import InvoiceForm from "./components/InvoiceModal";
import CancelModal from "./components/CanceledModal";
import TransferCPUModal from "./components/TransferCpuModal";
import { PERMISSIONS } from "@/constants/constants";

const ReceiveOrders = () => {
  const columns: ColumnDef<IReveiceOrders>[] = [
    {
      accessorKey: "reference",
      header: () => <div>Order Number</div>,
      cell: ({ row }) => <div>{row.getValue("reference")}</div>,
    },
    {
      accessorKey: "supplier_name",
      header: () => <div>Supplier</div>,
      cell: ({ row }) => {
        return (
          <div className="">
            <CustomCircle text={row.getValue("supplier_name")} />
          </div>
        );
      },
    },
    {
      accessorKey: "added_by",
      header: () => <div>Order placed by</div>,
      cell: ({ row }) => (
        <div className="">
          <CustomCircle text={row.getValue("added_by")} />
        </div>
      ),
    },

    {
      accessorKey: "business_date",
      header: () => <div>Order date</div>,
      cell: ({ row }) => {
        return (
          <div className="">
            {moment(row.getValue("business_date")).format("LL") || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "delivery_date",
      header: () => <div>Delivery date</div>,
      cell: ({ row }) => {
        return (
          <div className="">
            {moment(row.getValue("delivery_date")).format("LL") || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "sub_total",
      header: () => <div>Expected price</div>,
      cell: ({ row }) => {
        return (
          <div className="">
            {" "}
            {row.getValue("sub_total") == 0
              ? "-"
              : `SAR ${row.getValue("sub_total")}`}
          </div>
        );
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
  const [isEdit, setIsEdit] = useState(false);
  const [isAddImage, setAddImage] = useState(false);
  const [openDraftModal, setOpenDraftModal] = useState(false);
  const [openCloseModal, setOpenCloseModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [steps, setSteps] = useState<number>(1);
  const [check, setCheck] = useState<boolean>(false);
  const [isOpenWithoutOrder, setIsOpenWithoutOrder] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransferCpu, setIsTransferCpu] = useState(false);
  const [rowData, setRowData] = useState<string>();
  const [rowDataInvoice, setRowDataInvoice] = useState<string>();
  const [rowDataCancel, setRowDataCancel] = useState<string>();
  const [modalName, setModalName] = useState("");
  const [index, setIndex] = useState(-1);
  const { filterObj } = useFilterQuery();
  const handleCloseSheet = () => {
    setIsOpen(false);
    setIsEdit(false);
    setIsOpenWithoutOrder(false);
    setOpenCloseModal(false);
    setSteps(1);
    setRowData("");
    form.reset(defaultValues);
    formWithout.reset(defaultValues);
    setModalName("");
    setRowDataCancel("");
    setRowDataInvoice("");
    setIsTransferCpu(false);
  };

  const {
    receiveOrdersData,
    isReceiveLoading,
    receiveOrder,
    receviceOrderAction,
    isLoadingReceiveOrderOne,
    isLoadingReceiveOrderAction,
    receviceOrderCancel,
    isLoadingReceiveOrderCancel,
    updateOrder,
    isLoadingorderUpdateOrder,
  } = useReceiveOrdersHttp({
    orderId: rowData,
    setIsEdit: setIsOpen,
    handleCloseSheet: handleCloseSheet,
    setReceiveOne: (data: any) => {
      form.reset(data);
      formTransferCPU.reset(data);
    },
  });

  const defaultValues = {
    item: { name: "", id: "" },
    invoice_number: "",
    purchase_order_id: "",
    invoice_date: moment(new Date()).format("YYYY-MM-DD"),
    business_date: moment(new Date()).format("YYYY-MM-DD"),
    total_cost: receiveOrder?.total_cost,
    total_tax: 0,
    sub_total: 0,
    status: "4",
    branch: "",
    total: 0,
    supplier: receiveOrder?.suppplier?.id,
    creditNotes: [],
    credit_notes_price: [],
    accept_price_change_from_supplier: 0,
    items: [],
    image: "",
  };

  const form = useForm({
    resolver: zodResolver(formReceiveOrderSchema),
    defaultValues,
  });

  const formWithout = useForm({
    resolver: zodResolver(formReceiveOrderWithoutSchema),
    defaultValues,
  });
  const formTransferCPU = useForm({
    resolver: zodResolver(formTransferCPUSchema),
    defaultValues,
  });

  const onSubmit = (values: any) => {
    if (isTransferCpu) {
      updateOrder({ ...values, status: 2 });
    } else {
      receviceOrderAction({ ...values, status: 4 });
    }
  };

  const handleConfirm = () => {
    handleCloseSheet();

    if (modalName == "delete") {
      receviceOrderCancel({
        id: receiveOrder?.purchase_order_id,
        status: 3,
      });
    }
  };
 
  
console.log(form.formState.errors);

  return (
    <>
      {Object.keys(filterObj)?.length == 0 ? (
        <>
          <ChooseBranch showHeader />
        </>
      ) : (
        <>
          <HeaderPage
            title="Orders"
            textButton="Receive without order"
            onClickAdd={() => {
              setIsOpenWithoutOrder(true);
            }}
            permission={[PERMISSIONS.can_access_inventory_management_features]}
          />
          <HeaderTable isSearch={false} isStatus={true} />
          <CustomTable
            columns={columns}
            data={receiveOrdersData?.data || []}
            loading={isReceiveLoading}
            paginationData={receiveOrdersData?.meta}
            onRowClick={(row: any) => {
              if (row?.status == 1) {
                // draft
                setOpenDraftModal(true);
                setRowData(row?.id);
                return;
              }
              if (row?.status == 2 || row?.status == 22) {
                // requested
                setRowData(row?.id);
                setIsOpen(true);
              }
              if (row?.status == 2 && row?.has_cpu_transaction == true) {
                // requested
                setRowData(row?.id);
                setIsTransferCpu(true);
              }
              if (row?.status == 4) {
                // closed
                setOpenCloseModal(true);
                setRowDataInvoice(row?.invoice_id);
              }
              if (row?.status == 3 || row?.status == 21) {
                // canceled
                setOpenCancelModal(true);
                setRowDataCancel(row?.id);
              }
            }}
          />
          {/*----------------------- Draft--------------------------------- */}
          <PlaceOrderModal
            openDraftModal={openDraftModal}
            setOpenDraftModal={setOpenDraftModal}
            supplierId={receiveOrder?.supplier_id}
            isLoadingReceiveOrderOne={!isLoadingReceiveOrderOne}
            supplierName={receiveOrder?.supplier_name}
            formItems={receiveOrder?.items}
            notes={receiveOrder?.notes}
            orderId={rowData || ""}
            selectedDeliveryDate={receiveOrder?.delivery_date}
            handleClose={handleCloseSheet}
          />
          {/*----------------------- Closed--------------------------------- */}
          <InvoiceForm
            setIsEditItem={setOpenCloseModal}
            rowDataInvoice={rowDataInvoice}
            openCloseModal={openCloseModal}
            setModalName={setModalName}
            setOpenCloseModal={setOpenCloseModal}
          />

          {/*----------------------- Canceled--------------------------------- */}
          <CancelModal
            setIsEditItem={setOpenCancelModal}
            rowData={rowDataCancel}
            openCloseModal={openCancelModal}
            setModalName={setModalName}
            setOpenCloseModal={setOpenCancelModal}
          />
          {/*----------------------- Requested--------------------------------- */}

          <CustomSheet
            // textEditButton="Receive order"
            width="w-[95%]"
            isOpen={isOpen}
            isEdit={isOpen}
            handleCloseSheet={handleCloseSheet}
            headerLeftText={"Waste details"}
            form={form}
            // isLoadingForm={isFetchingWastesOne}
            setModalName={setModalName}
            headerStyle="border-b-0 flex items-center justify-between w-full"
            purchaseHeader={
              <div className="flex items-center gap-2">
                <CustomCircle text={receiveOrder?.supplier_name} />
                <span className="px-2 pt-1 font-light text-light text-textPrimary">
                  {receiveOrder?.reference}
                </span>
                <Badge variant="info">
                  {receiveOrder?.status == "22" ? "Incoming" : "Requested"}{" "}
                </Badge>{" "}
                {form.watch(`accept_price_change_from_supplier`) == 1 &&
                  form.formState.isDirty && (
                    <Badge variant="success">Price change</Badge>
                  )}
              </div>
            }
            receiveOrder={
              <>
                <div className="flex items-center gap-2">
                  {/* <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setAddImage(true);
                    }}
                  >
                    Add Photo{" "}
                  </Button> */}

                  <Button
                    type="button"
                    loading={
                      isLoadingReceiveOrderAction || isLoadingReceiveOrderCancel
                    }
                    variant={"outline"}
                    className="px-4 font-semibold w-fit text-warn border-warn"
                    onClick={() => {
                      setModalName("delete");
                    }}
                  >
                    Cancel Order
                  </Button>
                  <Button
                    disabled={!form.formState.isValid}
                    loading={
                      isLoadingReceiveOrderAction || isLoadingReceiveOrderCancel
                    }
                  >
                    Receive Order
                  </Button>
                </div>
              </>
            }
            // isAddText={}
            // isAddTextClick={() => {
            //   setAddImage(!isAddImage);
            // }}
            isLoading={isLoadingReceiveOrderAction}
            isLoadingForm={!isLoadingReceiveOrderOne}
            contentStyle="p-0"
            onSubmit={onSubmit}
            textEditButton="Receive order"
            permission={[PERMISSIONS.can_access_inventory_management_features]}
          >
            <>
              <InvoiceDetails />
              <OrderItems rowData={rowData} isAddImage={isAddImage} />
            </>
          </CustomSheet>

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

          {/*-----------------------CPU  Requested--------------------------------- */}

          <CustomSheet
            // textEditButton="Receive order"
            width="w-[95%]"
            isOpen={isTransferCpu}
            isEdit={isTransferCpu}
            handleCloseSheet={handleCloseSheet}
            headerLeftText={"Waste details"}
            form={formTransferCPU}
            // isLoadingForm={isFetchingWastesOne}
            setModalName={setModalName}
            headerStyle="border-b-0 flex items-center justify-between w-full"
            purchaseHeader={
              <div className="flex items-center gap-2">
                <CustomCircle text={receiveOrder?.supplier_name} />
                <span className="px-2 pt-1 font-light text-light text-textPrimary">
                  {receiveOrder?.reference}
                </span>
                <Badge variant="info"> Requested</Badge>{" "}
                {formTransferCPU.watch(`accept_price_change_from_supplier`) ==
                  1 && <Badge variant="success">Price change</Badge>}
              </div>
            }
            receiveOrder={
              <>
                <div className="flex items-center gap-2">
                  {/* <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setAddImage(true);
                    }}
                  >
                    Add Photo{" "}
                  </Button> */}

                  <Button
                    type="button"
                    loading={
                      isLoadingorderUpdateOrder || isLoadingReceiveOrderCancel
                    }
                    variant={"outline"}
                    className="px-4 font-semibold w-fit text-warn border-warn"
                    onClick={() => {
                      setModalName("delete");
                    }}
                  >
                    Cancel Order
                  </Button>
                  <Button
                    disabled={!formTransferCPU.formState.isValid}
                    loading={
                      isLoadingorderUpdateOrder || isLoadingReceiveOrderCancel
                    }
                  >
                    Update
                  </Button>
                </div>
              </>
            }
            // isAddText={}
            // isAddTextClick={() => {
            //   setAddImage(!isAddImage);
            // }}
            isLoading={isLoadingReceiveOrderAction}
            isLoadingForm={!isLoadingReceiveOrderOne}
            contentStyle="p-0"
            onSubmit={onSubmit}
            textEditButton="Receive order"
            permission={[PERMISSIONS.can_access_inventory_management_features]}
          >
            <>
              <TransferCPUModal />
            </>
          </CustomSheet>

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
          {/* -------------------------------------------Without order------------------------------------ */}

          <CustomSheet
            width="w-[672px]"
            isLoading={isLoadingReceiveOrderAction}
            isOpen={isOpenWithoutOrder}
            handleCloseSheet={handleCloseSheet}
            isEdit={isEdit}
            form={formWithout}
            onSubmit={onSubmit}
            setModalName={setModalName}
            textEditButton="Receive order"
            receiveOrder={
              steps == 4 ? (
                <div
                  className={` text-[20px] font-bold cursor-pointer ${
                    check
                      ? "text-primary"
                      : "text-primary-foreground cursor-not-allowed"
                  }`}
                  onClick={() => {
                    setIndex(-1);
                    if (check) {
                      setSteps(3);
                    }

                    setCheck(false);
                  }}
                >
                  Done
                </div>
              ) : (
                <></>
              )
            }
            purchaseHeader={
              <div className="flex ">
                {steps == 1 && <div>Select Supplier</div>}
                {steps == 2 && (
                  <div className="flex items-center">
                    <ArrowReturn
                      height="17px"
                      className="cursor-pointer"
                      onClick={() => {
                        setSteps(1);
                      }}
                    />{" "}
                    <div className="px-3 mt-1">Delivery details</div>
                  </div>
                )}
                {steps == 3 && (
                  <div className="flex items-center">
                    <ArrowReturn
                      height="17px"
                      className="cursor-pointer"
                      onClick={() => {
                        setSteps(2);
                      }}
                    />{" "}
                    <div className="px-3 mt-1"> Items</div>
                  </div>
                )}
                {steps == 4 && (
                  <div className="flex items-center">
                    <ArrowReturn
                      height="17px"
                      className="cursor-pointer"
                      onClick={() => {
                        if (!check) {
                          const items = formWithout.watch("items") || []; // Capture the current items
                          const currentItem: any = formWithout.watch("item"); // Capture the current item to be removed
                          if (Array.isArray(items)) {
                            const updatedItems: any = items.filter(
                              (i: { id: string; unit: string }) =>
                                i?.id !== currentItem?.id &&
                                i?.unit !== currentItem?.unit
                            );

                            formWithout.setValue("items", updatedItems);
                          }
                        }
                        setSteps(3);
                      }}
                    />{" "}
                    <div className="px-3 mt-1 capitalize">
                      {formWithout.watch("item")?.name}
                    </div>
                  </div>
                )}
                {steps == 5 && (
                  <div className="flex items-center">
                    <ArrowReturn
                      height="17px"
                      className="cursor-pointer"
                      onClick={() => {
                        setSteps(1);
                      }}
                    />{" "}
                    <div className="px-3 mt-1"> Items</div>
                  </div>
                )}
                {steps == 6 && (
                  <div className="flex items-center">
                    <ArrowReturn
                      height="17px"
                      className="cursor-pointer"
                      onClick={() => {
                        setSteps(3);
                      }}
                    />{" "}
                    <div className="px-3 mt-1"> Summary</div>
                  </div>
                )}
              </div>
            }
            permission={[PERMISSIONS.can_access_inventory_management_features]}
          >
            <>
              {steps == 1 && <SuppliersList setSteps={setSteps} />}
              {steps == 2 && <DelivaryData setSteps={setSteps} />}
              {steps == 3 && <ItemsList setSteps={setSteps} />}
              {steps == 4 && <SingleItem setCheck={setCheck} index={index} />}
              {steps == 5 && <ItemsList setSteps={setSteps} />}
              {steps == 6 && (
                <Summary
                  setIndex={setIndex}
                  setSteps={setSteps}
                  isLoadingReceiveOrderAction={isLoadingReceiveOrderAction}
                />
              )}
            </>
          </CustomSheet>
        </>
      )}
    </>
  );
};

export default ReceiveOrders;
