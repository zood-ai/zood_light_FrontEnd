import { z } from "zod";

export const formBranchesSchema = z.object({
  name: z.string().min(1, { message: "name  required" }),
  name_localized: z.string().optional(),
  tax_group_id: z.string().optional(),
  reference: z.string().optional(),
  image: z.string().optional(),
  tax_name: z.string().optional(),
  tax_number: z.string().optional(),
  phone: z.number().optional(),
  address: z.string().optional(),
  opening_from: z.string().optional(),
  opening_to: z.string().optional(),
  inventory_end_of_day_time: z.string().optional(),
  latitude: z.number().default(0),
  longitude: z.number().default(0),
  receipt_header: z.string().optional(),
  receipt_footer: z.string().optional(),
  tags: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),

  users: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
  employee_count: z.number(),
  employee_cost: z.number(),
});

export const formBranchesSchemaEdit = z.object({
  name: z.string().min(1, { message: "name  required" }),
  name_localized: z.string().optional(),
  tax_group_id: z.string().optional(),
  reference: z.string().optional(),
  image: z.string().optional(),
  tax_name: z.string().optional(),
  tax_number: z.string().optional(),
  phone: z.number().optional(),
  address: z.string().optional(),
  opening_from: z.string().optional(),
  opening_to: z.string().optional(),
  inventory_end_of_day_time: z.string().optional(),
  latitude: z.number().default(0),
  longitude: z.number().default(0),
  receipt_header: z.string().optional(),
  receipt_footer: z.string().optional(),
  tags: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),

  users: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
});
