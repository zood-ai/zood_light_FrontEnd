import { z } from "zod";

export const formProductionsSchema = z.object({
  branch_id: z.string().min(1 , "Branch is required"),
  business_date: z.string().min(1 , "Business date is required"),
  items:z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
      storage_unit: z.string().optional(),
    })
  ).length(1, "At least one item is required"),

});