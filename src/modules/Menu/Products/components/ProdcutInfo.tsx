import { Button } from "@/components/ui/button";
import CustomFileImage from "@/components/ui/custom/CustomFileImage";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCommonRequests from "@/hooks/useCommonRequests";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const ProdcutInfo = () => {
  const { setValue, getValues, register } = useFormContext();
  const {
    skuNumber,
    isFetchingSku,
    refetchSku,
    taxGroupsSelect,
    istaxGroupsLoading,
    CategoriesSelect,
    isCategoriesLoading,
  } = useCommonRequests({
    getSku: !getValues("sku"),
    getTaxGroups: true,
    getCategories: true,
    fromMenu: true,
  });

  useEffect(() => {
    if (skuNumber) {
      setValue("sku", getValues("sku") || skuNumber, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [skuNumber]);

  return (
    <div className="px-5 pt-5">
      <h1 className="text-textPrimary text-[20px] font-bold mb-6">
        Product info
      </h1>
      <CustomFileImage fileParam="image" defaultValue={getValues("image")} />
      <div className="flex gap-4 mt-6">
        <div className="flex gap-2 flex-col">
          <Label htmlFor="name">Name</Label>
          <Input
            placeholder="Prodcut name"
            id="name"
            {...register("name")}
            className="w-[290px]"
          />
        </div>
        <div className="flex gap-2 flex-col">
          <Label htmlFor="name_localized">Name localized</Label>
          <Input
            placeholder="Name localized"
            id="name_localized"
            className="w-[290px]"
            {...register("name_localized")}
          />
        </div>
      </div>
      <div className="mt-5 flex items-end justify-between">
        <div className="flex gap-2 flex-col">
          <div className="flex gap-2 flex-col">
            <Label htmlFor="name_localized">Category</Label>
            <CustomSelect
              options={CategoriesSelect}
              width="w-[290px]"
              value={getValues("category_id")}
              onValueChange={(value) => {
                setValue("category_id", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              optionDefaultLabel="Choose category"
              loading={isCategoriesLoading}
            />
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-end justify-between">
        <div className="flex gap-2 flex-col">
          <Label htmlFor="sku">SKU</Label>
          <Input
            placeholder="SKU"
            id="sku"
            className="w-[443px]"
            disabled
            {...register("sku")}
          />
        </div>
        <Button disabled={isFetchingSku} onClick={() => refetchSku()}>
          Generate
        </Button>
      </div>
      <div className="flex gap-4 mt-6">
        <div className="flex gap-2 flex-col">
          <Label htmlFor="prcie">Price</Label>
          <Input
            placeholder="248 SAR"
            id="price"
            {...register("price", { valueAsNumber: true })}
            className="w-[290px]"
          />
        </div>
        <div className="flex gap-2 flex-col">
          <Label htmlFor="tax">Tax</Label>
          <CustomSelect
            options={taxGroupsSelect}
            width="w-[290px]"
            value={getValues("tax_group_id")}
            onValueChange={(value) => {
              setValue("tax_group_id", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            optionDefaultLabel="Choose tax group"
            loading={istaxGroupsLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ProdcutInfo;
