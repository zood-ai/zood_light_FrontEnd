import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import { useDefaultBranch } from "@/hooks/useBranch";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { format, startOfYear } from "date-fns";

const useDashboardPurchasesHttp = () => {
  const { toast } = useToast();

  const { filterObj } = useFilterQuery();

  // get data by supplier
  const { data: dataBySupplier, isFetching: isLoadingDataBySupplier } =
    useCustomQuery(
      ["purchase-insights-supplier", filterObj],
      `/forecast-console/purchase-insights/by-supplier?from=${format(
        startOfYear(new Date()),
        "yyyy-MM-dd"
      )}&to=${format(new Date(), "yyyy-MM-dd")}`,
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

  // get data by location
  const { data: dataByLocation, isFetching: isLoadingDataByLocation } =
    useCustomQuery(
      ["purchase-insights-location", filterObj],
      `/forecast-console/purchase-insights/by-branch?from=${format(
        startOfYear(new Date()),
        "yyyy-MM-dd"
      )}&to=${format(new Date(), "yyyy-MM-dd")}`,
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

  // get data by item
  const { data: dataByItem, isFetching: isLoadingDataByItem } = useCustomQuery(
    ["purchase-insights-item", filterObj],
    `/forecast-console/purchase-insights/by-item?from=${format(
      startOfYear(new Date()),
      "yyyy-MM-dd"
    )}&to=${format(new Date(), "yyyy-MM-dd")}`,
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

  // export
  const { mutate: purchaseExport, isPending: isPurchaseExport } = useMutation({
    mutationKey: ["purchase-insights/export"],
    mutationFn: async ({ from, to }: { from: string; to: string }) => {
      return axiosInstance.get(
        `/forecast-console/purchase-insights/by-item?from=${from}&to=${to}&excel=true`
      );
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message || "Exported successfully",
      });

      window.open(data?.data?.url, "_blank");
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

  // get data by category
  const { data: dataByCategory, isFetching: isLoadingDataByCategory } =
    useCustomQuery(
      ["purchase-insights-category", filterObj],
      `/forecast-console/purchase-insights/by-category?from=${format(
        startOfYear(new Date()),
        "yyyy-MM-dd"
      )}&to=${format(new Date(), "yyyy-MM-dd")}`,
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

  // get total
  const { data: dataByTotal, isFetching: isLoadingDataByTotal } =
    useCustomQuery(
      ["purchase-insights-total", filterObj],
      `/forecast-console/purchase-insights/total?from=${format(
        startOfYear(new Date()),
        "yyyy-MM-dd"
      )}&to=${format(new Date(), "yyyy-MM-dd")}`,
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

  return {
    isLoadingDataBySupplier,
    dataBySupplier,

    isLoadingDataByLocation,
    dataByLocation,

    isLoadingDataByItem,
    dataByItem,

    isLoadingDataByCategory,
    dataByCategory,

    isLoadingDataByTotal,
    dataByTotal,

    purchaseExport,
    isPurchaseExport,
  };
};

export default useDashboardPurchasesHttp;
