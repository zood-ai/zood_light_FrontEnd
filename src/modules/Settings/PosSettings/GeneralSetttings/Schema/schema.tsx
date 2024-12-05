import { z } from "zod";

export const formGeneralSettingsSchema = z.object({
  country: z.string().min(1, "Country is required"),
  business_currency: z.string().min(1, "Currency is required"),
  business_name: z.string().min(1, "Business name is required"),
  business_timezone: z.string().min(1, "Timezone is required"),
  tax_registration_name: z.string().min(1, "Tax registration name is required"),
  business_tax_number: z.string().min(1, "Tax number is required"),
  tax_inclusive_pricing: z.number(),
  localization_enabled: z.number(),
  restrict_purchased_items_to_supplier: z.number(),
});
