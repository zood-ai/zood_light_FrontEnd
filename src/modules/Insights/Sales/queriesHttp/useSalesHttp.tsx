import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";

const useSalesInsightHttp = () => {
  const { filterObj } = useFilterQuery();

  const { data: SalesInsightsData, isLoading: isFetchingSalesInsight } =
    useCustomQuery(
      ["forecast-console/sale-insights", filterObj],
      "forecast-console/sale-insights",
      {},
      {
        ...filterObj,
      }
    );

  return {
    SalesInsightsData,
    isFetchingSalesInsight,
  };
};

export default useSalesInsightHttp;
