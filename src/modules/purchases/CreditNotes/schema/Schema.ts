import { z } from "zod";

export const formCreditNotesSchema = z.object({
  id: z.number(),
  Item: z.string(),
  Supplier: z.string(),
  Branch: z.string(),
  InvoiceNumber: z.string(),
  Type: z.string(),
  Status: z.string(),
  CreditValue: z.number(),
});