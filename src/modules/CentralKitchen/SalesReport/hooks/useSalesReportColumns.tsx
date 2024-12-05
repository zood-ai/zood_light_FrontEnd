import { ColumnDef } from "@tanstack/react-table";

const useSalesReportColumns = () => {
  const LocationColumns: ColumnDef<any>[] = [
    {
      accessorKey: "branch_name",
      header: () => <div>Branch</div>,
      cell: ({ row }) => <div className="">{row.getValue("branch_name")}</div>,
    },
    {
      accessorKey: "ordered",
      header: () => <div>Ordered</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("ordered")}</div>;
      },
    },
    {
      accessorKey: "delivered",
      header: () => <div>Delivered</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("delivered")}</div>;
      },
    },
  ];

  const ItemColumns: ColumnDef<any>[] = [
    {
      accessorKey: "item_name",
      header: () => <div>Item</div>,
      cell: ({ row }) => <div className="">{row.getValue("item_name")}</div>,
    },
    {
      accessorKey: "supplier_name",
      header: () => <div>Supplier</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("supplier_name")}</div>;
      },
    },
    {
      accessorKey: "quantity",
      header: () => <div>Quantity</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("quantity")}</div>;
      },
    },
    {
      accessorKey: "ordered",
      header: () => <div>Value</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("ordered")}</div>;
      },
    },
    {
      accessorKey: "delivered_percentage",
      header: () => <div>% Total spend</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("delivered_percentage")}</div>;
      },
    },
  ];

  const CategoryColumns: ColumnDef<any>[] = [
    {
      accessorKey: "category_name",
      header: () => <div>Category</div>,
      cell: ({ row }) => (
        <div className="">{row.getValue("category_name") || "No Category"}</div>
      ),
    },
    {
      accessorKey: "ordered",
      header: () => <div>Ordered</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("ordered")}</div>;
      },
    },
    {
      accessorKey: "delivered",
      header: () => <div>Delivered</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("delivered")}</div>;
      },
    },

    {
      accessorKey: "delivered_percentage",
      header: () => <div>% Total spend</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("delivered_percentage")}</div>;
      },
    },
  ];

  return {
    LocationColumns,
    ItemColumns,
    CategoryColumns,
  };
};

export default useSalesReportColumns;
