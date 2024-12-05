import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { ColumnDef } from "@tanstack/react-table";
import { ICustomersList } from "./types/type";
import { useEffect, useState } from "react";
import useCustomersHttp from "./queriesHttp/useCustomersHttp";

import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formCustomersSchema } from "./schema/Schema";
import { z } from "zod";
import CustomerForm from "./components/CustomerForm";
import CustomModal from "@/components/ui/custom/CustomModal";

const Customers = () => {
  const columns: ColumnDef<ICustomersList>[] = [
    {
      accessorKey: "name",
      header: () => <div>Name</div>,
      cell: ({ row }) => <>{row.getValue("name")}</>,
    },
    {
      accessorKey: "phone",
      header: () => <div>Phone</div>,
      cell: ({ row }: any) => <>{row.getValue("phone")}</>,
    },
    {
      accessorKey: "email",
      header: () => <div>Email</div>,
      cell: ({ row }: any) => <>{row.getValue("email") || "-"}</>,
    },
    {
      accessorKey: "last_orders",
      header: () => <div>Last order</div>,
      cell: ({ row }: any) => <>{row.getValue("last_orders") || "-"}</>,
    },
    {
      accessorKey: "total_orders",
      header: () => <div>Total orders</div>,
      cell: ({ row }: any) => <>{row.getValue("total_orders")}</>,
    },
    {
      accessorKey: "account_balance",
      header: () => <div>Account balance</div>,
      cell: ({ row }: any) => <>{row.getValue("account_balance") || "-"}</>,
    },
  ];
  const [rowData, setRowData] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modalName, setModalName] = useState("");
  const handleCloseSheet = () => {
    setRowData(undefined);
    setIsEdit(false);
    setIsOpen(false);
    setModalName("");
    form.reset(defaultValues);
  };

  const {
    CustomersData,
    isLoadingCustomers,
    CustomersOne,
    isLoadingCustomersOne,
    CreateCustomers,
    loadingCreate,
    DeleteCustomers,
    loadingDelete,
    EditCustomers,
    loadingEdit,
  } = useCustomersHttp({
    handleCloseSheet: handleCloseSheet,
    CustomerId: rowData?.id,
  });

  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      DeleteCustomers(rowData?.id || "");
    }
  };
  const onSubmit = (values: z.infer<typeof formCustomersSchema>) => {
    console.log({ values });
    if (isEdit) {
      EditCustomers(values);
      return;
    }
    CreateCustomers(values);
  };
  const defaultValues = {
    name: "",
    phone: "",
    email: "",
    notes: "",
    birth_date: "",
    gender: "",
    house_account_limit: 0,
    is_blacklisted: 0,
    is_loyalty_enabled: 0,
  };
  const form = useForm<z.infer<typeof formCustomersSchema>>({
    resolver: zodResolver(formCustomersSchema),
    defaultValues,
  });

  useEffect(() => {
    if (Object.values(CustomersOne || {}).length > 0) {
      form.reset(CustomersOne);
    }
  }, [CustomersOne, form]);

  return (
    <>
      <HeaderPage
        title="Customers"
        exportButton
        textButton="Add Customer"
        // loading={loadingExport}
        onClickAdd={() => {
          setIsOpen(true);
        }}
        handleExport={() => {}}
        handleImport={() => {}}
      />
      <HeaderTable />

      <CustomTable
        columns={columns}
        data={CustomersData?.data || []}
        onRowClick={(row: any) => {
          setRowData(row);
          setIsEdit(true);
          setIsOpen(true);
        }}
        loading={isLoadingCustomers}
        paginationData={CustomersData?.meta}
      />

      <CustomSheet
        isOpen={isOpen}
        isEdit={isEdit}
        isDirty={form.formState.isDirty}
        width="w-[672px]"
        headerLeftText={CustomersOne?.name}
        handleCloseSheet={handleCloseSheet}
        isLoading={loadingCreate || loadingEdit || loadingDelete}
        form={form}
        onSubmit={onSubmit}
        setModalName={setModalName}
        isLoadingForm={isLoadingCustomersOne}
      >
        <CustomerForm isEdit={isEdit} CustomerOne={CustomersOne} />
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

export default Customers;
