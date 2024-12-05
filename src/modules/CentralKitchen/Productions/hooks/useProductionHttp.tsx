import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useDefaultBranch } from "@/hooks/useBranch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/guards/axiosInstance";

const useProductionHttp = (CpuId?: string) => {
  const { filterObj } = useFilterQuery();
  const queryClient = useQueryClient();

  const cpuBranchId = filterObj["filter[branch]"];

  // get all Productions
  const {
    data: ProductionData,
    isPending: isLoadingProduction,
    isFetching: isFetchingProduction,
  } = useCustomQuery(
    [`productions/${CpuId}`, filterObj],
    `forecast-console/cpu-production/${CpuId}`,
    { enabled: !!CpuId },
    {
      ...useDefaultBranch(),
      ...(() => {
        const newFilterObj = { ...filterObj };
        delete newFilterObj["filter[branch]"];
        return newFilterObj;
      })(),
    }
  );

  // update production
  const { mutate: updateproduction, isPending: isPendingUpdate } = useMutation({
    mutationKey: ["production/update"],
    mutationFn: async ({
      itemData,
      cpuBranchId,
    }: {
      cpuBranchId: string;
      itemData: {};
    }) => {
      const res = await axiosInstance.post(
        `forecast-console/update-cpu-production/${cpuBranchId}`,
        itemData
      );
      return res.data;
    },
    onSuccess: ({ data }) => {
      queryClient.setQueryData(
        [`productions/${cpuBranchId}`, filterObj],
        (oldData: any) => {
          if (!oldData) return;
          const itemData = Object.values(oldData?.data)
            .flat()
            .find((item: any) => item.id === data.item_id) as any;

          const branchData = itemData?.branches.find(
            (b) => b.id === data.branch_id
          );
          branchData.need = data.branch_need;
          itemData.total = data.cpu_need;
          return {
            ...oldData,
          };
        }
      );

      // queryClient.invalidateQueries({
      //   queryKey: [`productions/${cpuBranchId}`, filterObj],
      // });
    },
  });

  // update status
  const { mutate: updateStatus, isPending: isPendingUpdateStatus } =
    useMutation({
      mutationKey: ["production/update-status"],
      mutationFn: async ({
        itemData,
        cpuBranchId,
      }: {
        cpuBranchId: string;
        itemData: {};
      }) => {
        const res = await axiosInstance.post(
          `forecast-console/status-cpu-production/${cpuBranchId}`,
          itemData
        );
        return res.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [`productions/${cpuBranchId}`, filterObj],
        });
      },
    });

  return {
    ProductionData,
    isLoadingProduction,
    isFetchingProduction,

    updateproduction,
    isPendingUpdate,

    updateStatus,
    isPendingUpdateStatus,
  };
};

export default useProductionHttp;
