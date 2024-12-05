import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ICreateValues } from "../types/types";

interface IUseProductionsHttp {
  handleCloseSheet?: () => void;
}
const useProductionsHttp = ({ handleCloseSheet }: IUseProductionsHttp) => {
  const { filterObj } = useFilterQuery();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const branchId = searchParams.get("filter[branch]")
    ? `&filter[branches][0]=${searchParams.get("filter[branch]")}`
    : "";

  // get all production
  const { data: productionsData, isFetching: isFetchingProductions } =
    useCustomQuery(
      ["item-batching", filterObj],
      `forecast-console/item-batching?page=${filterObj.page || 1}${branchId}`
    );

  // update production
  const { mutate: updateproduction, isPending: isPendingUpdate } = useMutation({
    mutationKey: ["item-batching/update"],
    mutationFn: async ({
      row_id,
      quantity,
    }: {
      row_id: number;
      quantity: string;
    }) => {
      const res = await axiosInstance.put(
        `forecast-console/item-batching/${row_id}?quantity=${quantity}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      handleCloseSheet?.();

      toast({
        description: "Batch updated successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["item-batching", filterObj],
      });
    },
  });

  // delete production
  const { mutate: deleteproduction, isPending: isPendingDelete } = useMutation({
    mutationKey: ["delete-production"],
    mutationFn: async ({ row_id }: { row_id: Number }) => {
      const res = await axiosInstance.delete(
        `forecast-console/item-batching/${row_id}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast({
        description: "Batch deleted successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["item-batching", filterObj],
      });
      handleCloseSheet?.();
    },
  });

  // create production
  const { mutate: createproduction, isPending: isPendingCreate } = useMutation({
    mutationKey: ["forecast-console/item-batching"],
    mutationFn: async (values: ICreateValues) => {
      const res = await axiosInstance.post(`forecast-console/item-batching`, {
        ...values,
        branch_id: searchParams.get("filter[branch]"),
      });
      return res.data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["item-batching", filterObj],
      });

      toast({
        description: data?.message,
      });

      handleCloseSheet?.();
    },
    onError: (error) => {
      toast({
        description: error?.message,
      });
    },
  });

  return {
    productionsData: productionsData?.data,
    isFetchingProductions,
    deleteproduction,
    isPendingDelete,
    updateproduction,
    isPendingUpdate,
    createproduction,
    isPendingCreate,
  };
};

export default useProductionsHttp;
