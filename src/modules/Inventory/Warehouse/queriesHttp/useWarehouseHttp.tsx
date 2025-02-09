import { useToast } from "@/components/ui/use-toast";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/guards/axiosInstance";
import { z } from "zod";
import useCustomQuery from "@/hooks/useCustomQuery";
import { formWareHouseSchema } from "../schema/Schema";

type IWarehouse = {
  handleCloseSheet?: () => void;
  setReference?: (value: string) => void;
};
const useWarehouseHttp = ({ handleCloseSheet, setReference }: IWarehouse) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();
  const queryClient = useQueryClient();
  const {
    data,
    refetch,
    isFetching: isLoading,
  } = useCustomQuery(
    ["warehouses", filterObj],
    `/inventory/inventory-warehouses`,
    {},
    filterObj
  );
  const { mutate: CreateWarehouse, isPending } = useMutation({
    mutationKey: ["warehouse/create"],
    mutationFn: async (values: z.infer<typeof formWareHouseSchema>) => {
      return axiosInstance.post("/inventory/inventory-warehouses", values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });

      queryClient.invalidateQueries({
        queryKey: ["warehouse"],
      });
      handleCloseSheet?.();
    },
  });

  const { mutate: mutateEdit, isPending: isPendingEdit } = useMutation({
    mutationKey: ["warehouse/edit"],
    mutationFn: async (values: z.infer<typeof formWareHouseSchema>) => {
      return axiosInstance.put(
        `/inventory/inventory-warehouses/${values.id}`,
        values
      );
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetch();
      handleCloseSheet?.();
    },
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ["warehouse/delete"],
    mutationFn: async (id: string) => {
      return axiosInstance.delete(`/inventory/inventory-warehouses/${id}`);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetch();
      handleCloseSheet?.();
    },
  });

  const { mutate: createReference, isPending: isPendingReference } =
    useMutation({
      mutationKey: ["warehouse-reference"],
      mutationFn: async () => {
        return axiosInstance.post("manage/generate_reference", {
          model: "branches",
        });
      },
      onSuccess: (data) => {
        setReference?.(data?.data?.data?.toString());
      },
    });
  return {
    CreateWarehouse,
    mutateEdit,
    mutateDelete,
    isPendingDelete,
    isLoading,
    isPending,
    isPendingEdit,
    createReference,
    data,
    isPendingReference,
  };
};

export default useWarehouseHttp;
