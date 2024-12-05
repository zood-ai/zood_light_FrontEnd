import { array, z } from "zod";

export const formBranchesSchema = z.object({
  branch_id: z.string().optional(),
  departments: z.array(z.object({ id: z.string() })).optional(),
  holiday_entitlements: z.string(),
  holidays: array(z.object({
    name: z.string(),
    from_date: z.string(),
    to_date: z.string(),

    dine_in_checked: z.number(),
    dine_in_from: z.string(),
    dine_in_to: z.string()
    ,
    pickup_checked: z.number(),
    pickup_from: z.string(),
    pickup_to: z.string(),

    delivery_checked: z.number(),
    delivery_from: z.string(),
    delivery_to: z.string(),


    drive_thru_checked: z.number(),
    drive_thru_from: z.string(),
    drive_thru_to: z.string()
    ,
    delivery_partners_checked: z.number(),
    delivery_partners_from: z.string(),
    delivery_partners_to: z.string()

  })),
  opening_hours: z.array(z.object({
    day: z.string(),
    from: z.string(),
    to: z.string(),
    is_closed: z.boolean()
  })),
  weekly_target: z.number(),
  mobile_clock_in: z.number()


});
