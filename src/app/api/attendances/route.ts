import { requireApprovedUser } from "@/lib/requireApprovedUser";
import {
  attendanceBodySchema,
  attendanceQuerySchema,
} from "@/schemas/attendanceSchema";
import { toFieldErrors } from "@/lib/apiError";
import {
  cancelAttendance,
  getMonthlyAttendances,
  registerAttendance,
} from "@/services/attendanceService";
import { createLogger } from "@/lib/logger";

export async function GET(request: Request) {
  const authResult = await requireApprovedUser();
  if (!authResult.ok) {
    return Response.json(
      { error: authResult.message },
      { status: authResult.status },
    );
  }
  const { searchParams } = new URL(request.url);
  const parsed = attendanceQuerySchema.safeParse(
    Object.fromEntries(searchParams),
  );

  if (!parsed.success) {
    return Response.json(
      { errors: toFieldErrors(parsed.error) },
      { status: 400 },
    );
  }
  const result = await getMonthlyAttendances({
    year: parsed.data.year,
    month: parsed.data.month - 1,
  });
  return Response.json(result);
}

export async function POST(request: Request) {
  const logger = createLogger({ requestId: crypto.randomUUID() });

  const authResult = await requireApprovedUser();
  if (!authResult.ok) {
    return Response.json(
      { error: authResult.message },
      { status: authResult.status },
    );
  }

  const body = await request.json();
  const parsed = attendanceBodySchema.safeParse(body);

  if (!parsed.success) {
    const errors = toFieldErrors(parsed.error);
    logger("warn", "attendance.register.failed", {
      fields: errors.map((e) => e.field),
    });
    return Response.json({ errors }, { status: 400 });
  }

  const result = await registerAttendance(parsed.data);
  if (!result.ok) {
    return Response.json({ error: result.message }, { status: result.status });
  }
  logger("info", "attendance.register.success", {
    childId: parsed.data.childId,
  });
  return Response.json(result.attendance, { status: 201 });
}

export async function DELETE(request: Request) {
  const logger = createLogger({ requestId: crypto.randomUUID() });
  const authResult = await requireApprovedUser();
  if (!authResult.ok) {
    return Response.json(
      { error: authResult.message },
      { status: authResult.status },
    );
  }
  const body = await request.json();
  const parsed = attendanceBodySchema.safeParse(body);

  if (!parsed.success) {
    const errors = toFieldErrors(parsed.error);
    logger("warn", "attendance.cancel.failed", {
      fields: errors.map((e) => e.field),
    });
    return Response.json({ errors }, { status: 400 });
  }
  logger("info", "attendance.cancel.success", { childId: parsed.data.childId });
  await cancelAttendance(parsed.data);

  return new Response(null, { status: 204 });
}
