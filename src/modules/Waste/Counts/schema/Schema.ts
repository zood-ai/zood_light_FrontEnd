import { z } from 'zod'

export const formCountsSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  day_option: z.string().min(1, 'Day option is required'),
  business_date: z.string().min(1, 'Business date is required'),
  items: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number(),
        total_cost: z.number(),
        is_estimated: z.number().optional(),
        array_stock_counts: z
          .array(
            z.object({
              id: z.number(),
              quantity: z.number(),
              unit: z.string(),
              use_report: z.number(),
              item_id: z.string(),
              count: z.number(),
              checked: z.number(),
              show_as: z.string(),
              report_preview: z.string(),
            })
          )
          .min(1, 'Stock counts is required'),
      })
    )
    .min(1, 'Items is required'),
})
