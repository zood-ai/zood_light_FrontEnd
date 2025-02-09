import { z } from "zod";

export const formPositionSchema = z.object({
  name: z.string().trim().min(1, { message: "name is required" }),
  forecast_department_id: z.string().min(6, { message: "name  required" }),
});
