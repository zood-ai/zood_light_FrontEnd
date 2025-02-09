import ClearIcon from "@/assets/icons/Clear";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UnitOptions } from "@/constants/dropdownconstants";
import useCommonRequests from "@/hooks/useCommonRequests";
import { UseFieldArrayRemove, useFormContext } from "react-hook-form";

interface IingredientFields {
  index: number;
  remove: UseFieldArrayRemove;
  count: number;
}
const IngredientFields = ({ index, remove, count }: IingredientFields) => {
  const { setValue, getValues, watch } = useFormContext();

  const { ingredientsSelect, isIngredientsLoading } = useCommonRequests({
    getIngredients: true,
  });

  const filtredIngredients = getValues(`ingredient`)?.filter(
    (_: { id: string }, i: number) => i !== index
  );

  const filtredIngredientsSelect = ingredientsSelect?.filter(
    (ing: { value: string; label: string }) =>
      filtredIngredients?.findIndex(
        (i: { id: string }) => i.id === ing.value
      ) === -1
  );

  return (
    <div className="flex gap-2 items-center">
      <div className="flex gap-2 items-center">
        <FormItem className=" gap-2 items-center mt-2 mb-3">
          {index == 0 && (
            <FormLabel htmlFor="name" className="font-bold">
              Ingerdient
            </FormLabel>
          )}

          <CustomSelect
            width="w-[252px] "
            placeHolder="Choose an ingredient or batch"
            options={filtredIngredientsSelect}
            loading={isIngredientsLoading}
            onValueChange={(e) => {
              setValue(`ingredient[${index}].id`, e, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            value={getValues(`ingredient[${index}].id`)}
            optionDefaultLabel="Choose an ingredient or batch"
          />
        </FormItem>
        <FormItem className=" gap-2 items-center mt-2 mb-3">
          {index == 0 && (
            <FormLabel htmlFor="name" className="font-bold">
              Qty
            </FormLabel>
          )}

          <div className="flex gap-1">
            <Input
              id="quantity"
              className="w-[91px]"
              disabled={!watch(`ingredient[${index}].id`)}
              type="number"
              step={"0.01"}
              value={watch(`ingredient[${index}].quantity`)}
              onChange={(e) => {
                setValue(`ingredient[${index}].quantity`, +e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                setValue(
                  `ingredient[${index}].cost`,
                  watch(`ingredient[${index}].quantity`) *
                    ingredientsSelect?.find(
                      (i: any) =>
                        i.value === getValues(`ingredient[${index}].id`)
                    )?.cost || 0
                );
                setValue(
                  "cost",
                  watch("ingredient").reduce(
                    (acc: number, curr: { cost: number }) =>
                      acc + (curr?.cost || 0),
                    0
                  )
                );
              }}
            />
            <CustomSelect
              width="w-[93px]"
              options={UnitOptions}
              value={
                ingredientsSelect?.find(
                  (i: any) => i.value === getValues(`ingredient[${index}].id`)
                )?.pack_unit
              }
              disabled
            />
          </div>
        </FormItem>
        <FormItem className=" gap-2 items-center mt-2 mb-3">
          {index == 0 && (
            <FormLabel htmlFor="name" className="font-bold">
              cost
            </FormLabel>
          )}

          <Input
            id="name"
            placeholder="SAR 0.00"
            className="w-[93px]"
            readOnly
            value={
              watch(`ingredient[${index}].quantity`) *
                ingredientsSelect?.find(
                  (i: any) => i.value === getValues(`ingredient[${index}].id`)
                )?.cost || "-"
            }
          />
        </FormItem>
      </div>

      {getValues(`ingredient[${index}].id`) && (
        <ClearIcon
          className={`${index === 0 && "mt-4"} ml-[16px]`}
          onClick={() => {
            if (count === 1) {
              setValue("ingredient", [{ id: "", quantity: 0, cost: 0 }], {
                shouldValidate: true,
                shouldDirty: true,
              });
              setValue(
                "cost",
                watch("ingredient").reduce(
                  (acc: number, curr: { cost: number }) =>
                    acc + (curr?.cost || 0),
                  0
                )
              );
            } else {
              remove(index);
              setValue(
                "cost",
                watch("ingredient").reduce(
                  (acc: number, curr: { cost: number }) =>
                    acc + (curr?.cost || 0),
                  0
                )
              );
            }
          }}
        />
      )}
    </div>
  );
};

export default IngredientFields;
