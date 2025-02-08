import { ColumnDef } from "@tanstack/react-table";

// types
import { IItemsList } from "./types/types";

// UI components
import ItemDetailsForm from "./components/ItemDetailsForm";
import LocationForm from "@/components/LocationForm";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import CustomModal from "@/components/ui/custom/CustomModal";
import useItems from "./hooks/useItems";
import AuthPermission from "@/guards/AuthPermission";
import { PERMISSIONS } from "@/constants/constants";

const Items = () => {
  const columns: ColumnDef<IItemsList>[] = [
    {
      accessorKey: "name",
      header: () => <div>Name</div>,
      cell: ({ row }: any) => <>{row.getValue("name")}</>,
    },
    {
      accessorKey: "type",
      header: () => <div>Type</div>,
      cell: ({ row }: any) => {
        return <div className="">{row.getValue("type") || "-"}</div>;
      },
    },
    {
      accessorKey: "category_name",
      header: () => <div>Category</div>,
      cell: ({ row }: any) => <>{row.getValue("category_name") || "-"}</>,
    },
    {
      accessorKey: "suppliers",
      header: () => <div>Supplier</div>,
      cell: ({ row }: any) => {
        return <div className="">{row.getValue("suppliers") || "-"}</div>;
      },
    },
    {
      accessorKey: "latest_stock_unit",
      header: () => <div>Order unit</div>,
      cell: ({ row }: any) => {
        return (
          <div className="">{row.getValue("latest_stock_unit") || "-"}</div>
        );
      },
    },
    {
      accessorKey: "cost",
      header: () => <div>Price</div>,
      cell: ({ row }: any) => {
        return <div className="">SAR {row.getValue("cost") || "-"}</div>;
      },
    },
    {
      accessorKey: "tax_group",
      header: () => <div>VAT rate</div>,
      cell: ({ row }: any) => {
        return <div className="">{row.getValue("tax_group") || "-"}</div>;
      },
    },
  ];

  const {
    //state
    isOpen,
    isEdit,
    modalName,
    itemName,
    setIsOpen,
    setIsEdit,
    setRowData,
    setModalName,

    // functions
    handleCloseSheet,
    handleConfirm,
    onSubmit,
    ItemsExport,

    // query data
    itemsData,
    isPending,
    isPendingEdit,
    isItemsLoading,
    isItemLoading,
    isPendingDelete,
    isPendingExport,

    // form
    form,
  } = useItems();

  return (
    <>

      <HeaderPage
        title="Inventory Items"
        textButton="Add Item"
        exportButton={true}
        modalName={"items"}
        handleExport={ItemsExport}
        loading={isPendingExport}
        onClickAdd={() => {
          setIsOpen(true);
        }}
        permission={[PERMISSIONS.can_add_and_edit_inventory_items_recipes_and_suppliers]}
      />
   
      <HeaderTable isCategory={true} isSupplier={true} isBranches={true} />

      <CustomTable
        columns={columns}
        data={itemsData?.data || []}
        loading={isItemsLoading}
        pagination
        paginationData={itemsData?.meta}
        onRowClick={(row: IItemsList) => {
          setRowData(row);
          setIsOpen(true);
          setIsEdit(true);
        }}
      />

      <CustomSheet
        isOpen={isOpen}
        isEdit={isEdit}
        isDirty={form.formState.isDirty}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={itemName || form.watch("name")}
        isLoadingForm={isItemLoading}
        width="w-[672px]"
        tabs={[
          {
            name: "Item details ",
            content: <ItemDetailsForm isEdit={isEdit} />,
          },
          {
            name: "Branches",
            content: <LocationForm />,
          },
        ]}
        form={form}
        onSubmit={onSubmit}
        setModalName={setModalName}
        isLoading={isPending || isPendingEdit || isPendingDelete}
        permission={[PERMISSIONS.can_add_and_edit_inventory_items_recipes_and_suppliers]}
      />

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={itemName || ""}
        isPending={isPendingDelete}
      />
    </>
  );
};

export default Items;
