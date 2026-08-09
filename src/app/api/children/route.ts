import { getChildList, addChild } from "@/services/childService";
import { createChildSchema, childListQuerySchema } from "@/schemas/childSchema";
import { createLogger } from "@/lib/logger";
import { toFieldErrors } from "@/lib/apiError";
import { requireApprovedUser } from "@/lib/requireApprovedUser";
import { readJsonBody } from "@/lib/apiError";

export async function GET(request: Request) {
  const authResult = await requireApprovedUser();
  if (!authResult.ok) {
    return Response.json(
      { error: authResult.message },
      { status: authResult.status },
    );
  }
  const { searchParams } = new URL(request.url);
  const parsed = childListQuerySchema.safeParse(
    Object.fromEntries(searchParams),
  );

  if (!parsed.success) {
    return Response.json(
      { errors: toFieldErrors(parsed.error) },
      { status: 400 },
    );
  }
  const result = await getChildList(parsed.data);
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

  logger("info", "child.create.start");
  const body = await readJsonBody(request);
if (body === null) {
  return Response.json({ error: "リクエストの形式が不正です" }, { status: 400 });
}
  const parsed = createChildSchema.safeParse(body);

  if (!parsed.success) {
    const errors = toFieldErrors(parsed.error);
    logger("warn", "child.create.failed", {
      fields: errors.map((e) => e.field),
    });
    return Response.json({ errors }, { status: 400 });
  }

  const child = await addChild(parsed.data);
  logger("info", "child.create.success", { childId: child.id });
  return Response.json(child, { status: 201 });
}
