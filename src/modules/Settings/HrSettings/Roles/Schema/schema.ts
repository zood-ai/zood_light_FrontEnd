import { z } from "zod";

export const formRolesSchema = z.object({
    name: z.string().min(1, { message: "name  required" }),
    authorities: z.array(z.string())
});
