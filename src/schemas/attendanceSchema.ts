import { z } from "zod";

export const attendanceQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});

export const attendanceBodySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日付は YYYY-MM-DD 形式で指定してください"),
  childId: z.number().int().positive(),
})
