import React, { useEffect, useState, useCallback } from "react";
import FolderIcon from "@/assets/icons/Folder";
import { FormItem, FormLabel } from "../../../../components/ui/form";
import { useFieldArray, Controller, useFormContext } from "react-hook-form";
import { Input } from "../../../../components/ui/input";
import CustomSelect from "../../../../components/ui/custom/CustomSelect";
import CartIcon from "@/assets/icons/Cart";
import { RecipesTypeOptions } from "@/constants/dropdownconstants";
import { IItem } from "../types/types";
import ClearIcon from "@/assets/icons/Clear";

const RecipeDetailsForm = ({ InventoryItemsSelect }) => {
  const { register, control, setValue, getValues, watch } = useFormContext();
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "items",
  });

  const getFilteredItems = (index) => {
    return getValues("items")?.filter(
      (_: { id: string }, i: number) => i !== index
    );
  };

  const [totalCosts, setTotalCosts] = useState<number[]>([]);

  const handleSelectedItemChange = useCallback(
    (value: string, index: number) => {
      const filtredItemsSelect = InventoryItemsSelect?.filter(
        (item: { value: string; label: string }) =>
          getFilteredItems(index)?.findIndex(
            (i: { id: string }) => i.id === item.value
          ) === -1
      );

      console.log("Selected value:", value);
      if (value === null || value === "" || value === "null") {
        update(index, {
          id: value,
          quantity: 0,
          cost: 0,
        });
        setValue(`items.${index}.unit`, "", {
          shouldDirty: true,
          shouldTouch: true,
        });
      } else {
        if (filtredItemsSelect) {
          const item = filtredItemsSelect.find(
            (item: IItem) => item.value === value
          );

          if (item) {
            update(index, {
              id: item.value,
              quantity: getValues(`items.${index}.quantity`) || 0,
              cost: item.cost,
            });
            setValue(`items.${index}.unit`, item.unit, {
              shouldDirty: true,
              shouldTouch: true,
            });
            console.log(
              "Updated unit for index:",
              index,
              "Unit value:",
              getValues(`items.${index}.unit`)
            );
          }
        }
      }
      updateTotalCosts();
    },
    [InventoryItemsSelect, update, setValue, getValues]
  );

  const handleTypeChange = (value) => {
    setValue("type", value);
    if (value === "Food") {
      setValue("food", 100);
      setValue("beverage", 0);
      setValue("misc", 0);
    } else if (value === "Beverage") {
      setValue("food", 0);
      setValue("beverage", 100);
      setValue("misc", 0);
    } else if (value === "Misc") {
      setValue("food", 0);
      setValue("beverage", 0);
      setValue("misc", 100);
    } else if (value === "Meal") {
      setValue("food", 0);
      setValue("beverage", 0);
      setValue("misc", 0);
    }
  };

  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    setValue(`items[${index}].quantity`, +value);
    updateTotalCosts();
  };

  const updateTotalCosts = () => {
    const updatedTotalCosts = fields.map((field, index) => {
      const item = InventoryItemsSelect?.find(
        (item: IItem) => item.value === getValues(`items.${index}.id`)
      );
      const itemCost = item ? parseFloat(item.cost) : 0;
      const quantity = getValues(`items.${index}.quantity`);
      const totalCost = itemCost * quantity;
      return totalCost;
    });
    setTotalCosts(updatedTotalCosts);
    const totalCostValue = updatedTotalCosts.reduce(
      (acc, cost) => acc + cost,
      0
    );
    setValue("cost", totalCostValue);
  };

  const price = watch("price");
  const totalCostValue = totalCosts.reduce((acc, cost) => acc + cost, 0);
  const grossProfit = price > 0 ? price - totalCostValue : 0 - totalCostValue;
  const grossProfitPercentage =
    price > 0 ? (grossProfit / price) * 100 : (grossProfit / 1) * 100;
  const type = watch("type");

  useEffect(() => {
    updateTotalCosts();
  }, [InventoryItemsSelect, fields, getValues]);

  return (
    <div className="flex flex-col gap-[30px]">
      {/* Recipe details */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
            <FolderIcon />
          </div>
          <h3 className="font-bold text-[16px]">Recipe details</h3>
        </div>

        <div className="">
          <div className="flex items-center gap-10">
            <FormItem className=" gap-2 items-center mt-2 mb-3">
              <FormLabel
                htmlFor="name"
                className="font-semibold text-textPrimary"
              >
                Recipe name
              </FormLabel>
              <Input
                id="name"
                className="w-[200px] "
                placeholder="Enter Name"
                {...register(`name`)}
              />
            </FormItem>
            <FormItem className=" gap-2 items-center mt-2 mb-3">
              <FormLabel
                htmlFor="price"
                className="font-semibold text-textPrimary"
              >
                Sales price (excl.tax)
              </FormLabel>
              <Input
                id="price"
                type="number"
                step="0.01"
                className="w-[200px]"
                placeholder="Enter Price"
                {...register("price", { valueAsNumber: true })}
              />
            </FormItem>
          </div>
          <div className="flex items-center gap-5">
            <FormItem className=" gap-2 items-center mt-2 mb-3">
              <FormLabel
                htmlFor="type"
                className="font-semibold text-textPrimary"
              >
                Recipe type
              </FormLabel>
              <CustomSelect
                width="w-[220px]"
                options={RecipesTypeOptions}
                placeHolder="Choose type"
                value={getValues("type")}
                onValueChange={handleTypeChange}
              />
            </FormItem>
            {type === "Meal" && (
              <div className="flex items-center gap-4">
                <FormItem className=" gap-2 items-center mt-2 mb-3">
                  <FormLabel
                    htmlFor="food"
                    className="font-semibold text-textPrimary"
                  >
                    Food
                  </FormLabel>
                  <Input
                    textRight="%"
                    id="food"
                    className="w-[100px] "
                    {...register("food", { valueAsNumber: true })}
                  />
                </FormItem>
                <FormItem className=" gap-2 items-center mt-2 mb-3">
                  <FormLabel
                    htmlFor="baverage"
                    className="font-semibold text-textPrimary"
                  >
                    Beverage
                  </FormLabel>
                  <Input
                    textRight="%"
                    id="baverage"
                    className="w-[100px] "
                    {...register("beverage", { valueAsNumber: true })}
                  />
                </FormItem>
                <FormItem className=" gap-2 items-center mt-2 mb-3">
                  <FormLabel
                    htmlFor="misc"
                    className="font-semibold text-textPrimary"
                  >
                    Misc
                  </FormLabel>
                  <Input
                    textRight="%"
                    id="misc"
                    className="w-[100px] "
                    {...register("misc", { valueAsNumber: true })}
                  />
                </FormItem>
              </div>
            )}
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <FormLabel
                htmlFor="recipe-cost"
                className="font-semibold text-textPrimary"
              >
                Recipe cost
              </FormLabel>
              <span>SAR {totalCosts.reduce((acc, cost) => acc + cost, 0)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <FormLabel
                htmlFor="gross-profit"
                className="font-semibold text-textPrimary"
              >
                Gross profit
              </FormLabel>
              <span>({grossProfitPercentage.toFixed(2)}%)</span>
              <span>SAR {grossProfit}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Ingredients info */}
      <div>
        {/* header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
            <CartIcon />
          </div>
          <h3 className="font-bold text-[16px]">Ingredients</h3>
        </div>
        {/* content */}
        <div className="bg-popover p-4 rounded-[4px] mb-4">
          {fields.map((item, index) => {
            const filtredItems = getFilteredItems(index);

            const filtredItemsSelect = InventoryItemsSelect?.filter(
              (inventoryItem) =>
                filtredItems?.findIndex((i) => i.id === inventoryItem.value) ===
                -1
            );

            return (
              <div
                key={item.id}
                className="flex gap-x-2 flex-wrap items-center"
              >
                <FormItem className="gap-2 items-center mb-2">
                  {index === 0 && (
                    <FormLabel
                      htmlFor={`items[${index}].id`}
                      className="font-semibold text-textPrimary"
                    >
                      Ingredient
                    </FormLabel>
                  )}
                  <Controller
                    name={`items.${index}.id`}
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        width="w-[240px]"
                        optionDefaultLabel="Choose an Ingredient or Batch"
                        options={filtredItemsSelect || []}
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleSelectedItemChange(value, index);
                        }}
                      />
                    )}
                  />
                </FormItem>
                <FormItem className="gap-2 items-center mb-2">
                  {index === 0 && (
                    <FormLabel
                      htmlFor={`items[${index}].quantity`}
                      className="font-semibold text-textPrimary"
                    >
                      Qty
                    </FormLabel>
                  )}
                  <Input
                    id={`items[${index}].quantity`}
                    className="w-[95px]"
                    value={watch(`items[${index}].quantity`)}
                    type="number"
                    onChange={(e) => handleQuantityChange(e, index)}
                    disabled={!getValues(`items.${index}.id`)}
                  />
                </FormItem>
                <FormItem className="gap-2 items-center mb-2">
                  {index === 0 && (
                    <FormLabel
                      htmlFor={`items[${index}].unit`}
                      className="font-semibold text-textPrimary"
                    >
                      Unit
                    </FormLabel>
                  )}
                  <Input
                    id={`items[${index}].unit`}
                    className="w-[95px] text-[#4e667e] text-sm"
                    {...register(`items.${index}.unit`)}
                    readOnly
                  />
                </FormItem>
                <FormItem className="gap-2 items-center mb-2">
                  {index === 0 && (
                    <FormLabel
                      htmlFor={`items[${index}].cost`}
                      className="font-semibold text-textPrimary"
                    >
                      Cost
                    </FormLabel>
                  )}
                  <Input
                    id={`items[${index}].cost`}
                    className="w-[97px] text-[#4e667e] text-sm"
                    value={
                      totalCosts[index] !== 0
                        ? `SAR  ${totalCosts[index]}`
                        : "-"
                    }
                    {...register(`items.${index}.cost`, {
                      valueAsNumber: true,
                    })}
                    readOnly
                  />
                </FormItem>
                {fields.length > 1 &&
                  (index === 0 ? (
                    <ClearIcon
                      className="mt-3 ml-[16px]"
                      onClick={() => remove(index)}
                    />
                  ) : (
                    <ClearIcon
                      className="mb-2 ml-[16px]"
                      onClick={() => remove(index)}
                    />
                  ))}
              </div>
            );
          })}
          <div
            className={`text-primary text-right mt-2 cursor-pointer select-none ${
              getValues(`items.${fields.length - 1}.id`) &&
              getValues(`items.${fields.length - 1}.quantity`) !== 0
                ? ""
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={() => {
              if (getValues(`items.${fields.length - 1}.id`)) {
                append({ id: "", quantity: 0, cost: 0 });
              }
            }}
          >
            + Add ingredient
          </div>
        </div>
      </div>
      {/* POS IDs */}
      {/* <div> */}
      {/* header */}
      {/* <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
            <FolderIcon />
          </div>
          <h3 className="font-bold text-[16px]">POS IDs</h3>
        </div> */}
      {/* content */}

      {/* <div className=" bg-popover p-4 rounded-[4px]">
          <p className="text-textPrimary mb-4">
            No POS IDs are assigned to this Recipe.
          </p>
          <div className="flex gap-x-1 flex-wrap items-center">
            <FormItem className="flex flex-col gap-3">
              <FormLabel
                htmlFor="Ingerdient"
                className="text-textPrimary font-bold "
              >
                Unassigned POS IDs
              </FormLabel>

              <div className="flex gap-3">
                <CustomSelect
                  {...register(`Ingerdient`)}
                  placeHolder="Choose category"
                  options={[{ label: "main Category", value: "1" }]}
                  onValueChange={() => console.log("bh")}
                />
                <Button className="h-[30px]">Assign</Button>
              </div>
            </FormItem>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default RecipeDetailsForm;
