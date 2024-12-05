import CustomCircle from "@/components/ui/custom/CustomCircle";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Input } from "@/components/ui/input";
import useCommonRequests from "@/hooks/useCommonRequests";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import InfoIcon from "@/assets/icons/Info";
import { CreateNewItem } from "./CreateNewItem";
import { AddNewItem } from "./AddNewItem";
import useOrdersHttp from "../queriesHttp/useOrderHttp";

const OrderItems = ({ rowData }: { rowData?: { id: string } }) => {
  const [newItem, setNewItem] = useState<boolean>(false);
  const { taxGroupsSelect, taxGroups } = useCommonRequests({
    getTaxGroups: true,
    getCategories: true,
  });
  const { control, setValue, getValues, watch, trigger } = useFormContext();

  const { remove }: any = useFieldArray({
    control,
    name: "items",
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
      )
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

  const scrollToRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="p-[16px]">
        {/* Create item */}
        <CreateNewItem
          newItem={newItem}
          setNewItem={setNewItem}
          rowData={rowData?.id}
          scollToRef={scrollToRef}
        />
        {/* Order items */}
        <p
          className={`text-[16px] font-bold py-10 border-t ${newItem ? "border-secondary-foreground" : ""
            }`}
        >
          Order items
        </p>

        <div className="grid grid-cols-12 gap-4 font-bold pb-2  mb-[27px]">
          <div>Item code</div>
          <div className="col-span-2">Item name</div>
          <div>Order unit</div>
          <div>Qty ordered</div>
          <div>Qty to deliver</div>
          <div>Price per unit</div>
          <div>Item subtotal</div>
          <div>Tax rate</div>
          <div>Tax value</div>
          <div>Total price</div>
          <div></div>
        </div>
        {watch("items")?.length && (
          <>
            {watch("items")?.map(
              (
                item: {
                  code: string;
                  name: string;
                  unit: string;
                  item_id: string;
                },
                _i: number
              ) => {
                const quantity = +watch(
                  `items.[${_i}].quantity`
                );
                const costItem = +watch(`items.[${_i}].cost`) || 0;
                const invoice_quantity = +watch(`items.[${_i}].invoice_quantity`) || 0;
                console.log(costItem, "costItem");

                const subTotalCost = costItem * invoice_quantity || 0;
                const taxGroupId = watch(`items.[${_i}].tax_group_id`) || 0;
                const taxRate =
                  taxGroups?.find((e: { id: string }) => e.id === taxGroupId)
                    ?.rate || 0;
                const taxAmount = +(subTotalCost * (taxRate / 100)).toFixed(2);
                const totalCost = subTotalCost + taxAmount;

                const updateCosts = () => {
                  setValue(
                    `items.[${_i}].sub_total`,
                    +watch(`items.[${_i}].cost`) *
                    +watch(`items.[${_i}].invoice_quantity`)
                  );
                  setValue(
                    `items.[${_i}].tax_amount`,
                    +watch(`items.[${_i}].cost`) *
                    +watch(`items.[${_i}].invoice_quantity`) *
                    ((taxGroups?.find(
                      (e: { id: string }) =>
                        e.id === watch(`items.[${_i}].tax_group_id`)
                    )?.rate || 0) /
                      100)
                  );
                  setValue(
                    `items.[${_i}].total_cost`,
                    +watch(`items.[${_i}].cost`) *
                    +watch(`items.[${_i}].invoice_quantity`) +
                    +watch(`items.[${_i}].cost`) *
                    +watch(`items.[${_i}].invoice_quantity`) *
                    (taxRate / 100)
                  );
                  calculationSun();
                };

                return (
                  <div className="grid grid-cols-12 gap-4 mb-2" key={_i}>
                    <div>{item?.code}</div>
                    <div className="mb-3 col-span-2">
                      <CustomCircle text={item?.name} />
                    </div>
                    <div className="mb-3">({item?.unit})</div>

                    {/* order Quantity */}
                    <div>{quantity || 0}</div>

                    {/* Quantity */}
                    <div className="flex items-center mb-6">
                      <Input
                        type="number"
                        step={"0.01"}
                        min={0}
                        className="w-[80px]"
                        disabled={watch("status") !== 2}
                        defaultValue={invoice_quantity}
                        onChange={(e) => {
                          setValue(`items.[${_i}].invoice_quantity`, +e.target.value, {
                            shouldDirty: true,
                          });
                          updateCosts();
                        }}
                      />
                    </div>

                    {/* Cost */}
                    <div className="flex items-center mb-6">
                      <Input
                        step={"0.01"}
                        min={0}
                        type="number"
                        className="w-[80px]"
                        textLeft="SAR"
                        disabled={true}
                        defaultValue={costItem}
                      />
                    </div>

                    <div>SAR {subTotalCost.toFixed(2)}</div>

                    {/* Tax Group */}
                    <div>
                      <CustomSelect
                        width="w-[80px]"
                        options={taxGroupsSelect}
                        disabled={true}
                        value={taxGroupId}
                        optionDefaultLabel="Select Tax"
                      />
                    </div>

                    <div>
                      {taxGroupId ? `SAR ${taxAmount.toFixed(2)}` : "SAR 00.00"}
                    </div>

                    <div>SAR {totalCost.toFixed(2)}</div>
                  </div>
                );
              }
            )}
          </>
        )}

        {/* New items */}

        {watch("status") == 2 && (
          <AddNewItem
            setNewItem={setNewItem}
            rowData={rowData?.id}
            scollToRef={scrollToRef}
          />
        )}
      </div>
    </>
  );
};

export default OrderItems;
