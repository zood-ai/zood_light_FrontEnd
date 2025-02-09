import { useForm } from "react-hook-form";
import useStorageAreasHttp from "./useStorageAreasHttp";
import { z } from "zod";
import { formStorageareaSchema } from "../schema/Schema";
import { IStorageAreaList } from "../types/types";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

const useStorageAreas = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modalName, setModalName] = useState("");
  const [rowData, setRowData] = useState<IStorageAreaList>();

  const form = useForm<z.infer<typeof formStorageareaSchema>>({
    resolver: zodResolver(formStorageareaSchema),
    defaultValues: {
      names: "",
      branches: [],
    },
  });

  // for a confirmation modal of sheet
  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      // handle delete
      mutateDelete(rowData?.id || "");
    }
  };

  const handleCloseSheet = () => {
    setModalName("");
    setIsOpen(false);
    setIsEdit(false);
    setRowData(undefined);
    form.reset({ names: "", branches: [] });
  };

  const {
    CreateStorageArea,
    mutateDelete,
    mutateEdit,
    storageAreasData,
    isLoadingStorageAreas,
    loadingCreate,
    isPendingEdit,
    isPendingDelete,
  } = useStorageAreasHttp({ handleCloseSheet });

  // for submit form
  const onSubmit = (values: z.infer<typeof formStorageareaSchema>) => {
    if (isEdit) {
      mutateEdit({
        name: values?.names || "",
        id: rowData?.id || "",
      });
      return;
    }
    CreateStorageArea(values);
  };

  // for set form values when click on row in table
  useEffect(() => {
    if (Object.keys(rowData || {}).length) {
      form.reset({
        names: rowData?.name || "",
        branches: [{ id: rowData?.branch_name || "" }],
      });
    }
  }, [Object.keys(rowData || {}).length, form]);
  return {
    setIsOpen,
    setRowData,
    setIsEdit,
    isOpen,
    isEdit,
    handleCloseSheet,
    form,
    onSubmit,
    setModalName,
    loadingCreate,
    isLoadingStorageAreas,
    isPendingEdit,
    modalName,
    handleConfirm,
    StorageName: rowData?.name || "",
    StorageAreasData: storageAreasData,
    isPendingDelete,
  };
};

export default useStorageAreas;
