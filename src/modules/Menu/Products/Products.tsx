import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { IProductsList } from "./types/type";
import { ColumnDef } from "@tanstack/react-table";
import useProductsHttp from "./queriesHttp/useProductsHttp";
import { useEffect, useState } from "react";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formProductsSchema } from "./Schema/Schema";
import CustomModal from "@/components/ui/custom/CustomModal";
import ProdcutFrom from "./components/ProdcutFrom";
import BranchFrom from "./components/BranchFrom";
import LocationForm from "@/components/LocationForm";

const Products = () => {
  const columns: ColumnDef<IProductsList>[] = [
    {
      accessorKey: "name",
      header: () => <div>Products name</div>,
      cell: ({ row }) => <>{row.getValue("name")}</>,
    },
    {
      accessorKey: "sku",
      header: () => <div>SKU</div>,
      cell: ({ row }) => <>{row.getValue("sku")}</>,
    },
    {
      accessorKey: "category",
      header: () => <div>Category</div>,
      cell: ({ row }) => (
        <>{(row.getValue("category") as { name: string })?.name || "-"}</>
      ),
    },
    {
      accessorKey: "price",
      header: () => <div>Price</div>,
      cell: ({ row }) => <>SAR {row.getValue("price")}</>,
    },
    {
      accessorKey: "tax_group",
      header: () => <div>Tax Group</div>,
      cell: ({ row }) => (
        <>{(row.getValue("tax_group") as { name: string })?.name || "-"}</>
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
    ProductsData,
    isLoadingProducts,
    CreateProduct,
    loadingCreate,
    DeleteProduct,
    loadingEdit,
    ProductOne,
    isLoadingProductOne,
    EditProduct,
    loadingExport,
    loadingDelete,
    ExportProduct,
  } = useProductsHttp({
    handleCloseSheet: handleCloseSheet,
    IdProduct: rowData?.id,
    ResetForm: (data) => {
      form.reset(data);
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modalName, setModalName] = useState("");

  const onSubmit = (values: any) => {
    if (modalName == "Edit Product") {
      EditProduct(values);
    } else {
      CreateProduct(values);
    }
  };
  const defaultValues = {
    name: "",
    name_localized: "",
    sku: "",
    price: null,
    tax_group_id: "",
    category_id: "",
    image: "",
    recipes: [],
    branches: [],
  };
  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      // handle delete
      DeleteProduct(rowData?.id || "");
    }
  };

  const form = useForm<z.infer<typeof formProductsSchema>>({
    resolver: zodResolver(formProductsSchema),
    defaultValues,
  });

  return (
    <>
      <HeaderPage
        title="Products"
        textButton="Add Product"
        loading={loadingExport}
        onClickAdd={() => {
          setIsOpen(true);
        }}
        handleExport={() => {
          ExportProduct();
        }}
        handleImport={() => {}}
      />
      <HeaderTable isCategory fromMenu categorykey="filter[category][0]" />

      <CustomTable
        columns={columns}
        data={ProductsData?.data || []}
        onRowClick={(row: any) => {
          setRowData(row);
          setIsEdit(true);
          setIsOpen(true);
        }}
        loading={isLoadingProducts}
        paginationData={ProductsData?.meta}
      />

      <CustomSheet
        isOpen={isOpen}
        isEdit={isEdit}
        handleCloseSheet={handleCloseSheet}
        form={form}
        onSubmit={onSubmit}
        headerLeftText={ProductOne?.data?.name}
        setModalName={setModalName}
        isLoading={loadingCreate || loadingEdit || loadingDelete}
        isLoadingForm={isLoadingProductOne}
        contentStyle="p-0 pb-8"
        tabs={[
          { name: "Product", content: <ProdcutFrom isEdit={isEdit} /> },
          {
            name: "Branch ",
            content: isEdit ? <BranchFrom /> : <LocationForm />,
          },
        ]}
      ></CustomSheet>
      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        isPending={loadingDelete}
        deletedItemName={rowData?.name || ""}
      />
    </>
  );
};

export default Products;
