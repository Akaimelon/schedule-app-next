import {
  createChild,
  findChildren,
  countChildren,
  findChildById,
  updateChild,
  findMaxSortOrder,
  deleteChild,
  findAllChildId,
  reorderChildren,
} from "@/repositories/childRepository";
import { Child, ChildListResponse } from "@/types/api";
import { UpdateChildInput, CreateChildInput } from "@/schemas/childSchema";

export async function getChildList({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<ChildListResponse> {
  const skip = (page - 1) * limit;
  const [childList, total] = await Promise.all([
    findChildren({ skip, take: limit }),
    countChildren(),
  ]);

  const data = childList.map((child) => ({
    id: child.id,
    name: child.name,
    color: child.color,
    contractDays: child.contractDays,
    sortOrder: child.sortOrder,
    defaultTimeFrame: child.defaultTimeFrame,
  }));

  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function addChild(input: CreateChildInput): Promise<Child> {
  const maxSortOrder = await findMaxSortOrder();
  const newChild = await createChild({
    ...input,
    sortOrder: (maxSortOrder ?? -1) + 1,
  });
  return {
    id: newChild.id,
    name: newChild.name,
    color: newChild.color,
    contractDays: newChild.contractDays,
    sortOrder: newChild.sortOrder,
    defaultTimeFrame: newChild.defaultTimeFrame,
  };
}

export async function editChild(
  id: number,
  input: UpdateChildInput,
): Promise<
  { ok: false; status: number; message: string } | { ok: true; child: Child }
> {
  const child = await findChildById(id);
  if (!child) {
    return { ok: false, status: 404, message: "子供が見つかりません" };
  }
  const updatedChild = await updateChild(id, input);
  return {
    ok: true,
    child: {
      id: updatedChild.id,
      name: updatedChild.name,
      color: updatedChild.color,
      contractDays: updatedChild.contractDays,
      sortOrder: updatedChild.sortOrder,
      defaultTimeFrame: updatedChild.defaultTimeFrame,
    },
  };
}

export async function removeChild(
  id: number,
): Promise<{ ok: false; status: number; message: string } | { ok: true }> {
  const child = await findChildById(id);
  if (!child) {
    return { ok: false, status: 404, message: "子供が見つかりません" };
  }

  await deleteChild(id);
  return { ok: true };
}

export async function reorderChildList(
  ids: number[],
): Promise<{ ok: false; status: number; message: string } | { ok: true }> {
  const existing = await findAllChildId();
  const existingIds = new Set(existing.map((c) => c.id));

  const hasDuplicate = new Set(ids).size !== ids.length;
  const countMismatch = ids.length !== existingIds.size;
  const hasUnknown = !ids.every((id) => existingIds.has(id));

  if (hasDuplicate || countMismatch || hasUnknown) {
    return {
      ok: false,
      status: 409,
      message: "子供一覧が変わっています。画面を再読み込みしてください",
    };
  }

  await reorderChildren(ids);
  return { ok: true };
}
