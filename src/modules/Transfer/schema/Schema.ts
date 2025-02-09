import { z } from "zod";

export const formTransferSchema = z.object({
  delivery_date: z.string(),
  branch_id: z.string(),
  warehouse_id: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
      total_cost: z.number(),
      array_stock_counts: z.array(
        z.object({
          id: z.number(),
          count: z.number(),
          use_report: z.number(),
          cost: z.number(),
          quantity: z.number(),
          unit: z.string(),
        })
      ),
    })
  ),
  type: z.any(),
  status: z.any(),
  decline_reason: z.any(),
  total_amount: z.number(),
});
