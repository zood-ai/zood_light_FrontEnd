import { z } from "zod";

export const formTaxesSchema = z.object({
    name: z.string().min(1, { message: "name  required" }),
    name_localized: z.string(),
    rate: z.number().default(0),
    applies_on_order_types: z.array(z.string()).min(1, { message: "apply  required" })
})

export const formTaxesGroupSchema = z.object({
    name: z.string().min(1, { message: "name  required" }),
    name_localized: z.string(),
    reference: z.string(),
    taxes: z.array(z.object({ id: z.string() })).optional(),

})