import { requireApprovedUser } from "@/lib/requireApprovedUser";
import { createLogger } from "@/lib/logger";
import { readJsonBody, toFieldErrors } from "@/lib/apiError";
// ▲▲
import { reorderChildrenSchema } from "@/schemas/childSchema";
import { reorderChildList } from "@/services/childService";

export async function PUT(request: Request) {
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

  const parsed = reorderChildrenSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { errors: toFieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  const result = await reorderChildList(parsed.data.ids);

  if (!result.ok) {
    return Response.json({ error: result.message }, { status: result.status });
  }

  logger("info", "child.reorder.success", { count: parsed.data.ids.length });
  return new Response(null, { status: 204 });
}
