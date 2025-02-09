import { z } from "zod";

export const formOnboardingSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: "name  required" }),
    new_employees_required: z.number().default(0),
    description: z.string().min(1, { message: "name  required" }),
    file: z
        .union([
            z.instanceof(File).refine((file) => file.size > 0, {
                message: "File is required and cannot be empty",
            }),
            z.string().nonempty({ message: "File path is required" }),
        ]),
})

export const formOnboardingProviderSchema = z.object({
    id: z.string().optional(),

    name: z.string().min(1, { message: "name  required" }),
    new_employees_required: z.number().default(0),
    description: z.string().min(1, { message: "name  required" }),

    file: z.any(),
})
