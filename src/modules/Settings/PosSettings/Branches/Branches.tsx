import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import React, { useEffect, useState } from "react";
import useBranchesHttps from "./queriesHttp/useBranchesHttps";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { IBranches, ICreateBranch } from "./types/types";
import moment from "moment";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formBranchesSchema, formBranchesSchemaEdit } from "./Schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import UsersList from "./components/UsersList";
import BranchDesc from "./components/BranchDesc";
import CreateBranch from "./components/CreateBranch";
import EditBranch from "./components/EditBranch";
import CustomModal from "@/components/ui/custom/CustomModal";

const Branches = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [rowData, setRowData] = useState<any>("");
  const [modalName, setModalName] = useState("");

  const columns: ColumnDef<IBranches>[] = [
    {
      accessorKey: "name",
      header: () => <div>Name</div>,
      cell: ({ row }) => <>{row.getValue("name")}</>,
    },
    {
      accessorKey: "reference",
      header: () => <div>Reference</div>,
      cell: ({ row }) => <>{row.getValue("reference")}</>,
    },
    {
      accessorKey: "tax_group",
      header: () => <div>Tax Group</div>,
      cell: ({ row }) => {
        const taxGroup = row.getValue("tax_group") as { name: string };
        return <>{taxGroup?.name}</>;
      },
    },
    {
      accessorKey: "created_at",
      header: () => <div>Created at</div>,
      cell: ({ row }) => <>{moment(row.getValue("created_at")).format("LL")}</>,
    },
  ];
  const defaultValues = {
    name: "",
    name_localized: "",
  };
  const form = useForm<z.infer<typeof formBranchesSchema>>({
    resolver: zodResolver(formBranchesSchema),
    defaultValues,
  });

  const formEdit = useForm<z.infer<typeof formBranchesSchemaEdit>>({
    resolver: zodResolver(formBranchesSchemaEdit),
    defaultValues,
  });
  const handleCloseSheet = () => {
    setModalName("");
    setIsOpen(false);
    setIsEdit(false);
    form.reset(defaultValues);
    formEdit.reset(defaultValues);
  };
  console.log(formEdit.formState.errors);

  const onSubmit = (values: ICreateBranch) => {
    if (isEdit) {
      branchEdit(values);
    } else {
      branchCreate(values);
    }
  };
  const {
    BranchesData,
    isLoadingBranches,
    isLoadingCreate,
    branchCreate,
    branchEdit,
    isLoadingBrancheOne,
    isLoadingEdit,
    branchDelete,
    isLoadingDelete,
  } = useBranchesHttps({
    handleCloseSheet: handleCloseSheet,
    branchId: rowData,
    setBranchOne: (data: any) => {
      form.reset(data);
      formEdit.reset(data);
    },
  });

  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      branchDelete(rowData);
    }
  };
  console.log(form.getValues());

  return (
    <>
      <HeaderPage
        title="Branches"
        onClickAdd={() => {
          setIsOpen(true);
        }}
        textButton="Create branch"
      />
      <HeaderTable />
      <CustomTable
        data={BranchesData?.data || []}
        columns={columns}
        paginationData={BranchesData?.meta}
        loading={isLoadingBranches}
        onRowClick={(row: { id: string }) => {
          setIsEdit(true);

          setRowData(row?.id);
        }}
      />
      <CustomSheet
        isOpen={isOpen}
        btnText={"Create"}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={"New branch"}
        form={form}
        isLoading={isLoadingCreate}
        onSubmit={onSubmit}
        setModalName={setModalName}
        isDirty={form.formState.isDirty}
      >
        <CreateBranch />
      </CustomSheet>
      {/* Edit */}
      <CustomSheet
        isOpen={isEdit}
        isEdit={isEdit}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={"Edit branch"}
        isLoading={isLoadingEdit || isLoadingDelete}
        form={formEdit}
        isLoadingForm={isLoadingBrancheOne}
        onSubmit={onSubmit}
        setModalName={setModalName}
        isDirty={formEdit.formState.isDirty}
        tabs={[
          { name: "Details", content: <EditBranch setIsEdit={setIsEdit} /> },
          { name: "Users", content: <UsersList /> },
        ]}
      ></CustomSheet>
      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={rowData?.name || ""}
      />
    </>
  );
};

export default Branches;
