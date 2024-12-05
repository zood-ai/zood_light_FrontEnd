import React, { useState } from "react";
import InventoryCards from "./components/InventoryCards";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { IInventory } from "./types/types";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import useInventoryInsightHttp from "./queriesHttp/useInventoryHttp";
import useFilterQuery from "@/hooks/useFilterQuery";
import InventoryAccountedUnaccounted from "./components/InventoryAccountedUnaccounted";
import { useSearchParams } from "react-router-dom";
import InventoryWasteLog from "./components/InventoryWasteLog";
import CustomTooltip from "@/components/ui/custom/CustomTooltip";
import TooltipIconColor from "@/assets/icons/TooltipColor";
import WarningIcon from "@/assets/icons/Warning";
import CustomAlert from "@/components/ui/custom/CustomAlert";

const InventorySales = () => {
  const { InventoryInsightsDataBranch, isFetchingInventoryInsightBranch } =
    useInventoryInsightHttp();
  const columns: ColumnDef<IInventory>[] = [
    {
      accessorKey: "branch",
      header: () => <div>Branch</div>,
      cell: ({ row }) => (
        <div className="w-[100px] flex items-center gap-2">
          {row.original.has_count == false ? (
            <>
              <CustomTooltip
                tooltipContent={`${row.original.branch} does not have count in this period`}
                tooltipIcon={<TooltipIconColor />}
              />{" "}
            </>
          ) : (
            <div className="w-5"> </div>
          )}
          {row.original.branch}
        </div>
      ),
    },
    {
      accessorKey: "total_sales",
      header: () => <div>Sales</div>,
      cell: ({ row }) => {
        return (
          <>
            <div className="flex items-center gap-[4px]">
              <div>{row.getValue("total_sales")}</div>
            </div>{" "}
          </>
        );
      },
    },
    {
      accessorKey: "target_gp",
      header: () => <div>Target GP %</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("target_gp")}</div>;
      },
    },
    {
      accessorKey: "actual_gp",
      header: () => <div>Actual GP %</div>,
      cell: ({ row }) => {
        return (
          <>
            <div className="flex items-center gap-[4px]">
              <div>{row.getValue("actual_gp")}</div>
            </div>{" "}
          </>
        );
      },
    },
    {
      accessorKey: "waste",
      header: () => <div>Waste</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("waste")}</div>;
      },
    },
    {
      accessorKey: "accounted_waste",
      header: () => <div>Accounted waste</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("accounted_waste")}</div>;
      },
    },

    {
      accessorKey: "unaccounted_waste",
      header: () => <div>Unaccounted Waste</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("unaccounted_waste")}</div>;
      },
    },
  ];

  const { filterObj } = useFilterQuery();
  const [, setSearchParams] = useSearchParams();
  const length = InventoryInsightsDataBranch?.data?.filter(
    (branch: any) => branch?.has_count == false
  )?.lenght;

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[24px] font-bold ">Inventory insights</p>

      {!filterObj?.["filter[branch]"] && (
        <CustomAlert
          bgColor="bg-[#FFF8F3]"
          colorIcon="var(--info)"
          content={`${
            InventoryInsightsDataBranch?.data
              ? InventoryInsightsDataBranch?.data?.filter(
                  (branch: any) => branch?.has_count == false
                )?.length
              : 0
          } branch did not count stock in the selected period, GP and Variance data below only shows the locations that counted`}
        />
      )}

      <InventoryCards />
      {filterObj?.["filter[branch]"] ? (
        <>
          <InventoryAccountedUnaccounted />
          <InventoryWasteLog />
        </>
      ) : (
        <>
          <HeaderTable placeHolder="Search branch ..." />
          <CustomTable
            loading={isFetchingInventoryInsightBranch}
            columns={columns}
            data={InventoryInsightsDataBranch?.data || []}
            onRowClick={(row) => {
              setSearchParams({
                ...filterObj,
                "filter[branch]": row?.branch_id,
              });
            }}
            pagination={false}
          />
        </>
      )}
    </div>
  );
};

export default InventorySales;
