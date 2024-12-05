import { z } from "zod";

export const formCPUschema = z.object({
  name: z.string().trim().min(1, { message: "name is required" }),
  primary_email: z
    .string()
    .email()
    .min(1, { message: "Order email is required" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  comment: z.string().nullable(),
  branch_id: z.any(),
  accept_price_change: z.number().optional().nullable(),
  min_order: z.number().nullable(),
  max_order: z.number().nullable(),
  branches: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        cc_email: z.any(),
        customer_code: z.any(),
        order_rules: z.array(
          z.object({
            delivery_day: z.string(),
            order_day: z.string(),
            order_time: z.string(),
          })
        ),
      })
    )
    .min(1, { message: "branch is required" }),
});
