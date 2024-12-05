import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { ColumnDef } from "@tanstack/react-table";
import { IStorageAreaList } from "./types/types";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";

import LocationForm from "@/components/LocationForm";
import { Input } from "@/components/ui/input";
import CustomModal from "@/components/ui/custom/CustomModal";
import { FormMessage } from "@/components/ui/form";
import useStorageAreas from "./hooks/useStorageAreas";

const StorageArea = () => {
  const {
    // state
    setIsOpen,
    setRowData,
    setIsEdit,
    setModalName,
    modalName,
    isOpen,
    isEdit,

    // functions
    handleCloseSheet,
    onSubmit,
    handleConfirm,

    // query data
    loadingCreate,
    isPendingEdit,
    isLoadingStorageAreas,
    StorageName,
    StorageAreasData,
    isPendingDelete,

    // form
    form,
  } = useStorageAreas();

  const columns: ColumnDef<IStorageAreaList>[] = [
    {
      accessorKey: "name",
      header: () => <div>Name</div>,
      cell: ({ row }) => (
        <div className="w-[200px]">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "items_count",
      header: () => <div>Items</div>,
      cell: ({ row }) => {
        return <div className="w-[200px]">{row.getValue("items_count")}</div>;
      },
    },
    {
      accessorKey: "branch_name",
      header: () => <div>Location</div>,
      cell: ({ row }) => {
        return (
          <div className="w-[200px]">{row.getValue("branch_name") || "-"}</div>
        );
      },
    },
  ];

  return (
    <>
      <HeaderPage
        title="Storage areas"
        textButton="Add "
        exportButton={true}
        onClickAdd={() => {
          setIsOpen(true);
        }}
        modalName={"storage_areas"}
      />
      <HeaderTable isBranches branchkey="filter[branch]" />
      <CustomTable
        columns={columns}
        pagination
        paginationData={StorageAreasData?.meta}
        loading={isLoadingStorageAreas}
        data={StorageAreasData?.data || []}
        onRowClick={(row: IStorageAreaList) => {
          setRowData(row);
          setIsEdit(true);
          setIsOpen(true);
        }}
      />

      <CustomSheet
        isOpen={isOpen}
        isEdit={isEdit}
        isDirty={form.formState.isDirty}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={StorageName}
        form={form}
        onSubmit={onSubmit}
        setModalName={setModalName}
        isLoading={loadingCreate || isPendingEdit}
      >
        <>
          <div className="mb-[24px]">
            <Input
              className="mt-[8px] w-[300px]"
              placeholder="Enter name(s)"
              {...form.register("names")}
              label="Names (separated by a comma)"
              required
            />
            <FormMessage />
          </div>
          {!isEdit && (
            <>
              <div className="mb-[15px] text-[16px] font-bold">Locations</div>
              <LocationForm className="bg-popover p-[16px] mt-[16px] border rounded-[4px]" />
            </>
          )}
        </>
      </CustomSheet>

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={StorageName}
        isPending={isPendingDelete}
      />
    </>
  );
};

export default StorageArea;
