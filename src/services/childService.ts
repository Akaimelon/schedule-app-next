import {
  createChild,
  findChildren,
  countChildren,
  findChildById,
  updateChild,
} from "@/repositories/childRepository";
import { Prisma } from "@/generated/prisma/client";
import { Child } from "@/types/api";
import { UpdateChildInput } from "@/schemas/childSchema";

export async function getChildList({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
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
  }));

  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function addChild(input: Prisma.ChildCreateInput) {
  const newChild = await createChild(input);
  return {
    id: newChild.id,
    name: newChild.name,
    color: newChild.color,
    contractDays: newChild.contractDays,
    sortOrder: newChild.sortOrder,
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
    },
  };
}
