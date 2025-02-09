import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  formItemSchema,
  formReceiveOrderSchema,
  formTransferCPUSchema,
  uploadImageSchema,
} from "../schema/Schema";
import axiosInstance from "@/guards/axiosInstance";
import { z } from "zod";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import moment from "moment";
import useCommonRequests from "@/hooks/useCommonRequests";

const useReceiveOrdersHttp = ({
  orderId,
  handleCloseSheet,
  handleAppend,
  setReceiveOne,
  setIsEdit,
}: {
  orderId?: string;
  handleCloseSheet?: () => void;
  handleAppend?: (data: any) => void;
  setReceiveOne?: any;
  setIsEdit?: any;
}) => {
  const { filterObj } = useFilterQuery();

  const { taxGroups } = useCommonRequests({
    getTaxGroups: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: receiveOrdersData,
    isFetching: isReceiveLoading,
    refetch: refetchReceiveOrders,
  } = useCustomQuery(
    ["receive-order", filterObj],
    "forecast-inventory/orders",
    {},
    { ...filterObj }
  );

  // get one
  const {
    data: receiveOrder,
    isFetchedAfterMount: isLoadingReceiveOrderOne,
    isPending,
    refetch: refetchReceiveOrderOne,
  } = useCustomQuery(
    ["receive-order-one", orderId ?? ""],
    `forecast-inventory/orders/${orderId || ""}`,
    {
      select: (data: any) => {
        const newDataFormat = {
          purchase_order_id: data?.data?.id,
          supplier_name: data?.data?.supplier?.name,
          supplier_id: data?.data?.supplier?.id,
          supplier: data?.data?.supplier?.id,
          branch_id: data?.data?.branch?.id,
          status: data?.data?.status,
          reference: data?.data?.reference,
          notes: data?.data?.notes,
          delivery_date: data?.data?.delivery_date,
          total_tax: data?.data?.total_tax,
          sub_total: data?.data?.sub_total || 0,
          total_cost: data?.data?.total_cost || 0,
          image: data?.data?.images?.[0],
          branch: filterObj["filter[branch]"],
          accept_price_change_from_supplier:
            data?.data?.supplier.accept_price_change,
          invoice_date:
            data?.data?.status == 2 ? moment(new Date()).format("YYYY-MM-DD") : moment(data?.data?.delivery_date).format("YYYY-MM-DD"),
          business_date:
            data?.data?.status == 2 ? moment(new Date()).format("YYYY-MM-DD") : moment(data?.data?.business_date).format("YYYY-MM-DD"),

          items: data?.data?.items?.map((e: any) => ({
            item_id: e?.id,
            code: e?.code,
            name: e?.name,
            unit: e?.unit,
            price_per_unit: e?.pivot?.cost,
            invoice_quantity: e?.pivot?.invoice_quantity || 0,
            quantity: e?.pivot?.quantity || 0,
            cost: e?.pivot?.cost,
            pack_unit: e?.pack_unit,
            supplier_item_id: e?.pivot?.supplier_item_id,
            order_cost: e?.pivot?.cost,
            total_tax: e?.pivot?.total_tax,
            total_cost: e?.pivot?.total_cost,
            sub_total: e?.pivot?.sub_total,
            tax_group_id: e?.pivot?.tax_group_id,
            pack_size: +e?.pivot?.pack_size,
            pack_per_case: +e?.pivot?.pack_per_case,
            tax_amount: +(e?.pivot?.total_tax / e?.pivot?.quantity)?.toFixed(2),
            // tax_amount: (
            //   (taxGroups?.find(
            //     (a: { id: string }) => a.id === e?.pivot?.tax_group_id
            //   )?.rate /
            //     100) *
            //   +e?.pivot?.sub_total
            // ).toFixed(2),
       
          })),
        };

        return newDataFormat;
      },
      enabled: !!orderId,
      onSuccess: (data) => {
        setReceiveOne({
          purchase_order_id: data?.data?.id,
          supplier_name: data?.data?.supplier?.name,
          supplier_id: data?.data?.supplier?.id,
          status: data?.data?.status,
          supplier: data?.data?.supplier?.id,
          branch_id: data?.data?.branch?.id,
          notes: data?.data?.notes,
          delivery_date: data?.data?.delivery_date,
          reference: data?.data?.reference,
          total_tax: data?.data?.total_tax,
          sub_total: data?.data?.sub_total || 0,
          total_cost: data?.data?.total_cost || 0,
          branch: filterObj["filter[branch]"],
          accept_price_change_from_supplier:
            data?.data?.supplier.accept_price_change,
          invoice_date: data?.data?.status == 2 ? moment(new Date()).format("YYYY-MM-DD") : moment(data?.data?.delivery_date).format("YYYY-MM-DD"),
          business_date: data?.data?.status == 2 ? moment(new Date()).format("YYYY-MM-DD") : moment(data?.data?.business_date).format("YYYY-MM-DD"),
          image: data?.data?.images?.[0],
          has_cpu_transaction: data?.data?.has_cpu_transaction,
          items: data?.data?.items?.map((e: any) => ({
            item_id: e?.id,
            code: e?.code,
            name: e?.name,
            unit: e?.unit,
            price_per_unit: e?.pivot?.cost,
            supplier_item_id: e?.pivot?.supplier_item_id,

            invoice_quantity: e?.pivot?.invoice_quantity || 0,
            quantity: e?.pivot?.quantity || 0,
            cost: e?.pivot?.cost,
            order_cost: e?.pivot?.cost,
            pack_size: +e?.pivot?.pack_size,
            pack_per_case: +e?.pivot?.pack_per_case,

            total_cost: e?.pivot?.total_cost,
            sub_total: e?.pivot?.sub_total,
            tax_group_id: e?.pivot?.tax_group_id,
            tax_amount:
              e?.pivot?.tax_group_id == null
                ? 0
                : +(
                  (taxGroups?.find(
                    (a: { id: string }) => a.id === e?.pivot?.tax_group_id
                  )?.rate /
                    100) *
                  +e?.pivot?.sub_total
                ).toFixed(2),
          })),
        });
      },
    }
  );
  // recevie order action
  const {
    mutate: receviceOrderAction,
    isPending: isLoadingReceiveOrderAction,
  } = useMutation({
    mutationKey: ["recevice-order-action"],
    mutationFn: async (values: z.infer<typeof formReceiveOrderSchema>) => {
      return axiosInstance.post("forecast-console/receive-order", values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchReceiveOrders();
      handleCloseSheet?.();
    },
    onError: (error: any) => {
      toast({
        description: error.data.message,
      });
    },
  });
  // recevie order update

  const { mutate: updateOrder, isPending: isLoadingorderUpdateOrder } =
    useMutation({
      mutationKey: ["recevice-order-action"],
      mutationFn: async (values: z.infer<typeof formTransferCPUSchema>) => {
        return axiosInstance.put(
          `forecast-inventory/orders/${values?.purchase_order_id}`,
          values
        );
      },
      onSuccess: (data) => {
        toast({
          description: data?.data?.message,
        });
        refetchReceiveOrders();
        handleCloseSheet?.();
      },
      onError: (error: any) => {
        toast({
          description: error.data.message,
        });
      },
    });
  // recevie order cancel

  const {
    mutate: receviceOrderCancel,
    isPending: isLoadingReceiveOrderCancel,
  } = useMutation({
    mutationKey: ["recevice-order-Cancel"],
    mutationFn: async (values: any) => {
      return axiosInstance.put(
        `forecast-inventory/orders/${values?.id}`,
        values
      );
    },
    onSuccess: (data) => {
      toast({
        description: "Order Cancelled Successfully",
      });
      refetchReceiveOrders();
      handleCloseSheet?.();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data.message,
        });
      } else {
        toast({
          description: error.message,
        });
      }
    },
  });

  const { data: itemsData, isPending: isFetchingItems } = useCustomQuery(
    ["get/purchase-orders", filterObj],
    `forecast-console/orders/${filterObj["filter[branch]"]}/supplier/${filterObj["filter[supplier]"]}/items`,
    {},
    {},
    "post"
  );

  // creeate Item
  const { mutate: CreateItem, isPending: isLoadingCreateItem } = useMutation({
    mutationKey: ["items/create"],
    mutationFn: async (values: z.infer<typeof formItemSchema>) => {
      return axiosInstance.post("forecast-console/items", values);
    },
    onSuccess: (data: any) => {
      toast({
        description: "Created Item Successfully",
      });
      handleAppend?.(data);
    },
    onError: (error: any) => {
      toast({
        description: error.data.message,
      });
    },
  });
  // upload image
  const { mutate: uploadImage, isPending: isLoadingUploadImage } = useMutation({
    mutationKey: ["receive/upload-image", orderId],
    mutationFn: async (values: z.infer<typeof uploadImageSchema>) => {
      return axiosInstance.post("forecast-console/upload-image", values);
    },
    onSuccess: (data: any) => {
      toast({
        description: "Upload Image Successfully",
      });
      refetchReceiveOrderOne();

      setIsEdit(false);
    },
    onError: (error: any) => {
      toast({
        description: error.data.message,
      });
      setIsEdit(false);
    },
  });

  // remove image
  const { mutate: removeImage, isPending: isLoadingremoveImage } = useMutation({
    mutationKey: ["receive/remove-image", orderId],
    mutationFn: async (values: { id: string }) => {
      return axiosInstance.delete(
        `forecast-console/attachment-image/${values?.id}`
      );
    },
    onSuccess: (data: any) => {
      toast({
        description: "Deleted Image Successfully",
      });

      refetchReceiveOrderOne();
      setIsEdit(false);
    },
    onError: (error: any) => {
      toast({
        description: error.data.message,
      });
      setIsEdit(false);
    },
  });

  return {
    receiveOrdersData,
    isReceiveLoading,
    receiveOrder,
    receviceOrderAction,
    refetchReceiveOrders,
    itemsData,
    isFetchingItems,
    CreateItem,
    isLoadingReceiveOrderOne,
    isLoadingReceiveOrderAction,
    isLoadingCreateItem,
    receviceOrderCancel,
    uploadImage,
    isLoadingUploadImage,
    isLoadingremoveImage,
    removeImage,
    isLoadingReceiveOrderCancel,
    isLoadingorderUpdateOrder,
    updateOrder,

  };
};

export default useReceiveOrdersHttp;
