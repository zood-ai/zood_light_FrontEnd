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
import SingleItem from "./components/SingleItem";
import ArrowReturn from "@/assets/icons/ArrowReturn";
import CustomModal from "@/components/ui/custom/CustomModal";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { Loader2 } from "lucide-react";
import Avatar from "@/components/ui/avatar";
import AuthPermission from "@/guards/AuthPermission";
import { PERMISSIONS } from "@/constants/constants";

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
          className={`checkbox ${row.original.status == 2 || row.original.status == 1
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
    isPendingInvoiceOne,
    invoiceApprove,
    invoiceExport,
    invoiceOne,
    isPendingApprove,
    invoiceDelete,
    isPendingDelete,
    invoiceUpdate,
    isPendingUpdate,
    isLoadingOne
  } = useInvoiceHttp({
    invoiceId: rowData,
    handleCloseSheet: handleCloseSheet,
    setModalName: setModalName,
    setInvoiceOne: (data: any) => { form.reset(data); },
  });


  const handleRemove = () => {
    const items = form.watch("items") || [];
    const creditNotes = form.watch("creditNotices") || [];
    const currentItems = items?.filter(
      (item: { id: string }) => item?.id !== form.watch("item")?.id
    );
    const currentCreditNotes = creditNotes?.filter(
      (item: { item_id: string }) => item?.item_id !== form.watch("item")?.id
    );
    form.setValue("items", currentItems);
    form.setValue("creditNotices", currentCreditNotes);

    // Recalculate the subtotal
    const subtotal = currentItems.reduce(
      (acc: number, item: { cost: number; invoice_quantity: number }) => {
        return acc + item.cost * item.invoice_quantity;
      },
      0
    );

    const totalTax = currentItems.reduce(
      (acc: number, item: { tax_amount: number }) => {
        return acc + item.tax_amount;
      },
      0
    );

    // Calculate the total (subtotal + VAT)
    const total = subtotal + totalTax;

    // Set the recalculated values in the form
    form.setValue("sub_total", subtotal);
    form.setValue("total_vat", totalTax);
    form.setValue("total", total);

    setIsEditItem(false);
  };

  const onSubmit = async (values: any) => {
    invoiceUpdate(values);
  };
  

  return (
    <>
      <HeaderPage
        title="Invoices"
        textButton="Approve"
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
        permission={[PERMISSIONS.can_access_inventory_management_features]}
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

        isLoadingForm={!isLoadingOne }

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
        receiveOrder={
          <>
          <AuthPermission permissionRequired={[PERMISSIONS.can_edit_invoices,PERMISSIONS.can_access_inventory_management_features]}>
            {[1, 2].includes(invoiceOne?.status) ? (
              <Button
                type="button"
                className="bg-popover text-textPrimary text-sm font-normal border-[1px] border-[#d4e2ed]"
                loading={isPendingUpdate}
                onClick={() => {
                  if (invoiceOne?.status == 1) {
                    invoiceUpdate({ id: rowData, status: 0 });
                  }
                  if (invoiceOne?.status == 2) {
                    setModalName("Unapprove");
                  }
                }}
              >
                Unapproved
              </Button>
            ) : (
              <Button
                type="button"
                className="bg-popover text-sm text-textPrimary border-[1px] font-normal border-[#d4e2ed]"
                disabled={[1, 2].includes(invoiceOne?.status)}
                loading={isPendingUpdate || isPendingApprove}
                onClick={() => {
                  invoiceApprove([rowData]);
                }}
              >
                Approve
              </Button>
            )}

            {invoiceOne?.creditNotices?.some(
              (creditNotice: { status: number }) => creditNotice.status === 2
            ) ? (
              <></>
            ) : (
              <>
                <Button
                  type="button"
                  disabled={
                    [1, 2].includes(invoiceOne?.status) || isPendingDelete
                  }
                  variant="outline"
                  loading={
                    isPendingDelete || isPendingUpdate || isPendingApprove
                  }
                  onClick={() => {
                    invoiceDelete();
                  }}
                  className="w-fit px-4 font-semibold text-warn border-warn "
                >
                  Delete
                </Button>

                <Button
                  type="submit"
                  disabled={
                    [1, 2].includes(invoiceOne?.status) ||
                    isPendingDelete ||
                    !form.formState.isDirty
                  }
                  variant="default"
                  loading={
                    isPendingDelete || isPendingUpdate || isPendingApprove
                  }
                  onClick={() => {
                    const formData = form.getValues();
                    invoiceUpdate(formData);
                  }}
                >
                  Save
                </Button>
              </>
            )}
            </AuthPermission>
          </>

        }
        children={
          <InvoiceForm setIsEditItem={setIsEditItem} rowData={rowData} />
        }
        onSubmit={onSubmit}
        contentStyle="px-0"
        setModalName={setModalName}
        permission={[PERMISSIONS.can_access_inventory_management_features]}
      />

      {/* ------------------------------- */}
      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        headerModal={"Unapprove Invoice"}
        descriptionModal={
          "This invoice has previously been exported. Further changes made to it will be reflected in external systems. such as accounting tools. Those may need to br manually adjusted as a result."
        }
        footerModal={
          <>
            <AlertDialogAction
              className="text-warn"
              onClick={() => {
                invoiceUpdate({ id: rowData, status: 0 });
              }}
            >
              {isPendingUpdate ? (
                <Loader2 className="animate-spin" size={30} />
              ) : (
                <> Un Approve anyway</>
              )}
            </AlertDialogAction>
            <AlertDialogCancel onClick={() => setModalName("")}>
              Cancel
            </AlertDialogCancel>
          </>
        }
        handleConfirm={() => { }}
        deletedItemName={""}
      />
      {/* //////////////////////////////////////// */}
<AuthPermission permissionRequired={[PERMISSIONS.can_edit_invoices]}>
      <CustomSheet
        isOpen={[1, 2].includes(invoiceOne?.status) ? false : isEditItem}
        handleCloseSheet={() => {
          setIsEditItem(false);
        }}
        headerLeftText={"Invoice #162037"}
        form={form}
        isLoadingForm={isPendingInvoiceOne || isFetchingInvoice}
        width="w-[672px]"
        headerStyle="border-b-0 flex items-center justify-between w-full"
        purchaseHeader={
          <>
            {isEditItem ? (
              <div className="flex items-center justify-between w-full">
                <ArrowReturn
                  height="17px"
                  className="cursor-pointer"
                  onClick={() => {
                    setIsEditItem(false);
                  }}
                />
                <h1 className="text-textPrimary text-[16px] font-semibold capitalize">
                  {form.watch("item")?.name || ""}
                </h1>
                <div>
                  <Button
                    variant="default"
                    type="button"
                    onClick={handleRemove}
                  >
                    {" "}
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
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
            )}
          </>
        }
        children={<SingleItem setIsEditItem={setIsEditItem} />}
        onSubmit={onSubmit}
        contentStyle="px-0"
      />
    </AuthPermission>
    </>
  );
};

export default Invoices;
