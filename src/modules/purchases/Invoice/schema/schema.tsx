import { z } from "zod";

export const formInvoiceSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  supplier_name: z.string(),
  business_date: z.string(),
  invoice_date: z.string(),
  sub_total: z.number(),
  total: z.number(),
  total_vat: z.number(),
  status: z.number(),
  accept_price_change_from_supplier: z.number(),
  creditNotices: z
    .array(
      z.object({
        id: z.number(),
        type: z.string(),
        status: z.number(),
        credit_amount: z.number(),
        name: z.string(),
        note: z.string(),
        item_id: z.string(),
        quantity: z.number(),
        invoice_quantity: z.number(),
        cost: z.number(),
        old_cost: z.number().optional(),
      })
    )
    .optional(),
  item: z
    .object({
      name: z.string(),
      id: z.string(),
    })
    .optional(),
  items: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        quantity: z.number(),
        invoice_quantity: z.number(),
        pack_unit: z.string(),
        unit: z.string(),
        total_cost: z.number(),
        sub_total: z.number(),
        tax_group_id: z.string(),
        cost: z.number(),
        tax_amount: z.number(),
        old_cost: z.number(),
      })
    )
    .optional(),
});
