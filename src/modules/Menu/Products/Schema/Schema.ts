import { z } from "zod";

export const formProductsSchema = z.object({
  name: z.string().min(1, { message: "name  required" }),
  name_localized: z.string().optional(),
  sku: z.string().min(1, { message: "sku  required" }),
  price: z.number().min(1, { message: "price  required" }).nullable(),
  tax_group_id: z.string().min(1, { message: "tax_group  required" }),
  category_id: z.string().min(1, { message: "category_id  required" }),
  image: z.string().optional(),
  recipes: z
    .array(z.object({ id: z.string() }))
    .min(1, { message: "recipes  required" }),
  branches: z
    .array(z.object({ id: z.string(), price: z.number().optional() }))
    .min(1, { message: "branches  required" }),
});
