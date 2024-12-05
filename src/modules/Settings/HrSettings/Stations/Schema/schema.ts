import { z } from "zod";

export const formStationsSchema = z.object({
  name: z.string().min(1, { message: "name  required" }),
});
