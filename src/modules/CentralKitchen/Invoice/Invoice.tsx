import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import moment from "moment";

// UI components
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import useInvoiceHttp from "./queriesHttp/useInvoiceHttp";
import { formInvoiceSchema } from "./schema/schema";
import { IInvoice } from "./types/type";
import InvoiceForm from "./components/InvoiceForm";

import Avatar from "@/components/ui/avatar";

const Invoices = () => {
  const columns: ColumnDef<IInvoice>[] = [
    {
      id: "select",

      header: ({ table }: any) => (
        <Checkbox
          checked={rowsSelectedIds.length === invoiceData?.data?.length}
          onCheckedChange={(value) => {
            if (value) {
              setRowsSelectedIds(
                table.getRowModel().rows.map((row: any) => row.original.id)
              );
            } else {
              setRowsSelectedIds([]);
            }
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={rowsSelectedIds.includes(String(row.original.id))}
          disabled={row.original.status == 2 ? true : false}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onCheckedChange={(value: any) => {
            if (value) {
              setRowsSelectedIds((prev) => [...prev, row.original.id]);
            } else {
              setRowsSelectedIds((prev) =>
                prev.filter((id) => id !== row.original.id)
              );
            }
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
          className={`checkbox ${
            row.original.status == 2 || row.original.status == 1
              ? "bg-gray-200"
              : "bg-white"
          }`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "supplier_name",
      header: () => <div>Supplier</div>,
      cell: ({ row }) => {
        const name = row.getValue<string>("supplier_name");

        return (
          <div
            className="w-[300px] flex items-center gap-2"
            onMouseEnter={() => setHoveredRowIndex(row.index)}
            onMouseLeave={() => setHoveredRowIndex(null)}
          >
            {row.original.status == 0 && <Avatar text={name} />}
            {row.original.status == 1 && <Avatar text={name} type="Approved" />}
            {row.original.status == 2 && <Avatar text={name} type="Exported" />}
            <div className="flex flex-col">
              <div>{name}</div>
              {row.original.status == 2 && hoveredRowIndex === row.index && (
                <div className="text-warn text-xs">
                  This invoice has been exported before!
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "invoice_number",
      header: () => <div>Invoice Number</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("invoice_number")}</div>;
      },
    },
    {
      accessorKey: "credit_value",
      header: () => <div>Credit Value</div>,
      cell: ({ row }) => {
        return (
          <div className="">{`SAR ${row.getValue("credit_value")}` || "-"}</div>
        );
      },
    },
    {
      accessorKey: "business_date",
      header: () => <div>Recieved on</div>,
      cell: ({ row }) => (
        <>{moment(row.getValue("business_date")).format("LL") || "-"}</>
      ),
    },
    {
      accessorKey: "total",
      header: () => <div>Total (inc.tax)</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("total") || "-"}</div>;
      },
    },
  ];
  const [rowsSelectedIds, setRowsSelectedIds] = useState<string[]>([]);
  const [rowData, setRowData] = useState<string>("");
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isEditItem, setIsEditItem] = useState(false);
  const [modalName, setModalName] = useState("");

  const handleCloseSheet = () => {
    setIsOpen(false);
    setModalName("");
    setRowData("");
  };

  const defaultValues = {
    invoice_number: "",
    supplier_name: "",
    business_date: "",
    invoice_date: "",
    sub_total: 0,
    total: 0,
    total_vat: 0,
    status: 0,
    accept_price_change_from_supplier: 0,
    creditNotices: [
      {
        id: 0,
        type: "",
        credit_amount: 0,
        name: "",
        note: "",
        status: 0,
        quantity: 0,
        invoice_quantity: 0,
        cost: 0,
        old_cost: 0,
      },
    ],
    creditNoticesPrice: [],
    item: {
      name: "",
      id: "",
    },
    items: [
      {
        id: "",
        name: "",
        quantity: 0,
        invoice_quantity: 0,
        pack_unit: "",
        total_cost: 0,
        sub_total: 0,
        tax_group_id: "",
        cost: 0,
        tax_amount: 0,
        old_cost: 0,
      },
    ],
  };

  const form = useForm<z.infer<typeof formInvoiceSchema>>({
    resolver: zodResolver(formInvoiceSchema),
    defaultValues,
  });

  const {
    invoiceData,
    isPendingExport,
    isFetchingInvoice,
    invoiceApprove,
    invoiceExport,
    invoiceOne,
    isPendingApprove,
    invoiceDelete,
    isPendingDelete,
    invoiceUpdate,
    isPendingUpdate,
    isLoadingOne,
  } = useInvoiceHttp({
    invoiceId: rowData,
    handleCloseSheet: handleCloseSheet,
    setModalName: setModalName,
    setInvoiceOne: (data: any) => {
      form.reset(data);
    },
  });

  useEffect(() => {
    if (Object.values(invoiceOne || {}).length > 0) {
      form.reset(invoiceOne);
      setIsOpen(true);
    }
  }, [Object.values(invoiceOne || {}).length > 0, form]);

  const onSubmit = async (values: any) => {
    invoiceUpdate(values);
  };

  return (
    <>
      <HeaderPage
        title="Invoices"
        disabled={!rowsSelectedIds.length}
        loading={isPendingApprove || isPendingExport}
        onClickAdd={() => {
          invoiceApprove(rowsSelectedIds);
          setRowsSelectedIds([]);
        }}
        exportInventory={true}
        onClickExportInventory={() => {
          invoiceExport();
        }}
      />
      <HeaderTable
        isInvoiceNumber={true}
        branchkey={"filter[branch]"}
        supplierkey={"filter[supplier_id]"}
        isSearch={false}
        isSupplier={true}
        isBranches={true}
        isHasCreditNotes={true}
      />
      <CustomTable
        columns={columns}
        data={invoiceData?.data || []}
        loading={
          isFetchingInvoice ||
          isPendingUpdate ||
          isPendingExport ||
          isPendingApprove
        }
        Select
        pagination
        paginationData={invoiceData?.meta}
        onRowClick={(row: any) => {
          setRowData(row?.id);
          setIsOpen(true);
          setRowsSelectedIds([]);
        }}
      />
      <CustomSheet
        isOpen={isOpen}
        handleCloseSheet={() => {
          form.reset(invoiceOne);
          setIsOpen(false);
        }}
        headerLeftText={"Invoice #162037"}
        form={form}
        isLoadingForm={!isLoadingOne}
        width="w-[672px]"
        headerStyle="border-b-0 flex items-center justify-between w-full"
        purchaseHeader={
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-textPrimary text-[16px] font-semibold">
                Invoice #{form.watch("invoice_number")}
              </h1>
              <p className="text-gray-500 text-[14px] font-medium capitalize">
                {form.watch("supplier_name")}
              </p>
            </div>
          </div>
        }
        receiveOrder={<></>}
        children={
          <InvoiceForm setIsEditItem={setIsEditItem} rowData={rowData} />
        }
        onSubmit={onSubmit}
        contentStyle="px-0"
        setModalName={setModalName}
      />
    </>
  );
};

export default Invoices;
