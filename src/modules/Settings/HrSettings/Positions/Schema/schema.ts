import { z } from "zod";

export const formPositionSchema = z.object({
  name: z.string().min(1, { message: "name  required" }),
  forecast_department_id: z.string().min(6, { message: "name  required" }),
});
