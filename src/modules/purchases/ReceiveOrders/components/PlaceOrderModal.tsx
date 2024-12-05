import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import PurchaseOrderForm from "../../PurchaseOrders/components/PurchaseOrderForm";
import ShoppingCartFrom from "../../PurchaseOrders/components/ShoppingCartFrom";
import useFilterQuery from "@/hooks/useFilterQuery";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useCustomQuery from "@/hooks/useCustomQuery";
import { format } from "date-fns";
import { formSupplierSchema } from "../../PurchaseOrders/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import usePurchaseOrderHttp from "../../PurchaseOrders/queriesHttp/usePurchaseOrderHttp";
import CustomModal from "@/components/ui/custom/CustomModal";

const PlaceOrderModal = ({
  openDraftModal,
  setOpenDraftModal,
  supplierId,
  supplierName,
  isLoadingReceiveOrderOne,
  formItems,
  orderId,
  notes,
  handleClose,
  selectedDeliveryDate,
}: {
  openDraftModal: boolean;
  setOpenDraftModal: Dispatch<SetStateAction<boolean>>;
  supplierId: string;
  supplierName: string;
  isLoadingReceiveOrderOne: boolean;
  formItems: any;
  orderId: string;
  notes: string;
  selectedDeliveryDate: string;
  handleClose: () => void;
}) => {
  const { filterObj } = useFilterQuery();
  const [showCart, setShowCart] = useState(false);

  const [modalName, setModalName] = useState("");

  const { data: items, isFetching } = useCustomQuery(
    ["get/purchase-orders"],
    `forecast-console/orders/${filterObj["filter[branch]"]}/supplier/${supplierId}/items`,
    {
      enabled: !!supplierId && !!filterObj["filter[branch]"],
    },
    {},
    "post"
  );

  const handleCloseSheet = () => {
    setOpenDraftModal(false);
    setShowCart(false);
    setModalName("");
  };

  const defaultValues = {
    business_date: format(new Date(), "yyyy-MM-dd"),
    delivery_date: selectedDeliveryDate,
    notes: "",
    items: [],
  };

  const form = useForm<z.infer<typeof formSupplierSchema>>({
    resolver: zodResolver(formSupplierSchema),
    defaultValues,
  });

  const {
    CreatePurchaseOrder,
    LoadingCreatePurchaseOrder,
    UpdatePurchaseOrder,
    LoadingUpdatePurchaseOrder,
    DeletePurchaseOrder,
    LoadingDeletePurchaseOrder,
  } = usePurchaseOrderHttp({ handleCloseSheet });

  const onSubmit = (values: z.infer<typeof formSupplierSchema>) => {
    CreatePurchaseOrder({ ...values, status: "2" });
  };

  const handleRequest = () => {
    UpdatePurchaseOrder({
      values: form.getValues(),
      orderId: orderId as string,
    });
  };

  const handleDelete = () => {
    DeletePurchaseOrder({
      orderId,
    });
  };

  useEffect(() => {
    if (formItems?.length > 0) {

      form.setValue(
        "items",
        formItems.map(
          (item: {
            id: string;
            quantity: number;
            item_id: string;
            order_cost: number;
            tax_amount: number;
            tax_group_id: string;
            total_cost: number;
            sub_total: number;
            invoice_quantity: number;
            total_tax: number;
            unit: string;
            pack_per_case: number;
            pack_size: number;
          }) => ({
            item_id: item.item_id,
            id: item.item_id,
            unit: item.unit,
            pack_per_case: item.pack_per_case,
            pack_size: item.pack_size,
            quantity: item.quantity,
            invoice_quantity: item.invoice_quantity,
            cost: item.order_cost,
            total_tax: +item.total_tax || 0,
            tax_amount: +item.tax_amount,
            tax_group_id: item.tax_group_id,
            total_cost: item.total_cost,
            sub_total: item.sub_total,
          })
        )
      );
    }
    form.setValue("notes", notes);
    form.setValue("delivery_date", selectedDeliveryDate?.split(" ")[0]);
  }, [formItems, notes]);

  return (
    <>
      {/* PlaceOrder Modal */}
      <CustomSheet
        width="w-[672px]"
        isOpen={openDraftModal}
        isDirty={form.getValues("items").length > 0}
        isEdit={form.getValues("items").length > 0}
        setModalName={setModalName}
        handleCloseSheet={() => {
          handleCloseSheet();
          handleClose();
        }}
        form={form}
        onSubmit={onSubmit}
        isLoadingForm={isFetching || isLoadingReceiveOrderOne}
        children={
          <PurchaseOrderForm
            items={items}
            setShowCart={setShowCart}
            handleCloseSheet={() => {
              handleCloseSheet();
              handleClose();
            }}
            supplierId={supplierId}
            formReceive
            showCart={showCart}
            orderId={orderId}
          />
        }
        titleStyle="justify-center w-full"
        purchaseHeader={
          <div className="-m-3 text-center ">
            <h3 className="font-semibold text-textPrimary">{supplierName}</h3>
            <span className="text-gray-500 font-medium text-[14px]">
              Deliver{" "}
              {items?.deliveryDate?.order_rules
                ?.map((rule: any) => rule.delivery_day.slice(0, 3))
                .join(",")}
            </span>
          </div>
        }
      />
      <CustomSheet
        width="w-[672px]"
        isOpen={!!supplierId && showCart}
        handleCloseSheet={() => setShowCart(false)}
        form={form}
        onSubmit={onSubmit}
        children={
          <ShoppingCartFrom
            items={items}
            handleCloseSheet={handleCloseSheet}
            formReceive
            orderId={orderId}
          />
        }
        contentStyle="px-2"
        headerStyle="border-b-0 w-full"
        titleStyle="justify-center"
        purchaseHeader={
          <div className="-m-3 text-center ">
            <h3 className="font-semibold text-textPrimary">{supplierName}</h3>
            <span className="text-gray-500 font-medium text-[14px]">
              Deliver{" "}
              {items?.deliveryDate?.order_rules
                ?.map((rule: any) => rule.delivery_day.slice(0, 3))
                .join(",")}
            </span>
          </div>
        }
      />

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        headerModal="Are you sure you want to stop ordering?"
        descriptionModal="Are you sure you want to cancel this order? You can save it for later or delete and start again."
        handleConfirm={handleDelete}
        handleRequest={handleRequest}
        isPending={
          LoadingCreatePurchaseOrder ||
          LoadingUpdatePurchaseOrder ||
          LoadingDeletePurchaseOrder
        }
        contentStyle="pt-[32px] pb-[10px] font-medium"
        confirmbtnText="Delete Order"
        confirmbtnStyle="bg-warn text-white"
        modalWidth="w-[448px]"
        showSaveLaterBtn
      />
    </>
  );
};

export default PlaceOrderModal;
