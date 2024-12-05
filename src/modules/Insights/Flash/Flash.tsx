import LocationIcon from "@/assets/icons/Location";
import FilterOptions from "@/components/FilterOption";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import Badge from "./components/Badge";
import IncreaseIcon from "@/assets/icons/Increase";
import Card from "./components/Card";
import useFilterQuery from "@/hooks/useFilterQuery";
import { ColumnDef } from "@tanstack/react-table";
import InventoryCards from "../Inventory/components/InventoryCards";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import FlashCard from "./components/CardAll";
import useFlashHttp from "./queriesHttp/useFlashHttp";
import moment from "moment";

const Flash = () => {
  const { filterObj } = useFilterQuery();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "branch",
      header: () => <div>Branch</div>,
      cell: ({ row }) => (
        <div className="w-[100px]">{row.getValue("branch")}</div>
      ),
    },
    {
      accessorKey: "total_sales",
      header: () => <div> Sales</div>,
      cell: ({ row }) => {
        console.log(row);

        return (
          <>
            <div className="flex items-center gap-[4px]">
              SAR {row?.original?.total_sales}
            </div>{" "}
          </>
        );
      },
    },
    {
      accessorKey: "actual_gp",
      header: () => <div>Co GS</div>,
      cell: ({ row }) => {
        return <div className=""> SAR {row?.original?.actual_gp}</div>;
      },
    },
    {
      accessorKey: "labour",
      header: () => <div>Employee</div>,
      cell: ({ row }) => {
        return (
          <>
            <div className="flex items-center gap-[4px]">
              <div>SAR {row?.original?.labour}</div>
            </div>{" "}
          </>
        );
      },
    },
    {
      accessorKey: "profit",
      header: () => <div>Flash profit</div>,
      cell: ({ row }) => {
        return <div className="">SAR {row?.original?.profit}</div>;
      },
    },
  ];

  const { FlashsData, isFetchingFlashs } = useFlashHttp();
  return (
    <div>
      <HeaderPage
        title={
          <div>
            Flash P&L{" "}
            <span className="text-[#748FAA] text-[14px] ml-[14px] font-[500]">
              Updated at end of day{" "}
              {moment(filterObj?.to).format("DD MMM YYYY")}
            </span>
          </div>
        }
      >
        <FilterOptions
          filters={[
            { label: "Best", group_by: "desc" },
            { label: "Worst", group_by: "asc" },
            { label: "All", group_by: "All" },
          ]}
        />
      </HeaderPage>
      {/* sub header */}

      {filterObj?.group_by == "All" ? (
        <>
          <FlashCard />
          <HeaderTable
            placeHolder="Search branch ..."
            // children={
            //   <FilterOptions
            //     filters={[
            //       { label: "P&L SAR", group_by: "P&L SAR" },
            //       { label: "P&L %", group_by: "P&L %" },
            //     ]}
            //   />
            // }
          />
          <CustomTable
            columns={columns}
            data={FlashsData?.data}
            loading={isFetchingFlashs}
            pagination={false}
          />
        </>
      ) : (
        <>
          <Badge
            items={[
              {
                name: "Location",
                value:
                  FlashsData?.data && Object.keys(FlashsData?.data)?.length,
              },
              { name: "Profit over target", value: 0 },
              {
                name: "Sales 10%+ above forecast",
                value: 0,
              },
              { name: "CoGS below average", value: 0 },
              { name: "Under planned labour", value: 0 },
            ]}
          />
          {/* Columns */}
          <div
            className={`flex gap-[16px] ${
              FlashsData?.data && Object.entries(FlashsData?.data)?.length
                ? ""
                : "justify-center items-center"
            } `}
          >
            <Card items={FlashsData?.data} loading={isFetchingFlashs} />
          </div>
        </>
      )}
    </div>
  );
};

export default Flash;
