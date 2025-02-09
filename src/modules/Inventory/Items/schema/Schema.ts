import { z } from "zod";

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
        pack_size: z.number().min(1, { message: "Pack size is required" }),
        pack_unit: z.string().min(1, { message: "Pack unit is required" }),
        pack_per_case: z.number().optional().nullable().default(null),
        cost: z
          .number()
          .min(1, { message: "Cost is required" })
          .gt(0, { message: "Cost should be greater than 0" }),
        tax_group_id: z.string().min(1, { message: "Tax group is required" }),
        is_main: z.number().default(0),
      })
    )
    .refine(
      (suppliers) => suppliers.some((supplier: any) => supplier.is_main),
      { message: "At least one supplier is required" }
    )
    .refine(
      (suppliers) => {
        const codes = suppliers.map((s) => s.item_supplier_code);
        return !codes.some((code, index) =>
          codes.some(
            (otherCode, otherIndex) =>
              otherIndex !== index && code === otherCode
          )
        );
      },
      { message: "No item_supplier_code should be smaller than any other" }
    ),
  branches: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .min(1, { message: "select at least one branch" }),
  storage_areas: z.array(z.number()).optional(),
  stock_counts: z
    .array(
      z.object({
        pack_unit: z.any(),
        count: z.any(),
        checked: z.any(),
        report_preview: z.any(),
        show_as: z.string().optional().nullable(),
        use_report: z.any(),
        unit: z.string().min(1, { message: "Unit is required" }),
      })
    )
    .refine((stock_counts) => stock_counts.some((stock) => stock.checked), {
      message: "At least one stock count is required",
    }),
});
