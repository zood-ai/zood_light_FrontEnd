import CartIcon from "@/assets/icons/Cart";
import { useFieldArray, useFormContext } from "react-hook-form";
import IngredientFields from "./IngredientFields";

const IngredientsInfo = () => {
  const { control, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredient",
  });

  const CheckIngredients = getValues("ingredient")?.some(
    (ing) => ing.quantity === 0
  );

  return (
    <div>
      {/* header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
          <CartIcon />
        </div>
        <h3 className="font-bold text-[16px]">Ingredients</h3>
      </div>
      {/* content */}

      <div className=" bg-popover p-4 rounded-[4px]">
        {fields.map((field, index) => (
          <IngredientFields
            key={field.id}
            index={index}
            remove={remove}
            count={fields.length}
          />
        ))}
        <p
          className={`text-primary text-right mt-2  select-none ${
            CheckIngredients
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          role="button"
          onClick={() => {
            if (CheckIngredients) {
              return;
            }
            append({
              cost: 0,
              id: "",
              quantity: 0,
              pack_unit: "",
            });
          }}
        >
          Add ingredient
        </p>
      </div>
    </div>
  );
};

export default IngredientsInfo;
