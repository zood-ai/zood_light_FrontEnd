import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { ICategoriesList } from "./types/type";
import { ColumnDef } from "@tanstack/react-table";
import useCategoriesHttp from "./queriesHttp/UseCategoriesHttp";
import { useEffect, useState } from "react";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ContentCategory from "./components/ContentCategory";
import { formCategoriesSchema } from "./Schema/Schema";
import CustomModal from "@/components/ui/custom/CustomModal";
import moment from "moment";

const Categories = () => {
  const columns: ColumnDef<ICategoriesList>[] = [
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
      accessorKey: "products",
      header: () => <div>Product</div>,
      cell: ({ row }: any) => (
        <div
          className={`${row.getValue("products") === 0 ? "" : "text-primary"}`}
        >
          Products ({row.getValue("products")})
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: () => <div>Created At</div>,
      cell: ({ row }: any) => (
        <>{moment(row.getValue("created_at")).format("LL") || "-"}</>
      ),
    },
  ];
  const handleCloseSheet = () => {
    setIsOpen(false);
    setIsEdit(false);
    setModalName("");
    setRowData(undefined);
    form.reset(defaultValues);
  };
  const [rowData, setRowData] = useState<any>();
  const {
    categoriesData,
    isLoadingCategories,
    CreateCategory,
    loadingCreate,
    DeleteCategory,
    loadingEdit,
    categoryOne,
    isLoadingCategoryOne,
    EditCategory,
    loadingExport,
    ExportCategory,
  } = useCategoriesHttp({
    handleCloseSheet: handleCloseSheet,
    IdCategory: rowData?.id,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modalName, setModalName] = useState("");
  const onSubmit = (values: any) => {
    console.log(values, "values");

    if (isEdit) {
      EditCategory(values);
    } else {
      CreateCategory(values);
    }
  };
  const defaultValues = {
    name: "",
    reference: "",
    image: "",
  };
  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      // handle delete
      DeleteCategory(rowData?.id || "");
    }
  };

  const form = useForm<z.infer<typeof formCategoriesSchema>>({
    resolver: zodResolver(formCategoriesSchema),
    defaultValues,
  });

  useEffect(() => {
    if (Object.keys(rowData || {}).length) {
      form.reset(categoryOne);
    }
  }, [Object.keys(rowData || {}).length, form, categoryOne]);

  return (
    <>
      <HeaderPage
        title="Categories"
        textButton="Add Category"
        exportButton
        loading={loadingExport}
        onClickAdd={() => {
          setIsOpen(true);
        }}
        handleExport={() => {
          ExportCategory();
        }}
        handleImport={() => {}}
      />
      <HeaderTable />

      <CustomTable
        columns={columns}
        data={categoriesData?.data || []}
        onRowClick={(row: any) => {
          setRowData(row);
          setIsEdit(true);
          setIsOpen(true);
        }}
        loading={isLoadingCategories}
        paginationData={categoriesData?.meta}
      />

      <CustomSheet
        isOpen={isOpen}
        isEdit={isEdit}
        handleCloseSheet={handleCloseSheet}
        form={form}
        isDirty={form.formState.isDirty}
        headerLeftText={isEdit ? "Edit Category" : "Add Category"}
        onSubmit={onSubmit}
        setModalName={setModalName}
        isLoading={loadingCreate || loadingEdit}
        isLoadingForm={isLoadingCategoryOne}
      >
        <>
          <ContentCategory categoryOne={categoryOne} />
        </>
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

export default Categories;
