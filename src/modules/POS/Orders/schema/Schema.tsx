import { z } from "zod";

export const formOrdersSchema = z.object({
    name: z.string().min(1, { message: "name  required" }),
    reference: z.string().optional(),
    image: z.string().optional()


})