import { useState } from "react";
import { IItemsList } from "../types/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formItemSchema } from "../schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useItemsHttp from "./useItemsHttp";
import { TypeOptions } from "@/constants/dropdownconstants";

const useItems = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modalName, setModalName] = useState("");
  const [rowData, setRowData] = useState<IItemsList>();

  const defaultValues = {
    name: "",
    category_id: "",
    type: TypeOptions[0].value,
    exclude_product_from_gp: false,
    suppliers: [
      {
        id: "",
        item_supplier_code: "",
        specific_name: null,
        // pack_size: 0,
        pack_unit: "",
        // pack_per_case: 0,
        // cost: 0,
        tax_group_id: "",
        is_main: 1,
      },
    ],
    branches: [],
    storage_areas: [],
    stock_counts: [],
  };

  const handleCloseSheet = () => {
    setModalName("");
    setIsOpen(false);
    setIsEdit(false);
    setRowData(undefined);
    form.reset(defaultValues);
  };

  const {
    CreateItem,
    itemsData,
    isPending,
    mutateEdit,
    mutateDelete,
    ItemsExport,
    isPendingEdit,

    isPendingDelete,
    isItemsLoading,
    isItemLoading,
    isPendingExport,
  } = useItemsHttp({
    itemId: rowData?.id || "",
    handleCloseSheet,
    setFromItem: (data: any) => {
      const newDataFormat = {
        name: data?.name,
        type: data?.type,
        category_id: data?.category_id,
        exclude_product_from_gp: !!data?.exclude_product_from_gp,
        suppliers: data?.suppliers?.map((s: any) => ({
          id: s?.id,
          item_supplier_code: s?.pivot?.item_supplier_code,
          specific_name: s?.pivot?.specific_name,
          pack_size: s?.pivot?.pack_size,
          pack_unit: s?.pivot?.pack_unit,
          pack_per_case: s?.pivot?.pack_per_case || null,
          cost: s?.pivot?.cost,
          tax_group_id: s?.pivot?.tax_group_id,
          is_main: s?.pivot?.is_main,
        })),
        branches: data?.branches?.map((b: any) => ({
          id: b?.id,
        })),
        stock_counts: data?.stock_counts?.map((b: any) => ({
          show_as: b?.show_as,
          report_preview: b?.report_preview,
          use_report: b?.use_report,
          count: b?.count,
          checked: b?.checked,
          unit: b.unit,
          pack_unit: data?.suppliers?.map((s: any) => s?.pivot?.pack_unit)?.[0],
          pack_size: data?.suppliers?.map((s: any) => s?.pivot?.pack_size)?.[0],
          pack_per_case: data?.suppliers?.map(
            (s: any) => s?.pivot?.pack_per_case
          )?.[0],
        })),
        storage_areas: data?.storage_areas?.map((b: any) => b?.id),
      };
      form.reset(newDataFormat);
    },
  });

  const form = useForm<z.infer<typeof formItemSchema>>({
    resolver: zodResolver(formItemSchema),
    defaultValues,
  });

  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      mutateDelete(rowData?.id || "");
    }
  };

  const onSubmit = (values: z.infer<typeof formItemSchema>) => {
    if (isEdit) {
      mutateEdit({ id: rowData?.id || "", values });
      return;
    }
    CreateItem(values);
  };

  return {
    //state
    isOpen,
    isEdit,
    modalName,
    itemName: rowData?.name || "",
    setIsOpen,
    setIsEdit,
    setRowData,
    setModalName,
    ItemsExport,

    // functions
    handleCloseSheet,
    handleConfirm,
    onSubmit,

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
  };
};

export default useItems;
