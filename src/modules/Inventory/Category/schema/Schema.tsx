import { z } from "zod";

export const formCategorySchema = z.object({
  id: z.string().optional(),
  reference: z.string().min(1, { message: "Names is required" }),
  name: z.string().min(1, { message: "Names is required" }),
  name_localized: z.string().optional(),
});
