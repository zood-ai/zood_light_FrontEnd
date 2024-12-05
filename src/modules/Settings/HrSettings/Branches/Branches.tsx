import { CustomTable } from "@/components/ui/custom/CustomTable";
import React, { useEffect, useState } from "react";
import useBranchesHttps from "./queriesHttp/useBranchesHttp";
import { ColumnDef } from "@tanstack/react-table";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formBranchesSchema } from "./Schema/Schema";
import EditBranch from "./components/EditBranch";
import CustomModal from "@/components/ui/custom/CustomModal";

const Branches = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [modalName, setModalName] = useState("");
  const [rowData, setRowData] = useState<any>();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: () => <div>Branch Name</div>,
      cell: ({ row }) => (
        <div className="w-[100px]">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "employee_count",
      header: () => <div>Number of employee</div>,
      cell: ({ row }) => (
        <div className="w-[100px]">{row.getValue("employee_count")}</div>
      ),
    },

    {
      accessorKey: "weekly_target",
      header: () => <div>Weekly target</div>,
      cell: ({ row }) => (
        <div className="w-[100px]">{row.getValue("weekly_target")}</div>
      ),
    },
  ];

  const defaultValues = {
    branch_id: "",
    departments: [],
    employee_count: 0,
    holiday_entitlements: "",
    holidays: [],
    opening_hours: [],
    weekly_target: 0,
    mobile_clock_in:0
  };
  const form = useForm<z.infer<typeof formBranchesSchema>>({
    resolver: zodResolver(formBranchesSchema),
    defaultValues,
  });
  const handleCloseSheet = () => {
    setModalName("");
    setIsEdit(false);
    form.reset()
  };
  const onSubmit = (values) => {
    branchEdit({ branch_id: rowData?.id, ...values });
  };

  const { BranchesData, isLoadingBranches, branchEdit, isLoadingEdit, isLoadingBrancheOne, BrancheOne } =
    useBranchesHttps({
      handleCloseSheet: handleCloseSheet, setBranchOne: (data) => {
        form.reset(data)
      },
      branchId: rowData?.id
    });


console.log(form.formState.errors,form.getValues());



  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[24px] font-bold ">Hr Settings</p>
      <HeaderTable />
      <CustomTable
        columns={columns}
        data={BranchesData?.data || []}
        loading={isLoadingBranches}
        onRowClick={(row) => {
          setIsEdit(true);
          setRowData(row);

        }}
        paginationData={BranchesData?.meta}
      />

      {/* Edit */}
      <CustomSheet
        isOpen={isEdit}
        isEdit={false}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={rowData?.name}
        isDirty={form.formState.isDirty}
        isLoading={isLoadingEdit}
        form={form}
        btnText="Save changes"
        isLoadingForm={isLoadingBrancheOne}
        onSubmit={onSubmit}
        setModalName={setModalName}
        width="w-[700px]"
      >
        <EditBranch />
      </CustomSheet>

    </div>
  );
};

export default Branches;
