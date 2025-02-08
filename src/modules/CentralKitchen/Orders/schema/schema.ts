import { z } from "zod";

export const formOrdersSchema = z.object({
  sub_total: z.number(),
  invoice_date: z.string(),
  business_date: z.string(),
  total_cost: z.number(),
  total_tax: z.number(),
  branch: z.string(),
  supplier: z.string(),
  purchase_order_id: z.string(),
  // image: z.any(),
  items: z.array(
    z.object({
      item_id: z.string(),
      cost: z.number(),
      invoice_quantity: z.number(),
      name: z.string(),
      order_cost: z.number(),
      quantity: z.number(),
      sub_total: z.number(),
      tax_amount: z.any(),
      tax_group_id: z.string(),
      total_cost: z.number(),
      price_per_unit: z.number(),
      unit: z.string(),
      pack_per_case: z.number().nullable(),
      supplier_item_id:z.string(),
      pack_size: z.number(),
    })
  ),
  status: z.number(),
});

export const formItemSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  category_id: z.string().min(1, { message: "Category is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  exclude_product_from_gp: z.boolean().default(false),
  suppliers: z
    .array(
      z.object({
        id: z.string(),
        item_supplier_code: z
          .string()
          .min(1, { message: "Supplier code is required" }),
        specific_name: z.string().nullable(),
        pack_size: z
          .number()
          .min(1, { message: "Pack size is required" })
          .default(0),
        pack_unit: z.string().min(1, { message: "Pack unit is required" }),
        pack_per_case: z.number().nullable(),
        cost: z.number().min(1, { message: "Cost is required" }).default(0),
        tax_group_id: z.string().nullable().optional(),
        is_main: z.number({ message: "Is main is required" }).default(0),
      })
    )
    .min(1, { message: "select at least one supplier" }),
  branches: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .min(1, { message: "select at least one branch" }),
  stock_counts: z.array(z.any()),
});
