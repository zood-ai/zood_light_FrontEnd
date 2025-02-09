import useFilterQuery from "@/hooks/useFilterQuery";
import SalesCards from "./components/SalesCards";
import SalesCharts from "./components/SalesCharts";
import SalesTables from "./components/SalesTable";
import useSalesInsightHttp from "./queriesHttp/useSalesHttp";

const Sales = () => {
  const { SalesInsightsData, isFetchingSalesInsight } = useSalesInsightHttp();

  const { filterObj } = useFilterQuery();

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[24px] font-bold ">Sales insights</p>
      <SalesCards
        salesCardData={SalesInsightsData?.data}
        isFetchingSalesInsight={isFetchingSalesInsight}
      />
      <SalesCharts
        salesChartData={SalesInsightsData?.data}
        isFetchingSalesInsight={isFetchingSalesInsight}
      />
      {!filterObj["filter[branch]"] && (
        <SalesTables
          data={SalesInsightsData?.data?.branches}
          isFetchingSalesInsight={isFetchingSalesInsight}
          
        />
      )}
    </div>
  );
};

export default Sales;
