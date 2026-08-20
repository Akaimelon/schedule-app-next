import { z } from "zod";

export const attendanceQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});

export const attendanceBodySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "日付は YYYY-MM-DD 形式で指定してください"),
  childId: z.number().int().positive(),
});

export const attendancePatchSchema = attendanceBodySchema.extend({
  timeFrame: z.enum(["AM", "PM"]).nullable().optional(),
  pickup: z.boolean().optional(),
  dropoff: z.boolean().optional(),
});

export type AttendancePatchInput = z.infer<typeof attendancePatchSchema>;
