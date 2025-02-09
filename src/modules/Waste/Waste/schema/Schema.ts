import { z } from "zod";

export const formWastSchema = z.object({
  business_date: z.string(),

  items: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number(),
        total_cost: z.number(),
        reason: z.string(),
        array_stock_counts: z.array(
          z.object({
            id: z.number(),
            count: z.number(),
            use_report: z.number(),
            cost: z.number(),
            quantity: z.number(),
            unit: z.string(),
            checked: z.number(),
          })
        ),
      })
    )
    .default([]),
  batches: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number(),
        total_cost: z.number(),
        reason: z.string(),
        array_stock_counts: z.array(
          z.object({
            id: z.number(),
            count: z.number(),
            use_report: z.number(),
            cost: z.number(),
            quantity: z.number(),
            unit: z.string(),
            checked: z.number(),
          })
        ),
      })
    )
    .default([]),
  recipes: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number(),
        total_cost: z.number(),
        reason: z.string(),
      })
    )
    .default([]),
  item: z.object({
    id: z.string(),
    type: z.string(),
  }),
});

export const formWastEditSchema = z.object({
  business_date: z.string(),
  id: z.string(),
  name: z.string(),
  total_cost: z.number(),
  quantity: z.number(),
  array_stock_counts: z.array(
    z.object({
      id: z.number(),
      count: z.number(),
      use_report: z.number(),
      cost: z.number(),
      quantity: z.number(),
      unit: z.string(),
      checked: z.number(),
    })
  ),
  reason: z.string(),
});
