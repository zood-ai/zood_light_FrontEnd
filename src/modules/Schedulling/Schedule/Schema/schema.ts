import { z } from "zod";

export const formAddShiftSchema = z.object({
  date: z.string().min(4),
  time_from: z.string().min(4),
  time_to: z.string().min(4),
  employee_id: z.string().optional().nullable(),
  department_id: z.string().min(4),
  position_id: z.number().min(4),
  station_id: z.string().optional().nullable(),
  shift_type_id: z.string().min(4),
  notes: z.string().optional().nullable(),
  branch_id: z.string().min(4),
});

export const formAddPopularShiftSchema = z.object({
  time_from: z.string().min(4),
  time_to: z.string().min(4),
  branch_id: z.string().min(4),
  shift_type_id: z.string().min(4),
  id: z.number().optional(),
});
