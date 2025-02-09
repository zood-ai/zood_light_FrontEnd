import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import useCustomQuery from "@/hooks/useCustomQuery";
import CustomModal from "@/components/ui/custom/CustomModal";
import { CreateModal } from "./components/CreateModal";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import useWarehouseHttp from "./queriesHttp/useWarehouseHttp";
import { formWareHouseSchema } from "./schema/Schema";
import { useTranslation } from "react-i18next";

const Warehouse = () => {
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [modalName, setModalName] = useState("");
  const [rowData, setRowData] = useState<any>();
  const [isEdit, setIsEdit] = useState(false);
  const { t } = useTranslation();
  const defaultValue = {
    name: "",
    name_localized: "",
    inventory_end_of_day_time: "00:00",
    reference: "",
  };
  const form = useForm<z.infer<typeof formWareHouseSchema>>({
    resolver: zodResolver(formWareHouseSchema),
    defaultValues: defaultValue,
  });

  const columns: any = [
    {
      accessorKey: "name",
      header: () => <div>Name</div>,
      cell: ({ row }: any) => <>{row.getValue("name")}</>,
    },
    {
      accessorKey: "reference",
      header: () => <div>Reference</div>,
      cell: ({ row }: any) => <>{row.getValue("reference")}</>,
    },
  ];

  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      mutateDelete(rowData?.id || "");
    }
  };

  const handleCloseSheet = () => {
    setModalName("");
    setIsOpen(false);
    setIsEdit(false);
    setRowData(undefined);
    form.reset({
      name: "",
      name_localized: "",
      inventory_end_of_day_time: "00:00",
    });
  };

  useEffect(() => {
    if (Object.keys(rowData || {}).length) {
      form.reset({
        name: rowData?.name || "",
        name_localized: rowData?.name_localized || "",
        inventory_end_of_day_time: rowData?.inventory_end_of_day || "",
        reference: rowData?.reference || "",
      });
    }
  }, [Object.keys(rowData || {}).length, form]);

  const onSubmit = (values: z.infer<typeof formWareHouseSchema>) => {
    if (isEdit) {
      mutateEdit({ ...values, id: rowData?.id, reference: values.reference });
      return;
    }
    CreateWarehouse(values);
  };

  const {
    CreateWarehouse,
    mutateEdit,
    isPendingEdit,
    isPendingDelete,
    data,
    isLoading,
    isPending,
    mutateDelete,
  } = useWarehouseHttp({
    handleCloseSheet: handleCloseSheet,
  });
  return (
    <>
      <HeaderPage
        title="Warehouse"
        textButton="Create Warehouse"
        onClickAdd={() => {
          setIsOpen(true);
        }}
        modalName={"warehouses"}
        exportButton={true}
      />
      <HeaderTable SearchInputkey="name" />
      <CustomTable
        columns={columns}
        data={data?.data || []}
        onRowClick={(row: any) => {
          setRowData(row);
          setIsEdit(true);
          setIsOpen(true);
        }}
        loading={isLoading}
        paginationData={data?.meta}
      />

      <CustomSheet
        isOpen={isOpen}
        isEdit={isEdit}
        isDirty={form.formState.isDirty}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={isOpen ? "New Warehouse" : "Edit Warehouse"}
        isLoading={isPending || isPendingEdit || isPendingDelete}
        form={form}
        onSubmit={onSubmit}
        btnText="Add Warehouse"
        setModalName={setModalName}
      >
        <CreateModal
          inventory_end_of_day_time={rowData?.inventory_end_of_day}
          referenceProp={rowData?.reference}
        />
      </CustomSheet>

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={rowData?.name || ""}
      />
    </>
  );
};

export default Warehouse;
