import { z } from "zod";

export const formReasonSchema = z.object({
    name: z.string().min(1, { message: "name  required" }),
    name_localized: z.string(),
    type: z.number().optional()
})