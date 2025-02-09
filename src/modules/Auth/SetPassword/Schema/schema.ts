import { z } from "zod";

export const formSetPasswordSchema = z.object({
    invitation_token: z.string().min(1, { message: "Invitation token is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    business_reference: z.string().min(1, { message: "Business reference is required" }),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .refine(value => /[A-Z]/.test(value), { message: "At least one capital letter required" })
        .refine(value => /\d/.test(value), { message: "At least one number required" })
        .refine(value => /[!@#$%^&*]/.test(value), { message: "At least one special character required" }),
});
