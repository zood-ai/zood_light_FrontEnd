import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { ISuppliersList } from "./types/types";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SupplierDetails from "./Components/SupplierDetails";
import OrderRules from "./Components/OrderRules";
import Branches from "./Components/Branches";
import CustomModal from "@/components/ui/custom/CustomModal";
import { formSupplierSchema } from "./Schema/Schema";
import useSupplierHttp from "./hooks/useSupplierHttp";
import Avatar from "@/components/ui/avatar";
import AuthPermission from "@/guards/AuthPermission";
import { PERMISSIONS } from "@/constants/constants";

const Suppliers = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalName, setModalName] = useState("");
  const [rowData, setRowData] = useState<any>();
  const [isEdit, setIsEdit] = useState(false);
  const defaultValues = {
    name: "",
    primary_email: "",
    phone: "",
    comment: "",
    accept_price_change: 0,
    min_order: null,
    max_order: null,
    branches: [],
  };

  const form = useForm<z.infer<typeof formSupplierSchema>>({
    resolver: zodResolver(formSupplierSchema),
    defaultValues,
  });

  const handleCloseSheet = () => {
    setModalName("");
    setIsOpen(false);
    setIsEdit(false);
    setRowData(undefined);
    form.reset(defaultValues);
  };
  const {
    SupplierData,
    isLoading,
    CreateSupplier,
    isPending,
    DeleteSupplier,
    supplier,
    isPendingEdit,
    isPendingDelete,
    EditSupplier,
    isPendingOne,
    supplierExport,
    isPendingExport,
  } = useSupplierHttp({
    handleCloseSheet,
    supplierId: rowData?.id,
    setSupplierOne: (data: any) => {
      form.reset(data);
    },
  });


  const columns: ColumnDef<ISuppliersList>[] = [
    {
      accessorKey: "name",
      header: () => <div>Name</div>,
      cell: ({ row }) => {
        const name = row.getValue<string>("name");
        return (
          <div className="w-[250px] flex items-center gap-2">
            <Avatar text={name} />
            <div>{row.getValue("name")}</div>
          </div>
        );
      },
    },

    {
      accessorKey: "primary_email",
      header: () => <div>Order email</div>,
      cell: ({ row }) => {
        return <div className="">{row.getValue("primary_email")}</div>;
      },
    },
  ];

  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      DeleteSupplier(rowData?.id || "");
    }
  };

  function onSubmit(values: z.infer<typeof formSupplierSchema>) {
    if (isEdit) {
      EditSupplier({ supplierId: rowData?.id, values: values });
    } else {
      CreateSupplier(values);
    }
  }

  console.log(form.formState.isDirty);

  return (
    <>
      <HeaderPage
        title="Suppliers"
        textButton="Add Supplier"
        exportButton={true}
        loading={isPendingExport}
        handleExport={() => {
          supplierExport();
        }}
        onClickAdd={() => {
          setIsOpen(true);
        }}
        modalName={"suppliers"}
        permission={[PERMISSIONS.can_add_and_edit_inventory_items_recipes_and_suppliers]}

      />
      <HeaderTable />
      <CustomTable
        columns={columns}
        data={SupplierData?.data || []}
        onRowClick={(row: any) => {
          setRowData(row);
          setIsEdit(true);
          setIsOpen(true);
        }}
        loading={isLoading}
        // name={matchingIndexes}
        paginationData={SupplierData?.meta}

      />
      <AuthPermission permissionRequired={[PERMISSIONS.can_add_and_edit_inventory_items_recipes_and_suppliers]}>

      <CustomSheet
        isOpen={isOpen}
        isEdit={isEdit}
        handleCloseSheet={handleCloseSheet}
        isDirty={form.formState.isDirty}
        headerLeftText={rowData?.name}
        form={form}
        onSubmit={onSubmit}
        setModalName={setModalName}
        isLoadingForm={isEdit ? isPendingOne : false}
        isLoading={isPending || isPendingDelete || isPendingEdit}
        tabs={[
          { name: "Supplier details", content: <SupplierDetails /> },
          { name: "Branches", content: <Branches /> },
          { name: "Order rules", content: <OrderRules /> },
        ]}
        permission={[PERMISSIONS.can_add_and_edit_inventory_items_recipes_and_suppliers]}

      />
      </AuthPermission>
      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={rowData?.name || ""}
      />
    </>
  );
};

export default Suppliers;
