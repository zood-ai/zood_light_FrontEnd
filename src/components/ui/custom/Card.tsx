import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "../skeleton";
import CustomTooltip from "./CustomTooltip";

interface Props {
  chartColor?: string;
  showChart?: boolean;
  showBorder?: boolean;
  className?: string;
  textColor?: string;
  isLoading?: boolean;
  tooltipContent?: string;
  data?: {
    totalData: {
      headerText: string;
      mainValue: string;
      subValue?: string;
    };
    details?: { title: string; total: string; subTotal?: string }[];
  };
  chartData?: {
    month: string;
    total_cost: number;
  }[];
}
const Card = ({
  chartColor = "#8D5EB2",
  showChart,
  showBorder,
  className,
  chartData,
  textColor,
  tooltipContent,
  isLoading,
  data,
}: Props) => {
  const chartConfig = {
    total_cost: {
      label: "Total sales",
      color: chartColor,
    },
  } satisfies ChartConfig;
  return (
    <div className={`${className} border p-5 w-[400px] mt-3 rounded-[4px]`}>
      <div
        className={`flex justify-between ${
          showBorder ? "border-b border-b-[#F0F2F2]" : ""
        }  pb-3`}
      >
        <div>
          <div className="flex gap-2 items-center">
            <h1 className="text-[24px] font-bold text-[#1A3353] w-full">
              {isLoading ? (
                <Skeleton className="w-[120px] h-[20px] mb-2" />
              ) : (
                data?.totalData?.mainValue
              )}
            </h1>
            <p className="text-gray text-[16px]">{data?.totalData?.subValue}</p>
          </div>
          <p className="text-textPrimary flex items-center gap-2">
            {data?.totalData?.headerText}
            {tooltipContent && (
              <CustomTooltip tooltipContent={tooltipContent} />
            )}
          </p>
        </div>
        {showChart && (
          <ChartContainer config={chartConfig} className="w-[250px] h-[60px]">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="total_cost"
                type="natural"
                fill="var(--color-total_cost)"
                fillOpacity={0.4}
                stroke="var(--color-total_cost)"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 0)}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </div>
      <div
        className={`flex ${showBorder ? "gap-[40px]" : "justify-between"} pt-3`}
      >
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton className="w-[80px] h-[20px] mb-2" key={index} />
            ))}
          </>
        ) : (
          <>
            {data?.details?.map((item, index) => (
              <div className="text-textPrimary" key={index}>
                <h1 className={`font-semibold text-[16px] w-max ${textColor}`}>
                  {item.total}
                  <span className="font-thin text-gray text-[14px] px-2">
                    {item?.subTotal}
                  </span>
                </h1>
                <p className={`${textColor}`}>{item.title}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
