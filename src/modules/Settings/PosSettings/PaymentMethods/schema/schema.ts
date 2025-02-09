import { z } from "zod";

export const formPaymentMethodsSchema = z.object({
    name: z.string().min(1, { message: "name  required" }),
    name_localized: z.string(),
    type: z.string(),
    is_active: z.number().default(1),
    auto_open_drawer: z.number().default(0),
    code: z.string()
})