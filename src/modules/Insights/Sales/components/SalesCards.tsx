import Card from "@/components/ui/custom/Card";
import { format } from "date-fns";

interface ISalesCards {
  salesCardData: {
    total_sales: number;
    total_dwell_time: number;
    dwell_data_data: { label: string; value: string }[];
    total_sales_data: {
      label: string;
      percentage: number;
    }[];
    totalAverage: number;
    business_date_data: { label: string; value: string }[];
    business_date_average_data: { label: string; value: string }[];
    average_sales_data: {
      label: string;
      percentage: number;
      value: number;
    }[];
  };
  isFetchingSalesInsight: boolean;
}

const SalesCards = ({ salesCardData, isFetchingSalesInsight }: ISalesCards) => {
  return (
    <div className="flex gap-[16px] overflow-x-auto">
      <Card
        className="w-[520px]"
        showChart
        chartColor="#8D5EB2"
        isLoading={isFetchingSalesInsight}
        data={{
          totalData: {
            headerText: "Sales to date",
            mainValue: `SAR ${salesCardData?.total_sales?.toFixed(3)}`,
          },
          details: salesCardData?.total_sales_data
            ?.map((item) => ({
              title: item.label,
              total: `${item.percentage}%`,
            }))
            .slice(1),
        }}
        chartData={
          salesCardData?.business_date_data &&
          salesCardData?.business_date_data?.map((a: any) => ({
            month: format(a.label, "EEEE"),
            total_cost: a.value,
          }))
        }
      />
      <Card
        className="w-[520px]"
        showChart
        chartColor="#EBBB74"
        isLoading={isFetchingSalesInsight}
        data={{
          totalData: {
            headerText: "Avg cheque sie",
            mainValue: `SAR ${salesCardData?.totalAverage?.toFixed(3)}`,
          },
          details: salesCardData?.average_sales_data
            ?.map((item) => ({
              title: item.label,
              total: `${item.value} SAR`,
            }))
            .slice(1),
        }}
        chartData={
          salesCardData?.business_date_average_data &&
          salesCardData?.business_date_average_data?.map((a: any) => ({
            month: format(a.label, "EEEE"),
            total_cost: a.value,
          }))
        }
      />
      <Card
        showChart
        isLoading={isFetchingSalesInsight}
        chartColor="#EB7487"
        data={{
          totalData: {
            headerText: "Dwell time",
            // mainValue: ` ${salesCardData?.total_dwell_time} hrs`,
            mainValue: `- hrs`,
          },
        }}
        chartData={
          salesCardData?.dwell_data_data &&
          salesCardData?.dwell_data_data?.map((a: any) => ({
            month: format(a.label, "EEEE"),
            total_cost: a.value,
          }))
        }
      />
    </div>
  );
};

export default SalesCards;
