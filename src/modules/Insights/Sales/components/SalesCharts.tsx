"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import ArrowFillIcon from "@/assets/icons/ArrowFill";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  desktop: {
    label: "Sales",
    color: "var(--secondary-foreground)",
  },
  mobile: {
    label: "Forecast",
    color: "var(--chart)",
  },
} satisfies ChartConfig;

interface ISalesCharts {
  salesChartData: {
    total_sales_data: {
      label: string;
      value: number;
      quantity: number;
      percentage: number;
    }[];
    product_data: {
      label: string;
      quantity: number;
      value: number;
      percentage: number;
    }[];
    business_date_data: {
      label: string;
      value: number;
      quantity: number;
      percentage: number;
    }[];
  };
  isFetchingSalesInsight: boolean;
}
export default function SalesCharts({
  salesChartData,
  isFetchingSalesInsight,
}: ISalesCharts) {
  const [tab, setTab] = useState<number>(1);

  const [searchParams] = useSearchParams();
  const fromDate = format(
    searchParams.get("from") ?? startOfWeek(new Date()),
    " dd"
  );
  const toDate = format(
    searchParams.get("to") ?? endOfWeek(new Date()),
    "dd MMM"
  );

  const columns = [
    {
      accessorKey: "label",
      header: () => <div>Sales</div>,
      cell: ({ row }: any) => (
        <div className="w-[100px]">{row.getValue("label")}</div>
      ),
    },
    {
      accessorKey: "value",
      header: () => (
        <>
          <div className="relative before:content-[' '] before:h-[6px] before:w-[6px] before:bg-secondary-foreground  before:inline-block before:rounded-full">
            {" "}
            Actual
          </div>
        </>
      ),
      cell: ({ row }: any) => {
        return (
          <>
            <div className="flex items-center gap-[4px]">
              <div>{row.getValue("value")}</div>

              <ArrowFillIcon color="#04D182" className="rotate-180" />
              <span className="text-[#04D182] font-bold">
                {row.getValue("value") ? 100 : 0} %
              </span>
            </div>{" "}
          </>
        );
      },
    },
    {
      accessorKey: "forecast",
      header: () => (
        <>
          <div className="relative before:content-[' '] before:h-[6px] before:w-[6px] before:bg-chart  before:inline-block before:rounded-full">
            {" "}
            Forcast
          </div>
        </>
      ),
      cell: ({ row }: any) => {
        return <div>{row.getValue("forecast") || 0}</div>;
      },
    },
  ];

  const columnsProduct = [
    {
      accessorKey: "label",
      header: () => <div>Product name</div>,
      cell: ({ row }: any) => (
        <div className="w-[100px]">{row.getValue("label")}</div>
      ),
    },
    {
      accessorKey: "quantity",
      header: () => <>Qty Sold</>,
      cell: ({ row }: any) => (
        <div className="">{row.getValue("quantity")}</div>
      ),
    },
    {
      accessorKey: "value",
      header: () => <>Value</>,
      cell: ({ row }: any) => <div className="">{row.getValue("value")}</div>,
    },
    {
      accessorKey: "percentage",
      header: () => <>% of sales</>,
      cell: ({ row }: any) => (
        <div className="">{row.getValue("percentage")}</div>
      ),
    },
  ];

  const columnsOrder = [
    {
      accessorKey: "label",
      header: () => <div>Order</div>,
      cell: ({ row }: any) => (
        <div className="w-[100px]">{row.getValue("label")}</div>
      ),
    },
    {
      accessorKey: "quantity",
      header: () => (
        <>
          <div className="relative before:content-[' '] before:h-[6px] before:w-[6px] before:bg-secondary-foreground  before:inline-block before:rounded-full">
            {" "}
            Actual
          </div>
        </>
      ),
      cell: ({ row }: any) => {
        return (
          <>
            <div className="flex items-center gap-[4px]">
              <div>{row.getValue("quantity")}</div>

              {/* <ArrowFillIcon color="#04D182" className="rotate-180" />
              <span className="text-[#04D182] font-bold">0.7%</span> */}
            </div>{" "}
          </>
        );
      },
    },
    {
      accessorKey: "forecast",
      header: () => (
        <>
          <div className="relative before:content-[' '] before:h-[6px] before:w-[6px] before:bg-chart  before:inline-block before:rounded-full">
            {" "}
            Forcast
          </div>
        </>
      ),
      cell: ({ row }: any) => {
        return <div>{row.getValue("forecast") || 0}</div>;
      },
    },
  ];
  console.log(salesChartData?.business_date_data);

  const chartData =
    tab === 1
      ? salesChartData?.business_date_data.map((item) => ({
          month: format(item.label, "EEE"),
          desktop: item.value,
          mobile: 0,
        }))
      : salesChartData?.business_date_data.map((item) => ({
          month: format(item.label, "EEE"),
          desktop: item.quantity,
          mobile: 0,
        }));

  return (
    <div className="border p-[16px] rounded-[4px] h-[500px] ">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex w-full items-center gap-2 font-bold">
          <p className="text-[20px] ">
            Sales v Forecast {fromDate}-{toDate}{" "}
          </p>
          {/* <span className="text-primary text-[14px]">Show month</span> */}
        </div>

        <div className=" flex gap-[32px] border-b-2 w-[200px] justify-self-end mb-[35px]">
          <p
            className={`text-[14px] pb-3  cursor-pointer ${
              tab === 1
                ? "border-b-2 border-primary font-bold text-primary "
                : ""
            }`}
            onClick={() => {
              setTab(1);
            }}
          >
            Sales
          </p>
          <p
            className={`text-[14px] pb-3  cursor-pointer ${
              tab === 2
                ? "border-b-2 border-primary font-bold text-primary "
                : ""
            }`}
            onClick={() => {
              setTab(2);
            }}
          >
            Orders
          </p>
          <p
            className={`text-[14px] pb-3  cursor-pointer ${
              tab === 3
                ? "border-b-2 border-primary font-bold text-primary "
                : ""
            }`}
            onClick={() => {
              setTab(3);
            }}
          >
            Products
          </p>
        </div>
      </div>
      <div className=" flex justify-between">
        <div>
          {" "}
          {isFetchingSalesInsight ? (
            <>
              {Array.from({ length: 1 }).map((_, index) => (
                <Skeleton className="w-[550px] h-[300px] mt-8" key={index} />
              ))}
            </>
          ) : (
            <ChartContainer config={chartConfig} className="min-h-[50vh]">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={2}
                  tickCount={7}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="desktop"
                  fill="var(--color-desktop)"
                  radius={4}
                  barSize={30}
                />
                <Bar
                  dataKey="mobile"
                  fill="var(--color-mobile)"
                  radius={4}
                  barSize={30}
                />
              </BarChart>
            </ChartContainer>
          )}
        </div>

        <div className="w-[50%]">
          {tab === 1 && (
            <CustomTable
              columns={columns}
              loading={isFetchingSalesInsight}
              data={salesChartData?.total_sales_data || []}
              pagination={false}
              className="h-[350px]"
            />
          )}
          {tab === 2 && (
            <CustomTable
              columns={columnsOrder}
              loading={isFetchingSalesInsight}
              data={salesChartData?.total_sales_data || []}
              pagination={false}
              className="h-[350px]"
            />
          )}
          {tab === 3 && (
            <CustomTable
              columns={columnsProduct}
              loading={isFetchingSalesInsight}
              data={salesChartData?.product_data || []}
              pagination={false}
              className="h-[350px]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
