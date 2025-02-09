import { z } from "zod";

export const formLocationGroupsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  branches: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .min(1, { message: "select at least one branch" }),
});
