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
import moment from "moment";
import useFilterQuery from "@/hooks/useFilterQuery";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  waste: {
    label: "waste",
    color: "var(--secondary-foreground)",
  },
  sales: {
    label: "sales",
    color: "var(--chart)",
  },
} satisfies ChartConfig;

const columns = [
  {
    accessorKey: "name",
    header: (row: any) => {
      return (
        <div className="text-[20px]">
          <div>{row.table.getRowCount()} Item</div>
        </div>
      );
    },
    cell: ({ row }: any) => (
      <div className="w-[100px]">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "quantity ",
    header: () => (
      <>
        <div> Quantity</div>
      </>
    ),
    cell: ({ row }: any) => {
      return (
        <>
          <div className="flex items-center gap-[4px] ">
            <div className="flex gap-[5px]">
              <span className="px-5">{row.original?.quantity?.toFixed(3)}</span>
            </div>
          </div>{" "}
        </>
      );
    },
  },
  {
    accessorKey: "value",
    header: () => (
      <>
        <div> Value</div>
      </>
    ),
    cell: ({ row }: any) => {
      return (
        <div>
          <div className="flex gap-[5px]">
            <span className="px-5">
              SAR {row.original?.total_cost?.toFixed(3)}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: () => (
      <>
        <div> Reason</div>
      </>
    ),
    cell: ({ row }: any) => {
      return (
        <div>
          <div className="flex gap-[5px]">
            <span className="px-5"> {row.original?.reason}</span>
          </div>
        </div>
      );
    },
  },
];

const InventoryWasteLog = () => {
  const {
    InventoryInsightsDataChart,
    isFetchingInventoryInsightChart,
    InventoryInsightsDataDate,
    isFetchingInventoryInsightDate,
  } = useInventoryInsightHttp();
  const { filterObj } = useFilterQuery();
  const chartData = InventoryInsightsDataDate?.data?.map((item) => ({
    month: item?.label,
    waste: item?.wast_value_total_cost,
    sales: item?.order_value_total_cost,
  }));

  return (
    <div className="flex w-full gap-[14px]">
      <div className="border p-[16px] rounded-[4px] h-[455px] w-[50%]">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex w-full items-center gap-2 font-bold">
            <p className="text-[20px] ">
              Waste logged v Sales ( {moment(filterObj?.from)?.format("LL")} -{" "}
              {moment(filterObj?.to)?.format("LL")})
            </p>
          </div>
        </div>
        <div className="flex jutify-between">
          <div>
            <div className=" flex justify-between items-center">
              {isFetchingInventoryInsightDate ? (
                <>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      className="w-[200px] h-[300px] mt-8"
                      key={index}
                    />
                  ))}
                </>
              ) : (
                <div>
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[50vh] "
                  >
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
                        dataKey="waste"
                        fill="var(--color-waste)"
                        barSize={30}
                      />
                      <Bar
                        dataKey="sales"
                        fill="var(--color-sales)"
                        barSize={30}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="border p-[16px] rounded-[4px] h-full w-[50%]">
        <div>
          <CustomTable
            loading={isFetchingInventoryInsightChart}
            columns={columns}
            data={InventoryInsightsDataChart?.itemWaste || []}
            pagination={false}
            className="h-[420px]"
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryWasteLog;
