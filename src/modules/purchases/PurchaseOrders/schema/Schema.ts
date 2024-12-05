import { z } from 'zod'

export const formSupplierSchema = z.object({
  supplier: z.string().min(1, { message: 'supplier id is required' }),
  branch: z.string().min(1, { message: ' branch id is required' }),
  notes: z.string().optional(),
  business_date: z.string().date().optional(),
  delivery_date: z.string().date().optional(),
  status: z.string().optional(),
  items: z
    .array(
      z.object({
        item_id: z.string(),
        quantity: z.number().min(1, { message: 'Quantity is required' }),
        sub_total: z.number().optional(),
        invoice_quantity: z.number().optional(),
        pack_size: z.number().optional(),
        pack_per_case: z.number().optional().nullable(),
        cost: z.number().optional(),
        unit: z.string().optional(),
        total_tax: z.number().optional(),
        tax_group_id: z.string().optional(),
        total_cost: z.number().optional(),
      })
    )
    .min(1, { message: 'select at least one item' }),
})
