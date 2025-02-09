import FilterOptions from "@/components/FilterOption";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import useFilterQuery from "@/hooks/useFilterQuery";
import LabourCard from "./components/LabourCard";
import useLabourHttp from "./queriesHttp/useLabourHttp";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { format } from "date-fns";

const Labour = () => {
  const { filterObj } = useFilterQuery();
  const { LabourInsightsData, isFetchingLabourInsights } = useLabourHttp();

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: "branch_name",
        header: () => <div>Location</div>,
        cell: ({ row }: any) => <>{row.getValue("branch_name")}</>,
      },
      {
        accessorKey: `actual_sales`,
        header: () => (
          <div>
            Actual sales ({format(filterObj?.from, "dd MMM")} -{" "}
            {format(filterObj?.to, "dd MMM")})
          </div>
        ),
        cell: ({ row }: any) => {
          return (
            <div className="flex gap-4">
              <span>SAR {row.getValue("actual_sales")} </span>
              SAR {row.original.actual_sales_forecasted}
            </div>
          );
        },
      },
      {
        accessorKey: "actual_col_percentage",
        header: () => (
          <div>
            Actual COL {filterObj.group_by} ({format(filterObj?.from, "dd MMM")}{" "}
            - {format(filterObj?.to, "dd MMM")})
          </div>
        ),
        cell: ({ row }: any) => (
          <div className="flex gap-4">
            <span>
              {filterObj.group_by}{" "}
              {filterObj.group_by === "%"
                ? row.getValue("actual_col_percentage")
                : row.original.actual_col}{" "}
            </span>
            {filterObj.group_by}
            {filterObj.group_by === "%"
              ? row.original.forecasted_actual_col_percentage
              : row.original.actual_col_forecasted}{" "}
          </div>
        ),
      },
      {
        accessorKey: "projected_sales",
        header: () => (
          <div>
            Projected sales ({format(filterObj?.from, "dd MMM")} -{" "}
            {format(filterObj?.to, "dd MMM")})
          </div>
        ),
        cell: ({ row }: any) => {
          return (
            <div className="flex gap-4">
              <span>SAR {row.getValue("projected_sales")} </span>SAR{" "}
              {row.original.projected_sales_forecasted}
            </div>
          );
        },
      },
      {
        accessorKey: "projected_col_percentage",
        header: () => (
          <div>
            Projected COL {filterObj.group_by} (
            {format(filterObj?.from, "dd MMM")} -{" "}
            {format(filterObj?.to, "dd MMM")})
          </div>
        ),
        cell: ({ row }: any) => {
          return (
            <div className="flex gap-4">
              <span>
                {filterObj.group_by}
                {filterObj.group_by === "%"
                  ? row.getValue("projected_col_percentage")
                  : row.original.projected_col}{" "}
              </span>
              {filterObj.group_by}
              {filterObj.group_by === "%"
                ? row.original.forecasted_projected_col_percentage
                : row.original.projected_col_forecasted}{" "}
            </div>
          );
        },
      },
    ],
    [filterObj.from, filterObj.to, filterObj.group_by]
  );

  return (
    <div>
      <HeaderPage title={<div>Labour insights </div>}>
        <FilterOptions
          filters={[
            { label: "%", group_by: "%" },
            { label: "SAR", group_by: "SAR" },
            // { label: "Hours", group_by: "h" },
          ]}
        />
      </HeaderPage>
      {/* sub header */}

      <div className="flex gap-[16px] mb-5 overflow-x-auto">
        <LabourCard
          isLoading={isFetchingLabourInsights}
          data={{
            headerText: "Forecast Sales",
            mainValue: `SAR ${LabourInsightsData?.cards?.actual_sales}`,
            text: "vs forecast",
          }}
        />
        <LabourCard
          isLoading={isFetchingLabourInsights}
          data={{
            headerText: "Planned COL",
            mainValue:
              filterObj.group_by === "%"
                ? `${LabourInsightsData?.cards?.actual_col_percentage} %`
                : `SAR ${LabourInsightsData?.cards?.actual_col_forecasted}`,
            text: "vs planned",
          }}
        />
        <LabourCard
          isLoading={isFetchingLabourInsights}
          data={{
            headerText: "Projected sales",
            mainValue: `SAR ${LabourInsightsData?.cards?.projected_sales}`,
            text: "vs forecast",
          }}
        />
        <LabourCard
          isLoading={isFetchingLabourInsights}
          data={{
            headerText: "Projected COL",
            mainValue:
              filterObj.group_by === "%"
                ? `${LabourInsightsData?.cards?.projected_col_percentage} %`
                : `SAR ${LabourInsightsData?.cards?.projected_col_forecasted}`,
            text: "vs planned",
          }}
        />
      </div>

      <HeaderTable />

      <CustomTable
        columns={columns}
        data={LabourInsightsData?.table || []}
        loading={isFetchingLabourInsights}
        pagination={false}
      />

      {/* <LabourCharts
        salesChartData={SalesInsightsData?.data}
        isFetchingSalesInsight={isFetchingLabourInsights}
      /> */}
    </div>
  );
};

export default Labour;
