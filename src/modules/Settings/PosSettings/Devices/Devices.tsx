import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { useState } from "react";
import useDevicesHttps from "./queriesHttp/useDevicesHttps";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { IDevices, ICreateDevices } from "./types/types";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formDevicesSchema } from "./Schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import CreateDevice from "./components/CreateDevice";
import { getDevicesStatus, getDevicesType } from "./helpers";
import CustomModal from "@/components/ui/custom/CustomModal";
import { Badge } from "@/components/ui/badge";

const Devices = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [rowData, setRowData] = useState("");
  const [modalName, setModalName] = useState("");

  const columns: ColumnDef<IDevices>[] = [
    {
      accessorKey: "name",
      header: () => <div>Device name</div>,
      cell: ({ row }) => <>{row.getValue("name")}</>,
    },
    {
      accessorKey: "reference",
      header: () => <div>Device Number</div>,
      cell: ({ row }) => <>{row.getValue("reference")}</>,
    },
    {
      accessorKey: "in_use",
      header: () => <div>Status</div>,
      cell: ({ row }) => {
        return (
          <div>
            <Badge variant={row.getValue("in_use") == 1 ? "success" : "danger"}>
              {getDevicesStatus(row.getValue("in_use"))}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: () => <div>Type</div>,
      cell: ({ row }) => <>{getDevicesType(row.getValue("type"))}</>,
    },
    {
      accessorKey: "branch",
      header: () => <div>Branch</div>,
      cell: ({ row }) => (
        <>{(row.getValue("branch") as { name: string })?.name}</>
      ),
    },
  ];

  const defaultValues = {
    name: "",
    name_localized: "",
    reference: 0,
    branch_id: "",
    type: 0,
    tags: [],
  };
  const form = useForm<z.infer<typeof formDevicesSchema>>({
    resolver: zodResolver(formDevicesSchema),
    defaultValues,
  });
  const handleCloseSheet = () => {
    setModalName("");
    setIsOpen(false);
    setIsEdit(false);
    setRowData("");
    form.reset(defaultValues);
  };

  const onSubmit = (values: ICreateDevices) => {
    if (isEdit) {
      DeviceEdit(values);
      return;
    }
    deviceCreate(values);
  };
  const {
    DevicesData,
    isLoadingDevices,
    deviceCreate,
    DeviceEdit,
    isLoadingDeviceOne,
    DeviceOne,
    isLoadingCreate,
    DeleteDevice,

    isPendingDelete,
    isLoadingEdit,
  } = useDevicesHttps({
    handleCloseSheet: handleCloseSheet,
    deviceId: rowData,
    setDeviceOne: ({ data }) => {
      form.reset({
        name: data?.name,
        name_localized: data?.name_localized || "",
        reference: +data?.reference,
        branch_id: data?.branch?.id,
        type: data?.type,
        tags: data?.tags?.map((tag: { id: string }) => ({ id: tag.id })),
      });
    },
  });
  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      DeleteDevice(rowData || "");
    }
  };

  return (
    <>
      <HeaderPage
        title="Devices"
        onClickAdd={() => {
          setIsOpen(true);
        }}
        textButton="Create device"
      />
      <HeaderTable isOrderTags />
      <CustomTable
        data={DevicesData?.data || []}
        columns={columns}
        paginationData={DevicesData?.meta}
        loading={isLoadingDevices}
        onRowClick={(row: { id: string }) => {
          setIsEdit(true);
          setIsOpen(true);
          setRowData(row?.id);
        }}
      />
      <CustomSheet
        isOpen={isOpen}
        isEdit={isEdit}
        btnText={"Create"}
        handleCloseSheet={handleCloseSheet}
        isLoading={isLoadingCreate || isPendingDelete || isLoadingEdit}
        isLoadingForm={isLoadingDeviceOne}
        headerLeftText={
          isEdit ? (
            <>
              {DeviceOne?.name}{" "}
              <Badge variant={DeviceOne?.in_use ? "success" : "danger"}>
                {DeviceOne?.code}{" "}
              </Badge>
            </>
          ) : (
            "New device "
          )
        }
        form={form}
        onSubmit={onSubmit}
        setModalName={setModalName}
        width="w-[672px]"
      >
        <CreateDevice isEdit={isEdit} />
      </CustomSheet>

      {/* Confirm modal */}
      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={DeviceOne?.name || ""}
        isPending={isPendingDelete}
      />
    </>
  );
};

export default Devices;
