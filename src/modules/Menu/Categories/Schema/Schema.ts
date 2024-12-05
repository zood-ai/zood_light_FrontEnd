import { z } from "zod";

export const formCategoriesSchema = z.object({
    name: z.string().min(1, { message: "name  required" }),
    reference: z.string().optional(),
    image: z.string().optional(),
    name_localized: z.string().optional()


})