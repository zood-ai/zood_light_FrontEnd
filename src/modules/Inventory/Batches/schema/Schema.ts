import { z } from 'zod'

export const formbatcheschema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  storage_to_ingredient: z.number().min(0.001, { message: 'Yeild is required' }),
  storage_unit: z.string().min(1, { message: 'Unit is required' }),
  costing_method: z.number().default(0),
  cost: z.number(),
  ingredient: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number().min(0.01, { message: 'Quantity is required' }),
        unit: z.string().optional(),
        cost: z.number().optional(),
      })
    )
    .min(1, { message: 'select at least one ingredient' }),
  suppliers: z
    .array(
      z.object({
        id: z.string(),
        item_supplier_code: z.string().min(1, { message: 'Supplier code is required' }),
        specific_name: z.string().nullable(),
        pack_size: z.number().min(1, { message: 'Pack size is required' }),
        pack_unit: z.string().min(1, { message: 'Pack unit is required' }),
        pack_per_case: z.number().optional().nullable().default(null),
        cost: z
          .number()
          .min(1, { message: 'Cost is required' })
          .gt(0, { message: 'Cost should be greater than 0' }),
        tax_group_id: z.string().min(1, { message: 'Tax group is required' }),
        is_main: z.number().default(0),
      })
    )
    .optional()
    .refine(
      (suppliers) => {
        const codes = suppliers?.map((s) => s.item_supplier_code)
        return !codes?.some((code, index) =>
          codes.some((otherCode, otherIndex) => otherIndex !== index && code === otherCode)
        )
      },
      { message: 'No item_supplier_code should be smaller than any other' }
    ),
  branches: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .min(1, { message: 'select at least one branch' }),
  storage_areas: z.array(z.number()).optional(),
  stock_counts: z.any(),
})
