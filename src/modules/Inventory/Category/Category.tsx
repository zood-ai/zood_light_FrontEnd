import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import useCustomQuery from "@/hooks/useCustomQuery";
import CustomModal from "@/components/ui/custom/CustomModal";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { formCategorySchema } from "./schema/Schema";
import useCategoryHttp from "./queriesHttp/useCategoryHttp";
import moment from "moment";
import { CreateModal } from "./components/CreateModal";
import useCommonRequests from "@/hooks/useCommonRequests";
import useFilterQuery from "@/hooks/useFilterQuery";
import { PERMISSIONS } from "@/constants/constants";

const Category = () => {
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [modalName, setModalName] = useState("");
  const [rowData, setRowData] = useState<any>();
  const [isEdit, setIsEdit] = useState(false);

  const form = useForm<z.infer<typeof formCategorySchema>>({
    resolver: zodResolver(formCategorySchema),
    defaultValues: {
      name: "",
      name_localized: "",
      reference: "",
    },
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
    {
      accessorKey: "created_at",
      header: () => <div>Created at</div>,
      cell: ({ row }: any) => (
        <>{moment(row.getValue("created_at")).format("LL")}</>
      ),
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
      reference: "",
    });
  };

  useEffect(() => {
    if (Object.keys(rowData || {}).length) {
      form.reset({
        name: rowData?.name || "",
        name_localized: rowData?.name_localized || "",
        reference: rowData?.reference || "",
      });
    }
  }, [Object.keys(rowData || {}).length, form]);

  const onSubmit = (values: z.infer<typeof formCategorySchema>) => {
    if (isEdit) {
      mutateEdit({ ...values, id: rowData?.id, reference: values.reference });
      return;
    }
    Createcategory(values);
  };

  const {
    Createcategory,
    mutateEdit,
    isPendingEdit,
    isPendingDelete,
    data,
    isLoading,
    isPending,
    mutateDelete,
  } = useCategoryHttp({
    handleCloseSheet: handleCloseSheet,
  });

  return (
    <>
      <HeaderPage
        title="Inventory category"
        textButton="Add Category"
        onClickAdd={() => {
          setIsOpen(true);
        }}
        exportButton={true}
        modalName={"categories"}
        permission={[PERMISSIONS.can_add_and_edit_inventory_items_recipes_and_suppliers]}
        
      />
      <HeaderTable SearchInputkey="filter[name]" />

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
        btnText="Add "
        isOpen={isOpen}
        isEdit={isEdit}
        isDirty={form.formState.isDirty}
        headerLeftText={
          isEdit ? "Edit Inventory Category" : "Create  Inventory Category"
        }
        handleCloseSheet={handleCloseSheet}
        isLoading={isPending || isPendingEdit || isPendingDelete}
        form={form}
        onSubmit={onSubmit}
        setModalName={setModalName}
      >
        <CreateModal />
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

export default Category;
