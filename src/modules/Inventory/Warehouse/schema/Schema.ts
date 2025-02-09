import { z } from "zod";

export const formWareHouseSchema = z.object({
  id: z.string().optional(),
  reference: z.string().optional(),
  name: z.string().trim().min(1, { message: "Name is required" }),
  name_localized: z.string(),
  inventory_end_of_day_time: z.string()
});