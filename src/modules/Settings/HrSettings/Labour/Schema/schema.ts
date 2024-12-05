import { z } from "zod";
export const formShiftTypeSchema = z.object({
    name: z.string(),
    icon: z.string(),
    is_paid: z.boolean(),
    include_employee_working_hours: z.boolean(),
    employee_need_to_punch: z.boolean(),
    deleted_when_schedule_cleared: z.boolean()

});
export const formOverTimeRulesSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "is required"),
    scenario: z.enum(["1", "2"]),
    paid_rate: z.number().min(1, "is required"),
}).and(
    z.union([
        z.object({
            scenario: z.literal("1"),
            day: z.string().min(1, "is required"),
            applies_to_hourly: z.boolean(),
            applies_to_daily: z.boolean(),
            applies_to_salaried: z.boolean(),
        }),
        z.object({
            scenario: z.literal("2"),
            hours_per_week: z.number().min(1, "is required"),
        }),
    ])
);


export const formClockingRulesSchema = z.object(
    {
        break_option: z.enum(["1", "2", "3"]),
        rounding_rules: z.array(
            z.object({
                type: z.string().min(1, "is required"),
                option: z.string().min(1, "is required"),
                minutes: z.number().min(1, "is required"),
            })
        ),
    }
).and(
    z.union([
        z.object({
            break_option: z.literal("3"),
            break_rules: z.array(
                z.object({
                    shit_hours: z.number().min(1, "is required"),
                    paid_minutes: z.number().min(1, "is required"),
                    unpaid_minutes: z.number().min(1, "is required"),
                })
            ).min(1, "At least one rule is required for break option 3"),
        }),
        z.object({
            break_option: z.enum(["1", "2"]),

        }),
    ])
);
