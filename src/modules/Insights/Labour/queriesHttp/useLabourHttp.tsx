import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";

const useLabourHttp = () => {
  const { filterObj } = useFilterQuery();

  const { data: LabourInsightsData, isLoading: isFetchingLabourInsights } =
    useCustomQuery(
      ["forecast-console/labour-insights", filterObj],
      "forecast-console/labour-insights",
      {},
      {
        ...filterObj,
      }
    );

  return {
    LabourInsightsData,
    isFetchingLabourInsights,
  };
};

export default useLabourHttp;
