import { z } from "zod";

export const formRequestSchema = z.object({
  notes: z.string().optional(),
});
