import { z } from "zod";

export const formDepartmentSchema = z.object({
  name: z.string().min(1, { message: "name  required" }),
  branches: z.array(z.object({ id: z.string() }))
});
