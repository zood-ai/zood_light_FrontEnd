import { useDefaultBranch } from "@/hooks/useBranch";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { format, startOfYear } from "date-fns";

const useSalesReportHttp = () => {
  const { filterObj } = useFilterQuery();

  // get data by location
  const { data: dataByLocation, isFetching: isLoadingDataByLocation } =
    useCustomQuery(
      ["purchase-insights-location", filterObj],
      `/forecast-console/cpu-sales-insights/by-branch?from=${format(
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
    `/forecast-console/cpu-sales-insights/by-item?from=${format(
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

  // get data by category
  const { data: dataByCategory, isFetching: isLoadingDataByCategory } =
    useCustomQuery(
      ["purchase-insights-category", filterObj],
      `/forecast-console/cpu-sales-insights/by-category?from=${format(
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
      `/forecast-console/cpu-sales-insights/total?from=${format(
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
    isLoadingDataByLocation,
    dataByLocation,

    isLoadingDataByItem,
    dataByItem,

    isLoadingDataByCategory,
    dataByCategory,

    isLoadingDataByTotal,
    dataByTotal,
  };
};

export default useSalesReportHttp;
