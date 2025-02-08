import React, { useRef } from "react";
import { TypeOptions, UnitOptions } from "@/constants/dropdownconstants";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import useCommonRequests from "@/hooks/useCommonRequests";
import { IItem } from "../types/types";
import useReceiveOrdersHttp from "../queriesHttp/useReceiveOrdersHttp";
import AuthPermission from "@/guards/AuthPermission";
import { PERMISSIONS } from "@/constants/constants";
export const CreateNewItem = ({
  newItem,
  setNewItem,
  rowData,
  scollToRef,
}: {
  newItem: boolean;
  setNewItem: React.Dispatch<React.SetStateAction<boolean>>;
  rowData?: string;
  scollToRef?: React.RefObject<HTMLDivElement>;
}) => {
  const { filterObj } = useFilterQuery();
  const { setValue, watch, getValues, register, control, trigger } =
    useFormContext();
  const { append }: any = useFieldArray({
    control,
    name: "items",
  });
  const itemNew = watch("itemNew");
  const { taxGroupsSelect, taxGroups, CategoriesSelect } = useCommonRequests({
    getTaxGroups: true,
    getCategories: true,
  });
  const calculationSun = () => {
    setValue(
      "sub_total",
      watch("items").reduce(
        (acc: number, curr: { sub_total: number }) => acc + +curr?.sub_total,
        0
      ),
      { shouldValidate: true }
    );
    setValue(
      "total_tax",
      watch("items").reduce(
        (acc: number, curr: { tax_amount: number }) => acc + +curr?.tax_amount,
        0
      ),
      { shouldValidate: true }
    );
    setValue(
      "sub_total",
      watch("items").reduce(
        (acc: number, curr: { sub_total: number }) => acc + +curr?.sub_total,
        0
      ),
      { shouldValidate: true }
    );
    setValue("total_cost", watch("sub_total") + watch("total_tax"), {
      shouldValidate: true,
    });
    trigger("total");
  };

  const CheckCreditNotesValidtion = (ItemIndex: number) => {
    let itemId = watch(`items.${ItemIndex}.item_id`);
    let invoiceQuantity = watch(`items.${ItemIndex}.invoice_quantity`);
    let originalQuantity = watch(`items.${ItemIndex}.quantity`);
    let cost = watch(`items.${ItemIndex}.cost`);
    let orderCost = watch(`items.${ItemIndex}.order_cost`);
    let name = watch(`items.${ItemIndex}.name`);
    let code = watch(`items.${ItemIndex}.code`);
    let order_unit = watch(`items.${ItemIndex}.unit`);
    let tax_rate =
      (watch(`items.[${ItemIndex}].tax_group_id`) == null
        ? 0
        : taxGroups?.find(
          (e: { id: string }) =>
            e.id === watch(`items.[${ItemIndex}].tax_group_id`)
        )?.rate) / 100;
    let tax_amount =
      tax_rate *
      (+watch(`items.${ItemIndex}.cost`) *
        (+watch(`items.[${ItemIndex}].quantity`) -
          +watch(`items.${ItemIndex}.invoice_quantity`))) || 0;

    let tax_amount_price =
      +tax_rate *
      (+watch(`items.${ItemIndex}.cost`) -
        +watch(`items.[${ItemIndex}].order_cost`)) *
      +watch(`items.${ItemIndex}.quantity`) || 0;

    let total_credit =
      (+watch(`items.[${ItemIndex}].quantity`) -
        +watch(`items.[${ItemIndex}].invoice_quantity`)) *
      +watch(`items.${ItemIndex}.cost`);

    let total_credit_price =
      (+watch(`items.[${ItemIndex}].cost`) -
        +watch(`items.[${ItemIndex}].order_cost`)) *
      +watch(`items.[${ItemIndex}].quantity`);

    let creditNotes = watch("credit_notes") || [];
    let creditNotesPrice = watch("credit_notes_price") || [];

    let addCreditNote = (type: string, additionalFields = {}) => {
      let noteIndex = creditNotes.findIndex(
        (note: { id: string; type: string }) =>
          note.id === itemId && note.type === type
      );

      if (noteIndex === -1) {
        setValue(`credit_notes.${creditNotes.length}`, {
          id: itemId,
          type,
          ...additionalFields,
        });
      } else {
        let updatedNote = { ...creditNotes[noteIndex], ...additionalFields };
        setValue(`credit_notes.${noteIndex}`, updatedNote);
      }
    };
    let addCreditNotePrice = (type: string, additionalFields = {}) => {
      let noteIndex = creditNotesPrice.findIndex(
        (note: { id: string; type: string }) =>
          note.id === itemId && note.type === type
      );

      if (noteIndex === -1) {
        setValue(`credit_notes_price.${creditNotesPrice.length}`, {
          id: itemId,
          type,
          ...additionalFields,
        });
      } else {
        let updatedNote = {
          ...creditNotesPrice[noteIndex],
          ...additionalFields,
        };
        setValue(`credit_notes_price.${noteIndex}`, updatedNote);
      }
    };

    if (invoiceQuantity !== originalQuantity) {
      addCreditNote("quantity", {
        invoice_quantity: invoiceQuantity,
        quantity: originalQuantity,
        name: name,
        cost,
        code,
        order_cost: orderCost,
        order_unit,
        tax_rate,
        tax_amount,
        total_credit,
      });
    } else {
      // debugger;

      let filteredNotes = creditNotes.filter(
        (note: { id: string; type: string }) =>
          !(note.id === itemId && note.type === "quantity")
      );
      setValue("credit_notes", filteredNotes);
    }

    if (cost !== orderCost && watch(`accept_price_change_from_supplier`) == 0) {
      addCreditNotePrice("price", {
        invoice_quantity: invoiceQuantity,
        quantity: originalQuantity,
        cost,
        order_cost: orderCost,
        name: name,
        code,
        order_unit,
        tax_rate,
        tax_amount_price,
        total_credit_price,
      });
    } else {
      let filteredNotes = creditNotesPrice.filter(
        (note: { id: string; type: string }) =>
          !(note.id === itemId && note.type === "price")
      );
      setValue("credit_notes_price", filteredNotes);
    }
  };
  const handleAppend = (data: { data: { data: IItem } }) => {
    append({
      item_id: data?.data?.data?.id,
      code: watch("itemNew")?.code,
      name: watch("itemNew")?.name,
      unit: data?.data?.data?.stock_counts?.[
        data?.data?.data?.stock_counts?.length - 1
      ]?.unit,
      quantity: +watch("itemNew")?.quantity,
      invoice_quantity: +watch("itemNew")?.invoice_quantity,
      cost: +watch("itemNew")?.cost || 0,
      order_cost: +watch("itemNew")?.cost || 0,
      price_per_unit: +watch("itemNew")?.cost || 0,
      tax_group_id: watch("itemNew")?.tax_group_id,
      pack_size: +watch("itemNew")?.pack_size || 0,
      pack_per_case: +watch("itemNew")?.pack_per_case || 0,
      sub_total: +watch(`itemNew.cost`) * +watch(`itemNew.invoice_quantity`),
      tax_amount:
        +(
          (taxGroups?.find(
            (e: { id: string }) => e.id === watch(`itemNew.tax_group_id`)
          )?.rate /
            100) *
          (+watch(`itemNew.cost`) * +watch(`itemNew.invoice_quantity`))
        ).toFixed(2) || 0,
      total_cost:
        +watch(`itemNew.cost`) * +watch(`itemNew.invoice_quantity`) +
        (+(
          (taxGroups?.find(
            (e: { id: string }) => e.id === watch(`itemNew.tax_group_id`)
          )?.rate /
            100) *
          (+watch(`itemNew.cost`) * +watch(`itemNew.invoice_quantity`))
        ).toFixed(2) || 0),
        supplier_item_id: data?.data?.data?.supplier_item_id||"",
    });
    calculationSun();
    setNewItem(false);
    CheckCreditNotesValidtion(watch("items").length - 1);
    setValue("itemNew", {});
  };
  const { CreateItem, receiveOrder, isLoadingCreateItem } =
    useReceiveOrdersHttp({
      orderId: rowData,
      handleAppend: handleAppend,
    });
  const isValid =
    itemNew &&
    Object.keys(itemNew).every((key) => {
      if (key === "pack_per_case") return true;
      const value = itemNew[key];

      return value !== undefined && value !== "";
    });

  console.log(getValues("supplier_id"), "rowData");

  return (
    <div ref={scollToRef}>
      {newItem && (
        <div className="my-[44px] flex justify-center items-center">
          <div>
            <p className="text-[20px] text-textPrimary">Add new item</p>
            <p className="text-[14px] text-gray pb-[16px]">
              Fill all fields to add this item to dot
            </p>
            <div className=" flex gap-[16px]  items-center">
              <Input
                label="Item name"
                className="w-[283px]"
                {...register("itemNew.name")}
                required
              />
              <CustomSelect
                options={TypeOptions}
                label="Item Type"
                onValueChange={(e) => setValue("itemNew.type", e)}
                value={getValues("itemNew.type")}
                optionDefaultLabel="Choose one"
                width="w-[283px]"
              />
              <div className="flex items-center ">
                <Input
                  required
                  label="Pack size"
                  className="w-[67px]"
                  {...register("itemNew.pack_size")}
                />
                <CustomSelect
                  onValueChange={(e) => {
                    setValue("itemNew.pack_unit", e);
                  }}
                  value={getValues("itemNew.pack_unit")}
                  optionDefaultLabel="Unit"
                  options={UnitOptions}
                  width="w-[67px] mt-[45px] ml-[10px]"
                />
              </div>
              <Input
                label="Pack per case "
                className="w-[142px]"
                {...register("itemNew.pack_per_case")}
              />
              <Input
                label="Invoice qty"
                required
                className="w-[142px]"
                {...register("itemNew.invoice_quantity")}
              />
            </div>
            <div className=" flex gap-[16px] items-center">
              <Input
                label="Item code"
                className="w-[283px]"
                required
                {...register("itemNew.code")}
              />
              <CustomSelect
                required
                options={CategoriesSelect}
                label="Item category"
                value={getValues("itemNew.category_id")}
                onValueChange={(e) => {
                  setValue("itemNew.category_id", e);
                }}
                width="w-[283px]"
              />

              <Input
                required
                label="Item price"
                className="w-[142px]"
                textLeft="SAR"
                {...register("itemNew.cost")}
              />

              <CustomSelect
                required
                options={taxGroupsSelect}
                label="Tax rate"
                value={getValues("itemNew.tax_group_id")}
                onValueChange={(e) => {
                  setValue("itemNew.tax_group_id", e);
                }}
                width="w-[142px]"
              />

              <Input
                label="Recieved qty"
                required
                className="w-[142px]"
                {...register("itemNew.quantity")}
              />
            </div>
            

            
            <div className="flex pt-[16px] ml-[875px] ">
              <Button
                type="button"
                className="border-gray-400 border-[1px] text-text-textPrimary bg-[#EAF2F7] mx-[8px]"
                onClick={() => {
                  setNewItem(false);
                  setValue("itemNew", {});
                }}
              >
                Cancel
              </Button>{" "}
              <Button
                type="button"
                variant="default"
                loading={isLoadingCreateItem}
                disabled={!isValid}
                onClick={() => {
                  console.log(receiveOrder);

                  setValue(
                    "total_tax",

                    watch("items")?.reduce(
                      (acc: number, curr: { tax_amount: number }) =>
                        acc + +curr?.tax_amount,
                      0
                    )
                  );
                  setValue(
                    "sub_total",

                    watch("items")?.reduce(
                      (acc: number, curr: { sub_total: number }) =>
                        acc + +curr?.sub_total,
                      0
                    )
                  );
                  CreateItem({
                    name: watch("itemNew")?.name,
                    type: watch("itemNew")?.type,
                    category_id: watch("itemNew")?.category_id,
                    branches: [{ id: filterObj["filter[branch]"] }],
                    suppliers: [
                      {
                        id: getValues("supplier_id"),
                        item_supplier_code: watch("itemNew")?.code,
                        specific_name: watch("itemNew")?.specific_name,
                        pack_size: watch("itemNew")?.pack_size || 0,
                        pack_unit: watch("itemNew")?.pack_unit,
                        pack_per_case: watch("itemNew")?.pack_per_case || null,
                        cost: watch("itemNew")?.cost || 0,
                        tax_group_id: watch("itemNew")?.tax_group_id,
                        is_main: 1,
                      },
                    ],
                    stock_counts: watch("itemNew")?.pack_per_case
                      ? [
                        {
                          pack_unit: watch("itemNew")?.pack_unit,
                          count: 1,
                          checked: true,
                          report_preview: "1",
                          show_as: watch("itemNew")?.pack_unit,
                          use_report: 1,
                          unit: watch("itemNew")?.pack_unit,
                        },
                        {
                          count: +watch("itemNew")?.pack_size,
                          checked: true,
                          report_preview: watch("itemNew")?.pack_size,
                          use_report: 0,
                          unit: `Packs ( ${watch("itemNew")?.pack_size +
                            watch("itemNew")?.pack_unit
                            } )`,
                        },
                        {
                          count:
                            +watch("itemNew")?.pack_size *
                            +watch("itemNew")?.pack_per_case,
                          checked: true,
                          report_preview: (
                            watch("itemNew")?.pack_size *
                            watch("itemNew")?.pack_per_case
                          ).toString(),
                          use_report: 0,
                          unit: `Cases (${watch("itemNew")?.pack_per_case
                            } X ${watch("itemNew")?.pack_size}  ${watch("itemNew")?.pack_unit
                            })`,
                        },
                      ]
                      : [
                        {
                          pack_unit: watch("itemNew")?.pack_unit,
                          count: 1,
                          checked: true,
                          report_preview: "1",
                          show_as: watch("itemNew")?.pack_unit,
                          use_report: 1,
                          unit: watch("itemNew")?.pack_unit,
                        },
                        {
                          count: +watch("itemNew")?.pack_size,
                          checked: true,
                          report_preview: watch("itemNew")?.pack_size,
                          use_report: 0,
                          unit: `Packs ( ${watch("itemNew")?.pack_size +
                            watch("itemNew")?.pack_unit
                            } )`,
                        },
                      ],
                    exclude_product_from_gp:
                      watch("itemNew")?.exclude_product_from_gp || false,
                  });
                }}
              >
                Add Item
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
