import { z } from "zod";
import { MAX_CONTRACT_PER_MONTH } from "@/constants";

export const createChildSchema = z.object({
  name: z
    .string()
    .min(1, "名前を入力してください")
    .max(20, "名前は20文字までです"),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "色は #RRGGBB 形式で指定してください"),
  contractDays: z
    .number()
    .int("整数で入力してください")
    .min(0, "0以上で入力してください")
    .max(MAX_CONTRACT_PER_MONTH, `${MAX_CONTRACT_PER_MONTH}日までです`),
  defaultTimeFrame: z.enum(["AM", "PM"]).nullable(),
});

export type CreateChildInput = z.infer<typeof createChildSchema>;

export const childListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const updateChildSchema = createChildSchema.partial();
export type UpdateChildInput = z.infer<typeof updateChildSchema>;

export const reorderChildrenSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1),
});
