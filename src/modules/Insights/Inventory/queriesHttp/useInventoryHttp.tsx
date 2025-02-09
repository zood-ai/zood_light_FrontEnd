import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useInventoryInsightHttp = () => {
  const { filterObj } = useFilterQuery();

  const { data: InventoryInsightsData, isLoading: isFetchingInventoryInsight } =
    useCustomQuery(
      ["forecast-console/inventory-insights", filterObj],
      "forecast-console/inventory-insights",
      {},
      {
        ...filterObj,
      }
    );

  const {
    data: InventoryInsightsDataBranch,
    isLoading: isFetchingInventoryInsightBranch,
  } = useCustomQuery(
    ["forecast-console/inventory-insight-branch", filterObj],
    `forecast-console/inventory-insights-branch`,
    {},
    {
      ...filterObj,
    }
  );

  const {
    data: InventoryInsightsDataChart,
    isLoading: isFetchingInventoryInsightChart,
  } = useCustomQuery(
    ["forecast-console/inventory-insight-charts", filterObj],
    `forecast-console/inventory-insights-charts`,
    {},
    {
      ...filterObj,
    }
  );

  const {
    data: InventoryInsightsDataDate,
    isLoading: isFetchingInventoryInsightDate,
  } = useCustomQuery(
    ["forecast-console/inventory-insight-date", filterObj],
    `forecast-console/inventory-insights-date`,
    {},
    {
      ...filterObj,
    }
  );
  return {
    InventoryInsightsData,
    isFetchingInventoryInsight,
    InventoryInsightsDataBranch,
    isFetchingInventoryInsightBranch,
    InventoryInsightsDataChart,
    isFetchingInventoryInsightChart,
    InventoryInsightsDataDate,
    isFetchingInventoryInsightDate,
  };
};

export default useInventoryInsightHttp;
