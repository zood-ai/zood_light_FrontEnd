import { ColumnDef } from "@tanstack/react-table";

// types
import { IPriceChangesList } from "./types/types";

// UI components
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import usePriceChangesHttp from "./queriesHttp/usePriceChangesHttp";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formPriceChangesSchema } from "./schema/Schema";
import { Button } from "@/components/ui/button";
import PriceChangesForm from "./components/PriceChangesForm";
import ArrowFilledIcon from "@/assets/icons/ArrowFilled";
import CloseIcon from "@/assets/icons/Close";
import RightIcon from "@/assets/icons/Right";
import CustomCircle from "@/components/ui/custom/CustomCircle";
import MemoChecked from "@/assets/icons/Checked";
import { Badge } from "@/components/ui/badge";
import { handleStatusShap } from "../ReceiveOrders/helpers/helpers";

const PriceChanges = () => {
  const [priceChangeId, setPriceChangeId] = useState("");
  const {
    PriceChangesData,
    isFetchingPriceChanges,
    PriceChangeData,
    isFetchingPriceChange,
    updateStatus,
    isPendingStatus,
  } = usePriceChangesHttp({
    priceChangeId,
  });

  const [rowIndex, setRowIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseSheet = () => {
    setIsOpen(false);
  };

  const onSubmit = () => {};

  const status: { [key: number]: string } = {
    1: "Pending",
    2: "Approved",
    3: "Rejected",
  };

  const defaultValues = {};
  const form = useForm<z.infer<typeof formPriceChangesSchema>>({
    resolver: zodResolver(formPriceChangesSchema),
    defaultValues,
  });

  const columns: ColumnDef<IPriceChangesList>[] = [
    {
      accessorKey: "item_name",
      header: () => <div>Name</div>,
      cell: ({ row }: any) => <>{row.getValue("item_name") || "-"}</>,
    },
    {
      accessorKey: "supplier_name",
      header: () => <div>Supplier</div>,

      cell: ({ row }) => (
        <div className=" flex items-center">
          {row.original.status == 2 ? (
            <div className="flex items-center">
              <div className="w-[32px] h-[32px] bg-success rounded-full mx-[4px] flex justify-center items-center">
                <div className="text-white text-[13px]">
                  <MemoChecked />
                </div>
              </div>
              <div>{row.getValue("supplier_name")}</div>
            </div>
          ) : (
            <CustomCircle text={row.getValue("supplier_name")} />
          )}
        </div>
      ),
    },
    {
      accessorKey: "invoice_number",
      header: () => <div>Invoice number</div>,
      cell: ({ row }: any) => <>{row.getValue("invoice_number") || "-"}</>,
    },
    {
      accessorKey: "business_date",
      header: () => <div>Date</div>,
      cell: ({ row }: any) => {
        return (
          <div className="w-[100px]">
            {row.getValue("business_date") || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "old_price",
      header: () => <div>Old Price</div>,
      cell: ({ row }: any) => {
        return <div className="">{row.getValue("old_price") || "-"}</div>;
      },
    },
    {
      accessorKey: "new_price",
      header: () => <div>New Price</div>,
      cell: ({ row }: any) => {
        return <div className="">{row.getValue("new_price") || "-"}</div>;
      },
    },
    {
      accessorKey: "variance",
      header: () => <div>Variance</div>,
      cell: ({ row }: any) => {
        return (
          <div
            className={`${
              row.getValue("variance") < 0 ? "text-[#68A798]" : "text-warn"
            } flex gap-1 items-center`}
          >
            <ArrowFilledIcon
              className={`${row.getValue("variance") < 0 && "rotate-180"}`}
              color={row.getValue("variance") < 0 ? "#68A798" : "var(--warn)"}
            />
            {row.getValue("variance").toFixed(2) || "-"}%
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div>Action</div>,

      cell: ({ row }: any) => {
        return (
          <div>
            {rowIndex === row.index && row?.original?.status === 1 ? (
              <div className="flex gap-2 items-center">
                <Button
                  variant={"outline"}
                  disabled={isPendingStatus}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatus({
                      id: row?.original?.id,
                      status: 3,
                    });
                  }}
                  className="border-gray-400 w-[32px] px-0 h-[32px] bg-transparent rounded-sm"
                >
                  <CloseIcon />
                </Button>
                <Button
                  disabled={isPendingStatus}
                  variant={"outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatus({
                      id: row?.original?.id,
                      status: 2,
                    });
                  }}
                  className="border-gray-400 w-[32px] px-0 h-[32px] bg-transparent rounded-sm"
                >
                  <RightIcon />
                </Button>
              </div>
            ) : (
              <Button
                variant={"outline"}
                className={`border-none bg-transparent ${
                  row.getValue("status") === 2
                    ? "text-[#68A798]"
                    : row.getValue("status") === 1
                    ? "text-primary"
                    : "text-warn"
                }`}
              >
                {status[row.getValue("status")]}
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <HeaderPage
        title="Price changes"
        onClickAdd={() => {
          setIsOpen(true);
        }}
      />
      <HeaderTable
        isSupplier={true}
        isBranches={true}
        placeHolder="Search by invoice number"
        supplierkey="supplier_id"
        branchkey="filter[branch]"
        SearchInputkey="invoice_number"
      />

      <CustomTable
        columns={columns}
        data={PriceChangesData?.data || []}
        loading={isFetchingPriceChanges}
        pagination
        setRowIndex={setRowIndex}
        paginationData={PriceChangesData?.meta}
        onRowClick={(row: IPriceChangesList) => {
          setIsOpen(true);
          setPriceChangeId(row.invoice_id);
        }}
      />
      <CustomSheet
        isOpen={isOpen}
        handleCloseSheet={handleCloseSheet}
        form={form}
        isLoadingForm={isFetchingPriceChange}
        width="w-[672px]"
        headerStyle="border-b-0 flex items-center justify-between w-full"
        purchaseHeader={
          <div className="flex items-center justify-between w-full ">
            <div className="">
              <h1 className="text-textPrimary text-[16px] font-semibold">
                Invoice #{PriceChangeData?.data?.invoice_number}
              </h1>
              <p className="text-gray-500 text-[14px] flex items-center gap-2 font-medium">
                {PriceChangeData?.data?.supplier_name}
                {!PriceChangeData?.data?.creditNotices?.length && (
                  <Badge variant={handleStatusShap("4")}>Price update</Badge>
                )}
              </p>
            </div>
            <Button
              className="bg-[#E7EDF3] text-textPrimary border-gray-400"
              variant={"outline"}
            >
              Show photos
            </Button>
          </div>
        }
        onSubmit={onSubmit}
        contentStyle="p-0"
      >
        <PriceChangesForm PriceChange={PriceChangeData?.data} />
      </CustomSheet>
    </>
  );
};

export default PriceChanges;
