import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/guards/axiosInstance";
import { z } from "zod";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import moment from "moment";
import useCommonRequests from "@/hooks/useCommonRequests";
import { formItemSchema, formOrdersSchema } from "../schema/schema";
import { useDefaultBranch } from "@/hooks/useBranch";

const useOrdersHttp = ({
  orderId,
  handleCloseSheet,
  handleAppend,
  setOrderOne,
  setIsEdit,
}: {
  orderId?: string;
  handleCloseSheet?: () => void;
  handleAppend?: (data: any) => void;
  setOrderOne?: any;
  setIsEdit?: any;
}) => {
  const { filterObj } = useFilterQuery();

  const { taxGroups } = useCommonRequests({
    getTaxGroups: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: ordersData,
    isFetching: isorderLoading,
    refetch: refetchOrders,
  } = useCustomQuery(
    ["order-order", filterObj],
    "forecast-inventory/orders",
    {},

    {
      ...useDefaultBranch(),
      ...(() => {
        const newFilterObj = { ...filterObj };
        delete newFilterObj["filter[branch]"];
        return newFilterObj;
      })(),
    }
  );

  // get one
  const {
    data: OrderOne,
    isFetchedAfterMount: isLoadingOrderOrderOne,
    refetch: refetchOrderOrderOne,
  } = useCustomQuery(
    ["order-order-one", orderId ?? ""],
    `forecast-inventory/orders/${orderId || ""}`,
    {
      select: (data: any) => {
        const newDataFormat = {
          purchase_order_id: data?.data?.id,
          branch_cpu_id: data?.data?.branch_cpu_id,
          supplier_name: data?.data?.supplier?.name,
          supplier_id: data?.data?.supplier?.id,
          status: data?.data?.status,
          reference: data?.data?.reference,
          notes: data?.data?.notes,
          delivery_date: data?.data?.delivery_date,
          total_tax: data?.data?.total_tax,
          sub_total: data?.data?.sub_total || 0,
          total_cost: data?.data?.total_cost || 0,
          supplier: data?.data?.supplier?.id,
          image: data?.data?.images?.[0],
          branch: data?.data?.branch?.id,
          accept_price_change_from_supplier:
            data?.data?.supplier.accept_price_change,
          invoice_date:
            moment(data?.data?.delivery_date).format("YYYY-MM-DD") || "",
          business_date:
            moment(data?.data?.business_date).format("YYYY-MM-DD") || "",

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
        setOrderOne({
          branch_cpu_id: data?.data?.branch_cpu_id,
          purchase_order_id: data?.data?.id,
          supplier_name: data?.data?.supplier?.name,
          supplier_id: data?.data?.supplier?.id,
          status: data?.data?.status,
          notes: data?.data?.notes,
          delivery_date: data?.data?.delivery_date,
          reference: data?.data?.reference,
          total_tax: data?.data?.total_tax,
          sub_total: data?.data?.sub_total || 0,
          total_cost: data?.data?.total_cost || 0,
          supplier: data?.data?.supplier?.id,
          branch: data?.data?.branch?.id,
          accept_price_change_from_supplier:
            data?.data?.supplier.accept_price_change,
          invoice_date:
            moment(data?.data?.delivery_date).format("YYYY-MM-DD") || "",
          business_date:
            moment(data?.data?.business_date).format("YYYY-MM-DD") || "",
          image: data?.data?.images?.[0],

          items: data?.data?.items?.map((e: any) => ({
            item_id: e?.id,
            code: e?.code,
            name: e?.name,
            unit: e?.unit,
            price_per_unit: e?.pivot?.cost,
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
  const { mutate: orderAction, isPending: isLoadingorderOrderAction } =
    useMutation({
      mutationKey: ["recevice-order-action"],
      mutationFn: async (values: z.infer<typeof formOrdersSchema>) => {
        return axiosInstance.put(
          `forecast-inventory/orders/${values?.purchase_order_id}`,
          values
        );
      },
      onSuccess: (data) => {
        toast({
          description: data?.data?.message,
        });
        refetchOrders();
        handleCloseSheet?.();
      },
      onError: (error: any) => {
        toast({
          description: error.data.message,
        });
      },
    });
  // recevie order

  const { mutate: orderCancel, isPending: isLoadingorderOrderCancel } =
    useMutation({
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
        refetchOrders();
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

  return {
    ordersData,
    isorderLoading,
    OrderOne,
    orderAction,
    refetchOrders,

    CreateItem,
    isLoadingOrderOrderOne,
    isLoadingCreateItem,
    orderCancel,
    isLoadingorderOrderAction,
    isLoadingorderOrderCancel,
  };
};

export default useOrdersHttp;
