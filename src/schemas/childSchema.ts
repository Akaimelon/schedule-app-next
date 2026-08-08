import { z } from "zod";

export const createChildSchema = z.object({
  name: z.string().min(1, "名前を入力してください").max(20, "名前は20文字までです"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "色は #RRGGBB 形式で指定してください"),
  contractDays: z.number().int().min(0).max(13),
  sortOrder: z.number().int().min(0),
});

export type CreateChildInput = z.infer<typeof createChildSchema>;

export const childListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});