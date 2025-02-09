import { z } from "zod";

export const defaultValues = {
  name: "",
  price: null,
  type: "",
  food: 0,
  beverage: 0,
  misc: 0,
  cost: 0,
  items: [
    {
      id: "",
      quantity: 0,
      cost: 0,
    },
  ],
};

export const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    price: z.union([
      z.number().gt(0, { message: "Price must be greater than 0" }),
      z.null(),
    ]),
    type: z.string().min(1, { message: "Type is required" }),
    food: z.number().min(0).max(100).optional(),
    beverage: z.number().min(0).max(100).optional(),
    misc: z.number().min(0).max(100).optional(),
    cost: z.number().gt(0, { message: "Cost must be greater than 0" }),
    items: z
      .array(
        z.object({
          id: z.string().min(1, { message: "Item is required" }),
          quantity: z
            .number()
            .gt(0, { message: "Quantity is required" })
            .default(0),
          cost: z.number().gt(0, { message: "Cost must be greater than 0" }),
        })
      )
      .min(1, { message: "select at least one item" }),
  })
  .refine(
    (data) => {
      if (data.type === "Meal") {
        const total =
          (data.food || 0) + (data.beverage || 0) + (data.misc || 0);
        return total === 100;
      }
      return true;
    },
    {
      message: "The sum of food, beverage, and misc must equal 100",
      path: ["food", "beverage", "misc"],
    }
  );
