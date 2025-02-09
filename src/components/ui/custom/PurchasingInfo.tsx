import { UseFieldArrayRemove, useFormContext } from "react-hook-form";
import { FormItem, FormLabel } from "../form";
import { Input } from "../input";
import { Switch } from "../switch";
import CustomSelect from "./CustomSelect";
import useCommonRequests from "@/hooks/useCommonRequests";
import { UnitOptions } from "@/constants/dropdownconstants";
import { Button } from "../button";

const PurchasingInfo = ({
  index,
  remove,
  count,
  isEdit,
  fromBatch = false,
}: {
  index: number;
  remove: UseFieldArrayRemove;

  count: number;
  isEdit: boolean;
  fromBatch?: boolean;
}) => {
  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();
  const { SuppliersSelect, taxGroupsSelect, isSuppliersLoading } =
    useCommonRequests({
      getSuppliers: true,
      getTaxGroups: true,
    });

  const findIsMainIndex = watch(`suppliers`).findIndex((e: any) => e.is_main);

  const calculateStockCount = () => {
    const supplierMain = watch("suppliers")?.find(
      (supplier: { is_main: number }) => supplier?.is_main == 1
    );

    const packUnit = fromBatch
      ? getValues("storage_unit")
      : supplierMain?.pack_unit;
    const packSize = supplierMain?.pack_size;
    const packPerCase = supplierMain?.pack_per_case;

    if (packUnit) {
      if (!fromBatch) {
        setValue(`stock_counts.[0].pack_unit`, packUnit);
        setValue(`stock_counts.[0].show_as`, packUnit);
        setValue(
          `stock_counts.[0].use_report`,
          getValues(`stock_counts.[0].use_report`) == 0 ? 0 : 1
        );
        setValue(
          `stock_counts.[0].count`,
          getValues(`stock_counts.[0].count`) || 1
        );
        setValue(
          `stock_counts.[0].checked`,
          getValues(`stock_counts.[0].checked`) || 1
        );
        setValue(`stock_counts.[0].unit`, packUnit);
        setValue(
          `stock_counts.[0].report_preview`,
          (watch(`stock_counts.[0].use_report`) == 1
            ? 1
            : 1 / packSize
          ).toString()
        );
      }
      if (packSize) {
        setValue(`stock_counts.[1].pack_size`, packSize);
        setValue(
          `stock_counts.[1].use_report`,
          getValues(`stock_counts.[1].use_report`) || 0
        );
        setValue(`stock_counts.[1].count`, packSize);
        setValue(
          `stock_counts.[1].checked`,
          getValues(`stock_counts.[1].checked`) || 1
        );
        setValue(`stock_counts.[1].unit`, `Packs (${packSize} ${packUnit})`);

        setValue(
          `stock_counts.[1].report_preview`,
          (watch(`stock_counts.[0].use_report`) == 1
            ? packSize / 1
            : packSize / packSize
          ).toString()
        );
        if (packPerCase) {
          setValue(`stock_counts.[2].pack_per_case`, packPerCase);
          setValue(`stock_counts.[2].use_report`, 0);
          setValue(`stock_counts.[2].count`, packSize * packPerCase);
          setValue(
            `stock_counts.[2].checked`,
            getValues(`stock_counts.[2].checked`) || 1
          );
          setValue(
            `stock_counts.[2].unit`,
            `Cases (${packPerCase} X ${packSize} ${packUnit})`
          );

          setValue(
            `stock_counts.[2].report_preview`,
            (watch(`stock_counts.[0].use_report`) == 1
              ? packPerCase * packSize
              : `${(packPerCase * packSize) / packSize}`
            ).toString()
          );
        }
      }
    }
  };

  // markup calculation
  const supplier = getValues(`suppliers[${index}]`);
  const unitCost =
    ((watch("cost") ?? 0) / watch("storage_to_ingredient")) *
    (supplier.pack_size ?? 1) *
    (supplier.pack_per_case ?? 1);
  const markupCalculation = ((supplier?.cost || 0) - unitCost).toFixed(2);
  const markupPercent =
    unitCost && ((+markupCalculation * 100) / unitCost).toFixed(2);

  return (
    <div className=" bg-popover p-4 rounded-[4px] mb-2">
      <div className="flex gap-x-[48px] flex-wrap items-center">
        <FormItem className="gap-2 items-center mt-2 mb-3">
          <FormLabel htmlFor="Supplier">
            Supplier <span className="text-warn text-[18px]">*</span>
          </FormLabel>
          <CustomSelect
            options={
              fromBatch
                ? SuppliersSelect?.filter((supp) => supp.has_cpu)
                : SuppliersSelect
            }
            width="w-[200px]"
            loading={isSuppliersLoading}
            onValueChange={(e) =>
              setValue(`suppliers[${index}].id`, e, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            value={getValues(`suppliers[${index}].id`)}
          />
        </FormItem>
        <FormItem className=" gap-2 items-center mt-2 mb-3">
          <FormLabel htmlFor="item_supplier_code">
            Supplier code <span className="text-warn text-[18px]">*</span>
          </FormLabel>
          <Input
            id="item_supplier_code"
            className="w-[147px] "
            {...register(`suppliers[${index}].item_supplier_code`)}
          />
        </FormItem>
        <FormItem className=" gap-2 items-center mt-2 mb-3">
          <FormLabel htmlFor="Supplier_specific_name">
            Supplier Specific Name
          </FormLabel>
          <Input
            id="Supplier_specific_name"
            className="w-[147px] "
            {...register(`suppliers[${index}].specific_name`)}
          />
        </FormItem>
      </div>

      <div className="flex gap-x-[48px]">
        <FormItem className="gap-2 items-center mt-2 mb-3">
          <FormLabel htmlFor="size">
            Pack size <span className="text-warn text-[18px]">*</span>
          </FormLabel>
          <div className="flex gap-2">
            <Input
              id="size"
              type="number"
              min={0}
              className="w-[117px] "
              value={getValues(`suppliers[${index}].pack_size`)}
              onChange={(e) => {
                const value = +e.target.value || null;
                setValue(`suppliers[${index}].pack_size`, value, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                if (
                  !getValues(`stock_counts.[1].checked`) &&
                  getValues(`stock_counts`).length === 1
                ) {
                  setValue(`stock_counts.[1].checked`, 1);
                  setValue(`stock_counts.[2].checked`, 1);
                }
                if (!value) {
                  setValue(
                    "stock_counts",
                    getValues("stock_counts").slice(0, 1),
                    {
                      shouldValidate: true,
                      shouldDirty: true,
                    }
                  );
                  setValue(`stock_counts.[0].use_report`, 1, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  return;
                }
                calculateStockCount();
              }}
            />

            <CustomSelect
              width="w-[75px]"
              options={UnitOptions}
              disabled={
                fromBatch
                  ? true
                  : (findIsMainIndex !== index && findIsMainIndex !== -1) ||
                    isEdit
              }
              optionDefaultLabel="Unit"
              onValueChange={(e) => {
                setValue(
                  "suppliers",
                  getValues("suppliers").map((supplier: any, index: number) => {
                    return {
                      ...supplier,
                      pack_unit: e === "null" ? "" : e,
                    };
                  }),
                  { shouldValidate: true, shouldDirty: true }
                );
                if (e === "null") {
                  setValue(`stock_counts`, [], {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  return;
                }

                calculateStockCount();
              }}
              value={
                fromBatch
                  ? getValues("storage_unit")
                  : getValues(`suppliers[${index}].pack_unit`)
              }
            />
          </div>
        </FormItem>
        <FormItem className="gap-2 items-center mt-2 mb-3">
          <FormLabel htmlFor="Pack">Pack per case</FormLabel>
          <Input
            id="Pack"
            type="number"
            min={2}
            className="w-[147px] "
            value={getValues(`suppliers[${index}].pack_per_case`) || ""}
            onChange={(e) => {
              const value = +e.target.value || null;
              setValue(`suppliers[${index}].pack_per_case`, value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              if (!value) {
                setValue(
                  "stock_counts",
                  getValues("stock_counts").slice(0, 2),
                  {
                    shouldValidate: true,
                    shouldDirty: true,
                  }
                );
                return;
              }
              if (
                !getValues(`stock_counts.[2].checked`) &&
                getValues(`stock_counts`).length === 2
              ) {
                setValue(`stock_counts.[2].checked`, 1);
              }
              calculateStockCount();
            }}
          />
        </FormItem>
      </div>

      <div className="flex items-center gap-x-[48px]">
        <FormItem className="gap-2 items-center mt-2 mb-3">
          <FormLabel htmlFor="cost">
            Pack (ex. tax) <span className="text-warn text-[18px]">*</span>
          </FormLabel>
          <div className="flex gap-2">
            <Input
              id="cost"
              type="number"
              step=".01"
              textLeft="SAR"
              min={0}
              value={getValues(`suppliers[${index}].cost`)}
              className="w-[117px]"
              onChange={(e) => {
                const value = +e.target.value;
                setValue(`suppliers[${index}].cost`, value, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            />

            <CustomSelect
              width="w-[75px]"
              options={taxGroupsSelect}
              onValueChange={(e) =>
                setValue(`suppliers[${index}].tax_group_id`, e, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              value={getValues(`suppliers[${index}].tax_group_id`)}
            />
          </div>
        </FormItem>
        {fromBatch &&
          supplier?.cost > 0 &&
          !isNaN(Number(markupCalculation)) &&
          isFinite(Number(markupCalculation)) && (
            <div>
              <h4 className="font-semibold">Markup</h4>
              {+markupCalculation > 0 ? (
                <span>
                  SAR {markupCalculation} ({markupPercent}%)
                </span>
              ) : (
                <div className="text-warn text-xs">
                  <p>Price is lower than cost</p>
                  (-SAR {Math.abs(+markupCalculation)} /{" "}
                  {Math.abs(+markupPercent)}%)
                </div>
              )}
            </div>
          )}
      </div>

      <FormItem className="flex items-center gap-3 mt-[15px]">
        <Switch
          defaultChecked={!!getValues(`suppliers[${index}].is_main`)}
          disabled={
            (findIsMainIndex !== index && findIsMainIndex !== -1) ||
            (getValues("suppliers")?.length === 1 &&
              getValues("suppliers.[0].is_main"))
          }
          onCheckedChange={(checked) => {
            setValue(`suppliers[${index}].is_main`, +checked, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
            if (checked) {
              calculateStockCount();
            }
          }}
        />
        <FormLabel>use as main supplier</FormLabel>
      </FormItem>

      {fromBatch ? (
        <div className="text-right w-full">
          <Button
            className="border border-warn bg-transparent text-warn font-semibold"
            variant="outline"
            onClick={() => {
              remove(index);
              setValue(
                "stock_counts",

                [
                  getValues("stock_counts.0"),
                  ...getValues("stock_counts")
                    .slice(1)
                    .map((stock: any, index: number) => {
                      return {
                        ...stock,
                        unit:
                          "Packs (" +
                          getValues(`stock_counts.${index}.report_preview`) +
                          getValues("storage_unit") +
                          ")",
                      };
                    }),
                ],
                { shouldValidate: true, shouldDirty: true }
              );
            }}
          >
            Remove
          </Button>
        </div>
      ) : (
        count > 1 &&
        !watch(`suppliers[${index}].is_main`) && (
          <div className="text-right w-full">
            <Button
              className="border border-warn bg-transparent text-warn font-semibold"
              variant="outline"
              onClick={() => {
                remove(index);
              }}
            >
              Remove
            </Button>
          </div>
        )
      )}
    </div>
  );
};

export default PurchasingInfo;
