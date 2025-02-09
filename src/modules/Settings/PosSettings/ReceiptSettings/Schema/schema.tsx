import { z } from "zod";

export const formReceiptSettingsSchema = z.object({
  receipt_print_language: z.number().min(1, "Print language is required"),
  receipt_main_language: z.string().min(1, "Main language is required"),
  receipt_localized_language: z
    .string()
    .min(1, "Localized language is required"),
  receipt_header: z.string().min(1, "Receipt header is required"),
  receipt_footer: z.string().min(1, "Receipt footer is required"),
  receipt_invoice_title: z.string().min(1, "Receipt invoice title is required"),
  receipt_show_order_number: z.number(),
  receipt_show_calories: z.number(),
  receipt_show_subtotal: z.number(),
  receipt_show_rounding: z.number(),
  receipt_show_closer_username: z.number(),
  receipt_show_creator_username: z.number(),
  receipt_show_check_number: z.number(),
  receipt_hide_free_modifier_options: z.number(),
  enable_printing_default_modifiers_on_kitchen_receipt: z.number(),
  business_logo: z.string().min(1, "Business logo is required"),
});
