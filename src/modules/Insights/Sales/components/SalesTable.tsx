import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { ColumnDef } from "@tanstack/react-table";
import { ISalesList } from "../types/types";

const SalesTables = ({
  data,
  isFetchingSalesInsight,
}: {
  data: ISalesList[];
  isFetchingSalesInsight: boolean;
}) => {
  const columns: ColumnDef<ISalesList>[] = [
    {
      accessorKey: "branch",
      header: () => <div>Branch</div>,
      cell: ({ row }) => (
        <div className="w-[100px]">{row.getValue("branch")}</div>
      ),
    },
    {
      accessorKey: "sales",
      header: () => <div>Sales</div>,
      cell: ({ row }) => {
        return (
          <>
            <div className="flex items-center gap-[4px]">
              <div>{row.getValue("sales")}</div>

              {/* <ArrowFillIcon color="var(--warn)" />
              <span className="font-bold text-warn">0.7%</span> */}
            </div>{" "}
          </>
        );
      },
    },
    {
      accessorKey: "forecast",
      header: () => <div>Forecast</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("forecast")}</div>;
      },
    },
    {
      accessorKey: "dinein",
      header: () => <div>Dine in</div>,
      cell: ({ row }) => {
        return (
          <>
            <div className="flex items-center gap-[4px]">
              <div>{row.getValue("dinein")}</div>

              {/* <ArrowFillIcon color="var(--warn)" />
              <span className="font-bold text-warn">0.7%</span> */}
            </div>{" "}
          </>
        );
      },
    },
    {
      accessorKey: "delivery",
      header: () => <div>Delivary</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("delivery")}</div>;
      },
    },
    {
      accessorKey: "pickup",
      header: () => <div>Pick up</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("pickup")}</div>;
      },
    },
    {
      accessorKey: "orders",
      header: () => <div>Orders</div>,
      cell: ({ row }) => {
        return (
          <>
            <div className="flex items-center gap-[4px]">
              <div>{row.getValue("orders")}</div>

              {/* <ArrowFillIcon color="var(--warn)" />
              <span className="font-bold text-warn">0.7%</span> */}
            </div>{" "}
          </>
        );
      },
    },
    {
      accessorKey: "average_cheque_hours",
      header: () => <div>Average cheque size</div>,
      cell: ({ row }) => {
        return (
          <>
            <div className="flex items-center gap-[4px]">
              <div>{row.getValue("average_cheque_hours")}</div>

              {/* <ArrowFillIcon color="var(--warn)" />
              <span className="font-bold text-warn">0.7%</span> */}
            </div>{" "}
          </>
        );
      },
    },
    {
      accessorKey: "dwell_time",
      header: () => <div>Dwell time</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("dwell_time")}</div>;
      },
    },
    {
      accessorKey: "delivery_app",
      header: () => <div>Delivery app</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("delivery_app")}</div>;
      },
    },
    {
      accessorKey: "drive_thru",
      header: () => <div>Drive thru</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("drive_thru")}</div>;
      },
    },
  ];

  return (
    <>
      <HeaderTable />
      <CustomTable
        columns={columns}
        data={data || []}
        pagination={false}
        loading={isFetchingSalesInsight}
      />
    </>
  );
};

export default SalesTables;
