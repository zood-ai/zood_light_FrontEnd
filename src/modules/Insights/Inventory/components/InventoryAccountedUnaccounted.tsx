import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import useInventoryInsightHttp from "../queriesHttp/useInventoryHttp";
import useFilterQuery from "@/hooks/useFilterQuery";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";

type IData = {
  waste: string;
  accounted_waste: number;
  accounted_waste_percentage: number;
  unaccounted_waste: number;
  unaccounted_waste_percentage: number;
};
const chartConfig = {
  Accounted: {
    label: "Accounted",
    color: "var(--secondary-foreground)",
  },
  Unaccounted: {
    label: "Unaccounted",
    color: "var(--chart)",
  },
} satisfies ChartConfig;

export default function InventoryAccountedUnaccounted() {
  const { InventoryInsightsDataChart, isFetchingInventoryInsightChart } =
    useInventoryInsightHttp();
  const { filterObj } = useFilterQuery();
  const columns = [
    {
      accessorKey: "waste",
      header: () => <div>Waste</div>,
      cell: ({ row }: any) => (
        <div className="w-[100px]">{row.original.waste}</div>
      ),
    },
    {
      accessorKey: "accounted_waste",
      header: () => (
        <>
          <div> Accounted</div>
        </>
      ),
      cell: ({ row }: any) => {
        return (
          <>
            <div className="flex items-center gap-[4px] ">
              <div className="flex gap-[5px]">
                <span className="px-5">SAR {row.original.accounted_waste}</span>
                <span> {row.original.accounted_waste_percentage} %</span>
              </div>
            </div>{" "}
          </>
        );
      },
    },
    {
      accessorKey: "unaccounted_waste",
      header: () => (
        <>
          <div> Unaccounted</div>
        </>
      ),
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-[4px] ">
            <div className="flex gap-[5px]">
              <span className="px-5">SAR {row.original.unaccounted_waste}</span>
              <span> {row.original.unaccounted_waste_percentage ?? 0} %</span>
            </div>
          </div>
        );
      },
    },
  ];
  const chartData = [
    {
      month: "Food",
      Accounted:
        InventoryInsightsDataChart?.data?.waste?.Food?.accounted?.total_sales,
      Unaccounted:
        InventoryInsightsDataChart?.data?.waste?.Food?.unaccounted?.total_sales,
    },
    {
      month: "Beverage",
      Accounted:
        InventoryInsightsDataChart?.data?.waste?.Beverage?.accounted
          ?.total_sales,
      Unaccounted:
        InventoryInsightsDataChart?.data?.waste?.Beverage?.unaccounted
          ?.total_sales,
    },
    {
      month: "Miscellaneous",
      Accounted:
        InventoryInsightsDataChart?.data?.waste?.Misc?.accounted?.total_sales,
      Unaccounted:
        InventoryInsightsDataChart?.data?.waste?.Misc?.unaccounted?.total_sales,
    },
  ];

  const data: IData[] = [
    {
      waste: "Food",
      accounted_waste:
        InventoryInsightsDataChart?.data?.waste?.Food?.accounted?.total_sales ||
        0,
      accounted_waste_percentage:
        InventoryInsightsDataChart?.data?.waste?.Food?.accounted
          ?.total_sales_percentage ?? 0,
      unaccounted_waste:
        InventoryInsightsDataChart?.data?.waste?.Food?.unaccounted
          ?.total_sales ?? 0,
      unaccounted_waste_percentage:
        InventoryInsightsDataChart?.data?.waste?.Food?.unaccounted
          ?.total_sales_percentage ?? 0,
    },
    {
      waste: "Beverage",
      accounted_waste:
        InventoryInsightsDataChart?.data?.waste?.Beverage?.accounted
          ?.total_sales ?? 0,
      accounted_waste_percentage:
        InventoryInsightsDataChart?.data?.waste?.Beverage?.accounted
          ?.total_sales_percentage ?? 0,
      unaccounted_waste:
        InventoryInsightsDataChart?.data?.waste?.Beverage?.unaccounted
          ?.total_sales ?? 0,
      unaccounted_waste_percentage:
        InventoryInsightsDataChart?.data?.waste?.Beverage?.unaccounted
          ?.total_sales_percentage ?? 0,
    },
    {
      waste: "Misc",
      accounted_waste:
        InventoryInsightsDataChart?.data?.waste?.Misc?.accounted?.total_sales ??
        0,
      accounted_waste_percentage:
        InventoryInsightsDataChart?.data?.waste?.Misc?.accounted
          ?.total_sales_percentage,
      unaccounted_waste:
        InventoryInsightsDataChart?.data?.waste?.Misc?.unaccounted?.total_sales,
      unaccounted_waste_percentage:
        InventoryInsightsDataChart?.data?.waste?.Misc?.unaccounted
          ?.total_sales_percentage ?? 0,
    },
  ];

  return (
    <div className="border  w-full gap-[14px] my-[16px] pb-8">
      <div className=" p-[16px] rounded-[4px] ">
        <div className="flex w-full items-center gap-2 font-bold">
          <p className="text-[20px] ">
            Accounted v Unaccounted ( {moment(filterObj?.from)?.format("LL")} -{" "}
            {moment(filterObj?.to)?.format("LL")}){" "}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="flex jutify-between items w-[60%]">
          {isFetchingInventoryInsightChart ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton className="w-[200px] h-[300px] mt-8" key={index} />
              ))}
            </>
          ) : (
            <div>
              <ChartContainer config={chartConfig} className="min-h-[50vh]  ">
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value}
                  />

                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="Accounted"
                    fill="var(--color-Accounted)"
                    barSize={30}
                  />
                  <Bar
                    dataKey="Unaccounted"
                    fill="var(--color-Unaccounted)"
                    barSize={30}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          )}
        </div>

        <div className="rounded-[4px] h-full w-[40%]">
          <div>
            <CustomTable
              loading={isFetchingInventoryInsightChart}
              columns={columns}
              data={data || []}
              pagination={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
