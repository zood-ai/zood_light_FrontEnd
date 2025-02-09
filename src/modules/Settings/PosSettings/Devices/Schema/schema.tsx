import { z } from "zod";

export const formDevicesSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  name_localized: z.string().optional(),
  reference: z.number().min(1, { message: "reference is required" }),
  branch_id: z.string().min(1, { message: "branch_id is required" }),
  type: z.number().min(1, { message: "type is required" }),
  tags: z.array(z.object({ id: z.string() })).optional(),
});
