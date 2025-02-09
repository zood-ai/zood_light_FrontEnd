import useCustomQuery from "@/hooks/useCustomQuery";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { formItemSchema } from "../schema/Schema";
import axiosInstance from "@/guards/axiosInstance";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useDefaultBranch } from "@/hooks/useBranch";

interface IUseItemsHttp {
  itemId?: string;
  handleCloseSheet?: () => void;
  setFromItem?: (data: any) => void;
}
const useItemsHttp = ({
  itemId,
  handleCloseSheet,
  setFromItem,
}: IUseItemsHttp) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();

  const {
    data: itemsData,
    refetch: refetchItems,
    isFetching: isItemsLoading,
  } = useCustomQuery(
    ["items", filterObj],
    "forecast-console/items",
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

  const {
    data: item,
    refetch: refetchOne,
    isFetching: isItemLoading,
  } = useCustomQuery(
    ["items", itemId || ""],
    `forecast-console/items/${itemId || ""}`,
    {
      select: (data: any) => {
        const newDataFormat = {
          name: data?.data?.name,
          type: data?.data?.type,
          category_id: data?.data?.category_id,
          exclude_product_from_gp: !!data?.data?.exclude_product_from_gp,
          suppliers: data?.data?.suppliers?.map((s: any) => ({
            id: s?.id,
            item_supplier_code: s?.pivot?.item_supplier_code,
            specific_name: s?.pivot?.specific_name,
            pack_size: s?.pivot?.pack_size,
            pack_unit: s?.pivot?.pack_unit,
            pack_per_case: s?.pivot?.pack_per_case,
            cost: s?.pivot?.cost,
            tax_group_id: s?.pivot?.tax_group_id,
            is_main: s?.pivot?.is_main,
          })),
          branches: data?.data?.branches?.map((b: any) => ({
            id: b?.id,
          })),
          stock_counts: data?.data?.stock_counts?.map((b: any) => ({
            show_as: b?.show_as,
            report_preview: b?.report_preview,
            use_report: b?.use_report,
            count: b?.count,
            pack_unit: data?.data?.suppliers?.map(
              (s: any) => s?.pivot?.pack_unit
            )?.[0],
            pack_size: data?.data?.suppliers?.map(
              (s: any) => s?.pivot?.pack_size
            )?.[0],
            pack_per_case: data?.data?.suppliers?.map(
              (s: any) => s?.pivot?.pack_per_case
            )?.[0],
          })),
        };

        return newDataFormat;
      },
      enabled: !!itemId,
      onSuccess: (data) => {
        setFromItem?.(data?.data);
      },
    }
  );

  // creeate Item
  const { mutate: CreateItem, isPending } = useMutation({
    mutationKey: ["items/create"],
    mutationFn: async (values: z.infer<typeof formItemSchema>) => {
      return axiosInstance.post("forecast-console/items", values);
    },
    onSuccess: (data) => {
      toast({
        description: "Item Created Successfully",
      });
      refetchItems();
      handleCloseSheet?.();
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data.message,
        });
      } else {
        toast({
          description: error?.data?.message,
        });
      }
    },
  });

  // delete item
  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ["items/delete"],
    mutationFn: async (id: string) => {
      return axiosInstance.delete(`forecast-console/items/${id}`);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchItems();
      handleCloseSheet?.();
    },
  });

  // edit item
  const { mutate: mutateEdit, isPending: isPendingEdit } = useMutation({
    mutationKey: ["items/edit"],
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: z.infer<typeof formItemSchema>;
    }) => {
      return axiosInstance.put(`forecast-console/items/${id}`, values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchItems();
      refetchOne();
      handleCloseSheet?.();
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data.message,
        });
      } else {
        toast({
          description: error?.data?.message,
        });
      }
    },
  });

  // export
  const { mutate: ItemsExport, isPending: isPendingExport } = useMutation({
    mutationKey: ["items/export"],
    mutationFn: async () => {
      return axiosInstance.get("/forecast-console/items?excel=true");
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });

      window.open(data?.data?.data?.url, "_blank");
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
  return {
    CreateItem,
    mutateDelete,
    mutateEdit,
    ItemsExport,
    item,
    itemsData,
    isPending,
    isPendingDelete,
    isPendingEdit,
    isItemsLoading,
    isItemLoading,
    isPendingExport,
  };
};

export default useItemsHttp;
