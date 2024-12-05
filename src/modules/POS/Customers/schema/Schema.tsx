import { z } from "zod";

export const formCustomersSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  phone: z.string().min(1, { message: "phone number is required" }),
  email: z.string().optional(),
  notes: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  house_account_limit: z.number().optional(),
  is_blacklisted: z.number().optional(),
  is_loyalty_enabled: z.number().optional(),
});
