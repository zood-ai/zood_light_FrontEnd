import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formSupplierSchema } from "../Schema/Schema";
import { z } from "zod";
import axios from "axios";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useDefaultBranch } from "@/hooks/useBranch";

interface IUseSupplierHttp {
  handleCloseSheet: () => void;
  supplierId?: any;
  setSupplierOne?: any;
}
//create supplier
const useSupplierHttp = ({
  handleCloseSheet,
  setSupplierOne,
  supplierId,
}: IUseSupplierHttp) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();
  const queryClient = useQueryClient();

  //get All
  const {
    data: SupplierData,
    isLoading,
    refetch: refetchSupplier,
  } = useCustomQuery(
    ["suppliers", filterObj],
    `/forecast-console/suppliers`,
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
  // create supplier
  const { mutate: CreateSupplier, isPending } = useMutation({
    mutationKey: ["supplier/create"],
    mutationFn: async (values: z.infer<typeof formSupplierSchema>) => {
      return axiosInstance.post("forecast-console/suppliers", values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchSupplier();
      handleCloseSheet();
    },
    onError: (error: any) => {
      toast({
        description: error.data.message,
      });
    },
  });

  // delete item
  const { mutate: DeleteSupplier, isPending: isPendingDelete } = useMutation({
    mutationKey: ["supplier/delete"],
    mutationFn: async (id: string) => {
      return axiosInstance.delete(`forecast-console/suppliers/${id}`);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchSupplier();
      handleCloseSheet();
    },
  });
  //get one
  const {
    data: supplier,
    isFetching: isPendingOne,
    refetch: refetchOne,
  } = useCustomQuery(
    ["supplier", supplierId || ""],
    `forecast-console/suppliers/${supplierId || ""}`,
    {
      select: (data: any) => {
        const newDataFormat = {
          name: data?.data?.name,
          primary_email: data?.data?.primary_email,
          accept_price_change: data?.data?.accept_price_change,
          max_order: data?.data?.max_order,
          min_order: data?.data?.min_order,
          phone: data?.data?.phone,
          comment: data?.data?.comment,
          branches: data?.data?.branches?.map((b: any) => ({
            id: b?.id,
            name: b?.name,
            cc_email: b?.pivot?.cc_email || null,
            customer_code: +b?.pivot?.customer_code || null,
            order_rules: b?.pivot?.order_rules?.map((e: any) => ({
              order_day: e?.order_day,
              delivery_day: e?.delivery_day,
              order_time: e?.order_time,
            })),
          })),
        };

        return newDataFormat;
      },
      enabled: !!supplierId,
      onSuccess: (data) => {
        setSupplierOne?.({
          name: data?.data?.name,
          primary_email: data?.data?.primary_email,
          accept_price_change: data?.data?.accept_price_change,
          max_order: data?.data?.max_order,
          min_order: data?.data?.min_order,
          phone: data?.data?.phone,
          comment: data?.data?.comment,
          branches: data?.data?.branches?.map((b: any) => ({
            id: b?.id,
            name: b?.name,
            cc_email: b?.pivot?.cc_email || null,
            customer_code: +b?.pivot?.customer_code || null,
            order_rules: b?.pivot?.order_rules?.map((e: any) => ({
              order_day: e?.order_day,
              delivery_day: e?.delivery_day,
              order_time: e?.order_time,
            })),
          })),
        });
      },
    }
  );

  //edit
  const { mutate: EditSupplier, isPending: isPendingEdit } = useMutation({
    mutationKey: ["supplier/edit"],
    mutationFn: async ({
      supplierId,
      values,
    }: {
      supplierId: string;
      values: z.infer<typeof formSupplierSchema>;
    }) => {
      return axiosInstance.put(`forecast-console/suppliers/${supplierId}`, {
        ...values,
      });
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      handleCloseSheet();
      queryClient.invalidateQueries({ queryKey: ["supplier"] });
      refetchSupplier();
    },
    onError: (error: any) => {
      toast({
        description: error.data.message,
      });
    },
  });

  // export
  const { mutate: supplierExport, isPending: isPendingExport } = useMutation({
    mutationKey: ["supplier/export"],
    mutationFn: async () => {
      return axiosInstance.post("/forecast-console/supplier/export-bulk");
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      window.open(data?.data.url, "_blank");
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
    SupplierData,
    isLoading,
    CreateSupplier,
    DeleteSupplier,
    EditSupplier,
    isPending,
    isPendingDelete,
    supplier,
    isPendingEdit,
    isPendingOne,
    supplierExport,
    isPendingExport,
  };
};

export default useSupplierHttp;
