import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { ICPUList, ICpuOne } from "./types/types";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import OrderRules from "./Components/OrderRules";
import Branches from "./Components/Branches";
import CustomModal from "@/components/ui/custom/CustomModal";
import { formCPUschema } from "./Schema/Schema";
import useCPUHttp from "./hooks/useCPUHttp";
import Avatar from "@/components/ui/avatar";
import CPUDetails from "./Components/CPUDetails";
import { PERMISSIONS } from "@/constants/constants";

const CPU = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalName, setModalName] = useState("");
  const [rowData, setRowData] = useState<ICPUList>();
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

  const form = useForm<z.infer<typeof formCPUschema>>({
    resolver: zodResolver(formCPUschema),
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
    CPUData,
    isLoading,
    CreateCPU,
    isPending,
    DeleteCPU,
    isPendingEdit,
    isPendingDelete,
    EditCPU,
    isPendingOne,
    CPUExport,
    isPendingExport,
  } = useCPUHttp({
    handleCloseSheet,
    CPUId: rowData?.id,
    setCPUOne: (data: ICpuOne) => {
      form.reset(data);
    },
  });

  const columns: ColumnDef<ICPUList>[] = [
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
      DeleteCPU(rowData?.id ?? "");
    }
  };

  function onSubmit(values: z.infer<typeof formCPUschema>) {
    if (isEdit) {
      EditCPU({ CPUId: rowData?.id ?? "", values: values });
    } else {
      CreateCPU(values);
    }
  }

  return (
    <>
      <HeaderPage
        title="CPU"
        textButton="Add CPU"
        exportButton={true}
        loading={isPendingExport}
        handleExport={() => {
          CPUExport();
        }}
        onClickAdd={() => {
          setIsOpen(true);
        }}
        modalName={"CPU"}
                permission={[PERMISSIONS.can_add_and_edit_inventory_items_recipes_and_suppliers]}
        
      />
      <HeaderTable />
      <CustomTable
        columns={columns}
        data={CPUData?.data || []}
        onRowClick={(row: ICPUList) => {
          setRowData(row);
          setIsEdit(true);
          setIsOpen(true);
        }}
        loading={isLoading}
        // name={matchingIndexes}
        paginationData={CPUData?.meta}
      />

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
          { name: "CPU details", content: <CPUDetails /> },
          {
            name: "Branches",
            content: <Branches id={form.watch("branch_id") || ""} />,
          },
          { name: "Order rules", content: <OrderRules /> },
        ]}
      />
      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={rowData?.name ?? ""}
      />
    </>
  );
};

export default CPU;
