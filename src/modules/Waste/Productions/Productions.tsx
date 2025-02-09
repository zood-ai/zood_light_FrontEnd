import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { IProductionsList } from "./types/types";
import KnifeIcon from "@/assets/icons/Knife";
import useProductionsHttp from "./queriesHttp/useProductionsHttp";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formProductionsSchema } from "./schema/Schema";
import ProductionsHeader from "./components/ProductionsHeader";
import ProductionsFormContent from "./components/ProductionsFormContent";
import ChooseBranch from "@/components/ui/custom/ChooseBranch";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";

const Productions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modalName, setModalName] = useState<string>("");
  const [oldRowData, setOldRowData] = useState<IProductionsList>({
    id: "",
    business_date: "",
    quantity: "0",
    name: "",
    row_id: 0,
    storage_unit: "",
  });

  const [rowData, setRowData] = useState<IProductionsList>({
    id: "",
    business_date: "",
    quantity: "0",
    name: "",
    row_id: 0,
    storage_unit: "",
  });
  const [step, setStep] = useState<number>(1);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);

  const [searchParams] = useSearchParams();
  const [singleItem, setSingleItem] = useState({
    id: "",
    quantity: 0,
    storage_unit: "",
    name: "",
  });

  const {
    productionsData,
    isFetchingProductions,
    deleteproduction,
    isPendingDelete,
    isPendingUpdate,
    isPendingCreate,
  } = useProductionsHttp({});

  const defaultValues = {
    business_date: format(new Date(), "yyyy-MM-dd"),
    branch_id: searchParams.get("filter[branch]") || "",
    items: [],
  };
  const handleCloseSheet = () => {
    setIsOpen(false);
    setStep(1);
    setModalName("");
    setIsEdit(false);
    setRowData({
      id: "",
      business_date: "",
      quantity: "0",
      name: "",
      row_id: 0,
      storage_unit: "",
    });

    setOldRowData({
      id: "",
      business_date: "",
      quantity: "0",
      name: "",
      row_id: 0,
      storage_unit: "",
    });
    form.reset(defaultValues);
  };

  const form = useForm<z.infer<typeof formProductionsSchema>>({
    resolver: zodResolver(formProductionsSchema),
    defaultValues,
  });

  const onSubmit = () => {};

  const columns: ColumnDef<IProductionsList>[] = [
    {
      accessorKey: "name",
      header: () => <div>Item</div>,
      cell: ({ row }: any) => (
        <div className="flex items-center gap-[10px]">
          <div className="w-[32px] h-[32px] flex items-center justify-center bg-warn-foreground rounded-full">
            <KnifeIcon />
          </div>
          {row.getValue("name") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "business_date",
      header: () => <div>Date</div>,
      cell: ({ row }: any) => (
        <>{format(row.getValue("business_date"), "dd MMMM, yyyy") || "-"}</>
      ),
    },
    {
      accessorKey: "quantity",
      header: () => <div>Batch quantity</div>,
      cell: ({ row }: any) => (
        <>
          {row.getValue("quantity") || "-"} {row.original.storage_unit}
        </>
      ),
    },
  ];

  return (
    <>
      {!searchParams.get("filter[branch]") ? (
        <ChooseBranch showHeader />
      ) : (
        <>
          <HeaderPage
            title="Productions"
            onClickAdd={() => {
              setIsOpen(true);
            }}
            textButton="New Production"
          />
          <CustomTable
            columns={columns}
            data={productionsData?.data || []}
            loading={isFetchingProductions}
            pagination
            paginationData={{
              from: productionsData?.from || 0,
              total: productionsData?.total || 0,
              current_page: productionsData?.current_page || 0,
              to: productionsData?.to || 0,
              last_page: productionsData?.last_page || 0,
            }}
            onRowClick={(row: IProductionsList) => {
              setRowData(row);
              setOldRowData(row);
              setIsOpen(true);
              setIsEdit(true);
              setStep(4);
            }}
          />
          <CustomSheet
            isOpen={isOpen}
            isDirty={+oldRowData.quantity !== +rowData?.quantity}
            handleCloseSheet={handleCloseSheet}
            form={form}
            isEdit={isEdit}
            onSubmit={onSubmit}
            setModalName={setModalName}
            isLoading={isPendingCreate || isPendingUpdate || isPendingDelete}
            width="w-[672px]"
            contentStyle={step === 1 ? "px-6 py-2" : ""}
            headerStyle={`${
              step === 4 && "px-0 py-4"
            } pb-2 flex items-center justify-between w-full`}
            purchaseHeader={
              <ProductionsHeader
                setStep={setStep}
                step={step}
                singleItem={singleItem}
                setValue={form.setValue}
                getValues={form.getValues}
                handleCloseSheet={handleCloseSheet}
                row_id={rowData?.row_id}
                quantity={rowData?.quantity}
                oldQuantity={oldRowData?.quantity}
                modalName={modalName}
                setModalName={setModalName}
                BatchName={rowData?.name}
              />
            }
          >
            <ProductionsFormContent
              step={step}
              setStep={setStep}
              setRowData={setRowData}
              singleItem={singleItem}
              setSingleItem={setSingleItem}
              setSelectedItemIndex={setSelectedItemIndex}
              selectedItemIndex={selectedItemIndex}
              rowData={rowData}
              handleCloseSheet={handleCloseSheet}
            />
          </CustomSheet>
        </>
      )}
    </>
  );
};

export default Productions;
