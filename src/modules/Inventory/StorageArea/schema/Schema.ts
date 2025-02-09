import { z } from "zod";

export  const formStorageareaSchema = z.object({
  names: z.string().trim().min(1, { message: "Enter at least one name" }),
  branches: z.array(z.object({
    id: z.string(),
   })).min(1, { message: "select at least one branch" }),  
  });