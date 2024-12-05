import FolderIcon from "@/assets/icons/Folder";
import { Checkbox } from "@/components/ui/checkbox";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TypeOptions } from "@/constants/dropdownconstants";
import useCommonRequests from "@/hooks/useCommonRequests";
import { useFormContext } from "react-hook-form";

const ProductDescription = () => {
  const { CategoriesSelect } = useCommonRequests({
    getCategories: true,
  });
  const { setValue, getValues, register } = useFormContext();

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
          <FolderIcon />
        </div>
        <h3 className="font-bold text-[16px]">Product description</h3>
      </div>

      <div className="flex items-center gap-[54px]">
        <FormItem className="gap-2 items-center mt-2 mb-4">
          <FormLabel htmlFor="name" className="font-bold">
            Item name <span className="text-warn text-[18px]">*</span>
          </FormLabel>
          <Input id="name" className="w-[200px] " {...register(`name`)} />
        </FormItem>

        <FormItem className=" gap-2 items-center mt-2 mb-4">
          <FormLabel htmlFor="category" className="font-bold">
            Category
            <span className="text-warn text-[18px]">*</span>
          </FormLabel>
          <CustomSelect
            placeHolder="Choose category"
            width="w-[200px]"
            options={CategoriesSelect}
            onValueChange={(e) =>
              setValue("category_id", e, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            value={getValues("category_id")}
          />
        </FormItem>
      </div>

      <div className="flex items-end gap-[54px]">
        <FormItem>
          <FormLabel htmlFor="type" className="font-bold">
            Type <span className="text-warn text-[18px]">*</span>
          </FormLabel>
          <CustomSelect
            options={TypeOptions}
            placeHolder="Choose type"
            onValueChange={(e) =>
              setValue("type", e, { shouldValidate: true, shouldDirty: true })
            }
            width="w-[200px]"
            value={getValues("type") || TypeOptions[0].value}
          />
        </FormItem>

        <FormItem className=" flex gap-2 items-center mb-[7px]">
          <Checkbox
            id="exclude_product"
            onCheckedChange={(e) => {
              setValue("exclude_product_from_gp", e);
            }}
            defaultChecked={getValues("exclude_product_from_gp")}
          />
          <FormLabel htmlFor="exclude_product" className="text-textPrimary ">
            Exclude product from GP calculation
          </FormLabel>
        </FormItem>
      </div>
    </>
  );
};

export default ProductDescription;
