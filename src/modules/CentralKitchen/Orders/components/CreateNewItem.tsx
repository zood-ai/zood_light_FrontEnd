import React, { useRef } from "react";
import { TypeOptions, UnitOptions } from "@/constants/dropdownconstants";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import useCommonRequests from "@/hooks/useCommonRequests";
import useOrdersHttp from "../queriesHttp/useOrderHttp";
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

  const handleAppend = (data: { data: { data: any } }) => {
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
      pack_size: +watch("itemNew")?.pack_size || 0,
      pack_per_case: +watch("itemNew")?.pack_per_case || null,
      price_per_unit: +watch("itemNew")?.cost || 0,
      tax_group_id: watch("itemNew")?.tax_group_id,

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
    });
    calculationSun();
    setNewItem(false);
    setValue("itemNew", {});
  };
  const { CreateItem, OrderOne, isLoadingCreateItem } = useOrdersHttp({
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
                    branches: [{ id: OrderOne?.branch },
                    { id: OrderOne?.branch_cpu_id }],
                    suppliers: [
                      {
                        id: OrderOne?.supplier_id,
                        item_supplier_code: watch("itemNew")?.code,
                        specific_name: watch("itemNew")?.specific_name,
                        pack_size: +watch("itemNew")?.pack_size || 0,
                        pack_unit: watch("itemNew")?.pack_unit,
                        pack_per_case: +watch("itemNew")?.pack_per_case || null,
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
