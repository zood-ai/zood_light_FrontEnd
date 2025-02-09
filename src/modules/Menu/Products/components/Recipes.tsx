import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Label } from "@/components/ui/label";
import useCommonRequests from "@/hooks/useCommonRequests";
import { useFormContext } from "react-hook-form";

const Recipes = () => {
  const { setValue, getValues } = useFormContext();
  const { recipeSelect, isFetchingRecipes } = useCommonRequests({
    getRecipes: true,
  });

  return (
    <div className="px-5 ">
      <h1 className="text-textPrimary text-[20px] font-bold mb-3 ">Recipes</h1>

      <div className="flex flex-col gap-2">
        <Label htmlFor="">Recipe</Label>
        <CustomSelect
          options={recipeSelect}
          width="w-full"
          value={getValues("recipes.[0].id")}
          onValueChange={(value) => {
            setValue("recipes", [{ id: value }], {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          loading={isFetchingRecipes}
          placeHolder="Choose recipe"
        />
      </div>
    </div>
  );
};

export default Recipes;
