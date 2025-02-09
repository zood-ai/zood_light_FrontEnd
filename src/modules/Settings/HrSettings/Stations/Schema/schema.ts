import { z } from "zod";

export const formStationsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  department_id: z.string().min(1, "Department is required"),
});
