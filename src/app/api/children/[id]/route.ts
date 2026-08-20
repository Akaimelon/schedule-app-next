import { requireApprovedUser } from "@/lib/requireApprovedUser";
import { createLogger } from "@/lib/logger";
import { updateChildSchema } from "@/schemas/childSchema";
import { toFieldErrors } from "@/lib/apiError";
import { editChild } from "@/services/childService";
import { readJsonBody } from "@/lib/apiError";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const logger = createLogger({ requestId: crypto.randomUUID() });

  const authResult = await requireApprovedUser();
  if (!authResult.ok) {
    return Response.json(
      { error: authResult.message },
      { status: authResult.status },
    );
  }

  const { id: idStr } = await params;
  const id = Number(idStr);

  if (Number.isNaN(id)) {
    return Response.json({ error: "IDが不正です" }, { status: 400 });
  }

  const body = await readJsonBody(request);
  if (body === null) {
    return Response.json(
      { error: "リクエストの形式が不正です" },
      { status: 400 },
    );
  }
  const parsed = updateChildSchema.safeParse(body);

  if (!parsed.success) {
    const errors = toFieldErrors(parsed.error);
    logger("warn", "child.update.failed", {
      fields: errors.map((e) => e.field),
    });
    return Response.json({ errors }, { status: 400 });
  }

  const result = await editChild(id, parsed.data);

  if (!result.ok) {
    return Response.json({ error: result.message }, { status: result.status });
  }

  logger("info", "child.update.success", { childId: id });
  return Response.json(result.child);
}
