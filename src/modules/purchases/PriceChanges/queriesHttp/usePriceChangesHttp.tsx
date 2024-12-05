import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import { useDefaultBranch } from "@/hooks/useBranch";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const usePriceChangesHttp = ({ priceChangeId }: { priceChangeId?: string }) => {
  const { filterObj } = useFilterQuery();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: PriceChangesData, isFetching: isFetchingPriceChanges } =
    useCustomQuery(
      ["forecast-console/price-changes", filterObj],
      "forecast-console/price-changes",
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

  const { data: PriceChangeData, isLoading: isFetchingPriceChange } =
    useCustomQuery(
      [`forecast-console/invoice/${priceChangeId}`],
      `forecast-console/invoice/${priceChangeId}`,
      { enabled: !!priceChangeId }
    );

  const { mutate: updateStatus, isPending: isPendingStatus } = useMutation({
    mutationKey: ["forecast-console/price-changes"],
    mutationFn: async ({ id, status }: { id: string; status: number }) => {
      const res = await axiosInstance.put(
        `forecast-console/price-changes/${id}`,
        { status }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast({
        description: data?.message,
      });
      queryClient.invalidateQueries({
        queryKey: ["forecast-console/price-changes", filterObj],
      });
    },
  });
  return {
    PriceChangesData,
    isFetchingPriceChanges,
    PriceChangeData,
    isFetchingPriceChange,
    updateStatus,
    isPendingStatus,
  };
};

export default usePriceChangesHttp;
