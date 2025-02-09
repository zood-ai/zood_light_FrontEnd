import { z } from "zod";

export const formLoginSchema = z.object({
  email: z
    .string()
    .min(3, { message: "email is required" })
    .email("This is not a valid email."),
  business_reference: z.string().min(6, { message: "reference is required" }),
  password: z.string().min(6, { message: "password is required" }),
});
