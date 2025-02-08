import { ColumnDef } from "@tanstack/react-table";

// types
import { ICreditNotesList } from "./types/types";

// UI components
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import useCreditNotesHttp from "./queriesHttp/useCreditNotesHttp";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formCreditNotesSchema } from "./schema/Schema";
import { Button } from "@/components/ui/button";
import CreaditNotesForm from "./components/CreaditNotesForm";
import CustomCircle from "@/components/ui/custom/CustomCircle";
import MemoChecked from "@/assets/icons/Checked";
import { PERMISSIONS } from "@/constants/constants";
import AuthPermission from "@/guards/AuthPermission";

const CreditNotes = () => {
  const [rowsSelectedIds, setRowsSelectedIds] = useState<
    { id: string; status: number }[]
  >([]);
  const [invoiceId, setInvoiceId] = useState<string>("");
  const {
    CreditNotesData,
    isFetchingCreditNotes,
    receiveCreditNotice,
    isLoadingReceive,
    invoiceData,
    isFetchingOneInvoice,
  } = useCreditNotesHttp({ invoiceId });

  const [isOpen, setIsOpen] = useState(false);

  const handleCloseSheet = () => {
    setIsOpen(false);
    setInvoiceId("");
  };

  const onSubmit = () => {};

  const Status: {
    [key: number]: string;
  } = {
    1: "Pending",
    2: "Approved",
    3: "Rejected",
  };

  const defaultValues = {};
  const form = useForm<z.infer<typeof formCreditNotesSchema>>({
    resolver: zodResolver(formCreditNotesSchema),
    defaultValues,
  });

  const columns: ColumnDef<ICreditNotesList>[] = [
    {
      id: "select",

      cell: ({ row }: any) => (
        <Checkbox
          checked={rowsSelectedIds
            .map((d) => d.id)
            .includes(String(row.original.id))}
          disabled={
            rowsSelectedIds.length
              ? row.getValue("status") !== rowsSelectedIds[0]?.status
              : false
          }
          onClick={(e) => {
            e.stopPropagation();
          }}
          onCheckedChange={(value) => {
            if (value) {
              setRowsSelectedIds((prev) => [
                ...prev,
                { id: String(row.original.id), status: row.getValue("status") },
              ]);
            } else {
              setRowsSelectedIds((prev) =>
                prev.filter((id) => id.id != row.original.id)
              );
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "item",
      header: () => <div>Item</div>,
      cell: ({ row }) => (
        <div className="flex items-center ">
          {row.original.status == 1 && (
            <CustomCircle
              text={(row.getValue("item") as { name: string })?.name}
            />
          )}
          {row.original.status == 2 && (
            <div className="flex items-center">
              <div className="w-[32px] h-[32px] bg-success rounded-full mx-[4px] flex justify-center items-center">
                <div className="text-white text-[13px]">
                  <MemoChecked />
                </div>
              </div>
              <div>{(row.getValue("item") as { name: string })?.name}</div>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "supplier",
      header: () => <div>Supplier</div>,
      cell: ({ row }: any) => {
        return <div className="">{row.getValue("supplier") || "-"}</div>;
      },
    },
    {
      accessorKey: "branch",
      header: () => <div>Branch</div>,
      cell: ({ row }: any) => <>{row.getValue("branch") || "-"}</>,
    },
    {
      accessorKey: "invoice",
      header: () => <div>Invoice number</div>,
      cell: ({ row }: any) => {
        return (
          <div className="">
            {row.getValue("invoice").invoice_number || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: () => <div>Type</div>,
      cell: ({ row }: any) => {
        return <div className="">{row.getValue("type") || "-"}</div>;
      },
    },
    {
      accessorKey: "status",
      header: () => <div>Status</div>,
      cell: ({ row }: any) => {
        return <div className="">{Status[row.getValue("status")] || "-"}</div>;
      },
    },
    {
      accessorKey: "credit_amount",
      header: () => <div>Credit Value</div>,
      cell: ({ row }: any) => {
        return <div className="">{row.getValue("credit_amount") || "-"}</div>;
      },
    },
  ];

  return (
    <>
      <HeaderPage
        title="Credit notes"
        textButton={rowsSelectedIds[0]?.status == 1 ? "Recieve" : "UnRecieve"}
        disabled={!rowsSelectedIds.length || isLoadingReceive}
        onClickAdd={() => {
          receiveCreditNotice({
            creditIds: rowsSelectedIds.map((d) => d.id),
            recivedCheck: rowsSelectedIds?.[0]?.status == 1 ? true : false,
          });
          setRowsSelectedIds([]);
        }}
      />
      <HeaderTable
        isSupplier={true}
        isBranches={true}
        isType={true}
        placeHolder="Search by invoice number"
        supplierkey="filter[supplier_id]"
        branchkey="filter[branch]"
        SearchInputkey="invoice_number"
      />

      <CustomTable
        columns={columns}
        data={CreditNotesData?.data || []}
        loading={isFetchingCreditNotes}
        Select
        pagination
        paginationData={CreditNotesData?.meta}
        onRowClick={(row: ICreditNotesList) => {
          setInvoiceId(row?.invoice?.id);
          setIsOpen(true);
        }}
      />
      <CustomSheet
        isOpen={isOpen}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={"Invoice #162037"}
        form={form}
        isLoadingForm={isFetchingCreditNotes || isFetchingOneInvoice}
        width="w-[672px]"
        isLoading={isFetchingOneInvoice}
        headerStyle="border-b-0 flex items-center justify-between w-full"
        purchaseHeader={
          <div className="flex items-center justify-between w-full ">
            <div className="">
              <h1 className="text-textPrimary text-[16px] font-semibold">
                Invoice #{invoiceData?.data?.invoice_number || ""}
              </h1>
              <p className="text-gray-500 text-[14px] font-medium">
                {invoiceData?.data?.supplier_name || ""}
              </p>
            </div>
            <AuthPermission permissionRequired={[PERMISSIONS.can_edit_invoices]}>


            <Button
              className="bg-[#E7EDF3] text-textPrimary border-gray-400"
              variant={"outline"}
            >
              Show photos
            </Button>
            </AuthPermission>
          </div>
        }
        permission={[PERMISSIONS.can_edit_invoices]}
        onSubmit={onSubmit}
        contentStyle="p-0"
      >
        <CreaditNotesForm
          invoiceData={invoiceData?.data || []}
          handleCloseSheet={handleCloseSheet}
        />
      </CustomSheet>
    </>
  );
};

export default CreditNotes;
