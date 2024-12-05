import { string, z } from "zod";

export const formReceiveOrderSchema = z
  .object({
    total: z.number(),
    sub_total: z.number(),
    invoice_number: z.number().positive(),
    invoice_date: z.string(),
    business_date: z.string(),
    total_cost: z.number(),
    total_tax: z.number(),
    branch: z.string(),
    supplier: z.string(),
    purchase_order_id: z.string(),
    // image: z.any(),
    has_cpu_transaction: z.boolean(),
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
        pack_per_case: z.number(),
        pack_size: z.number(),
      })
    ),
    status: z.number(),
  })
  .refine(
    (data) => data.total === data.sub_total,
    (data) => ({
      message: `Delivery total is ${data?.sub_total > data.total ? "lower than" : "higher than"
        }  expected (SAR) ${data?.sub_total
        } Check for qty and/or price discrepancies.`,
      path: ["total"],
    })
  );

export const formReceiveOrderWithoutSchema = z.object({
  item: z.object({ name: string() }),
  invoice_number: z.number(),
  invoice_date: z.string(),
  business_date: z.string(),
  total_cost: z.number(),
  total_tax: z.number(),
  sub_total: z.number(),
  branch: z.string(),
  supplier: z.string(),
  items: z.array(
    z.object({
      item_id: z.string(),
      cost: z.number(),
      unit: z.string(),
      invoice_quantity: z.number(),
      name: z.string(),
      order_cost: z.number(),
      pack_per_case: z.number().nullable(),
      pack_size: z.number(),
      quantity: z.number(),
      sub_total: z.number(),
      tax_amount: z.number(),
      tax_group_id: z.string(),
      total_cost: z.number(),
    })
  ),
  status: z.string(),
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
        pack_per_case: z.number().default(0),
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

export const uploadImageSchema = z.object({
  id: z.string(),
  type: z.string(),
  image: z.any(),
});



export const formTransferCPUSchema = z.object({
  sub_total: z.number(),
  invoice_date: z.string(),
  business_date: z.string(),
  total_cost: z.number(),
  total_tax: z.number(),
  branch: z.string(),
  supplier: z.string(),
  purchase_order_id: z.string(),
  has_cpu_transaction: z.boolean(),
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
      pack_per_case: z.number(),
      pack_size: z.number(),
    })
  ),
  status: z.number(),
});