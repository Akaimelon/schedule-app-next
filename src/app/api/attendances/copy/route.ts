import { requireApprovedUser } from "@/lib/requireApprovedUser";
import { copyMonthSchema } from "@/schemas/attendanceSchema";
import { readJsonBody, toFieldErrors } from "@/lib/apiError";
import { copyPreviousMonth } from "@/services/attendanceService";
import { createLogger } from "@/lib/logger";

export async function POST(request: Request) {
  const logger = createLogger({ requestId: crypto.randomUUID() });

  const authResult = await requireApprovedUser();
  if (!authResult.ok) {
    return Response.json(
      { error: authResult.message },
      { status: authResult.status },
    );
  }

  const body = await readJsonBody(request);
  if (body === null) {
    return Response.json(
      { error: "リクエストの形式が不正です" },
      { status: 400 },
    );
  }
  const parsed = copyMonthSchema.safeParse(body);
  if (!parsed.success) {
    const errors = toFieldErrors(parsed.error);
    logger("warn", "attendance.copy.failed", {
      fields: errors.map((e) => e.field),
    });
    return Response.json({ errors }, { status: 400 });
  }
  const result = await copyPreviousMonth({
    year: parsed.data.year,
    month: parsed.data.month - 1,
  });
  logger("info", "attendance.copy.success", { copied: result.copied });
  return Response.json(result, { status: 200 });
}
