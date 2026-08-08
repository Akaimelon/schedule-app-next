import {
  createChild,
  findChildren,
  countChildren,
} from "@/repositories/childRepository";
import { Prisma } from "@/generated/prisma/client";

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
