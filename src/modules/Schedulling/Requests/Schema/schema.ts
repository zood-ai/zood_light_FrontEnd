import { z } from "zod";

export const formRequestSchema = z.object({
  notes: z.string().optional(),
});

export const formTimeOffSchema = z.object({
  details: z.any(),
});

export const formShiftChangesSchema = z.object({
  replacement_id: z.string().optional(),
});
