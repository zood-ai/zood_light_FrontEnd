import { z } from "zod";

export const formPeopleSchema = z.object({
    first_name: z.string().min(1, "is required"),
    last_name: z.string().min(1, "is required"),
    preferred_name: z.string().nullable(),
    email: z.string().min(1, "is required").email({ message: "Invalid email address" }),
    departments: z.array
        (z.object({
            id: z.string().min(1, "is required"),

            forecast_position_id: z.number().min(1, "is required"),

        })),

    branches: z.array(z.object({
        id: z.string().min(1, "is required"),
        is_home: z.boolean().default(true)
    })),
    role_id: z.string().min(1, "is required"),
    contract: z.string().min(1, "is required"),
    contract_hrs: z.number().min(1, "is required"),
    start_date: z.string().min(1,"is required"),
    birth_date: z.string().min(1,"is required"),
    documents: z.array(
        z.object({
            id: z.string().min(1, "is required"),
           
        })
    ),
    send_invitation: z.number().default(0),
    wage_type: z.string().min(1, "is required"),
    wage: z.number().min(1, "is required").default(0),
    pin: z.number(),
});
const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
const swiftCodeRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
export const formUpdatePeopleSchema = z.object({
    id: z.string(),
    first_name: z.string().min(1, "is required"),
    last_name: z.string().min(1, "is required"),
    preferred_name: z.string().nullable(),
    email: z.string().min(1, "is required").email({ message: "Invalid email address" }),

    contract: z.string().min(1, "is required"),
    contract_hrs: z.number().min(1, "is required"),
    address: z.object({
        home_number: z.string().optional(),
        street: z.string().optional(),
        city: z.string().optional(),
        town: z.string().optional(),
        postcode: z.string().optional(),

    }).nullable(),
    title: z.string().nullable(),
    gender: z.string().nullable(),
    phone: z.string().nullable(),
    iban: z
        .string()
        .optional()
        .refine(
            (val) => val === "" || ibanRegex.test(val!),
            {
                message: "Invalid BIN code format",
            }
        )
        .nullable(),
    swift: z
        .string()
        .optional()
        .refine(
            (val) => val === "" || swiftCodeRegex.test(val!),
            {
                message: "Invalid SWIFT code format",
            }
        )
        .nullable(),
    tin: z.string().nullable(),
    start_date: z.string().min(1,"is required"),
    birth_date: z.string().min(1,"is required"),
    visa_type: z.string().nullable(),
    availability: z.array(z.object({
        day: z.string(),
        from: z.string(),
        to: z.string(),
        is_available: z.boolean()
    })),
    branches: z.array(z.object({
        id: z.string().min(1, "is required"),
        is_home: z.boolean().default(false)
    })),
    departments: z.array(z.object({
        id: z.string().min(1, "is required"),
        forecast_position_id: z.number().min(1, "is required"),
    })),
    wage_type: z.string().min(1, "is required"),
    wage: z.number().min(1, "is required").default(0),

    payroll_id: z.string().length(4).max(4, "is required").nullable(),
    timecard_id: z.string().length(4).max(4, "is required").nullable(),
    pin: z.string().nullable(),
    carryover: z.number(),
    yearly_paid_entitlements: z.number(),
    taken: z.number(),
    documents: z.array(
        z.object({
            id: z.string().min(1, "is required"),
           
        })
    ),
    role_id: z.string().min(1, "is required"),
    permissions: z.array(z.string()),
    visa_verified: z.any(),
    visa_date:z.string().nullable(),
    contact_name:z.string().nullable(),
    contact_relation:z.string().nullable(),
    contact_phone:z.string().nullable(),
    receives_holiday_entitlements: z.any()




});

