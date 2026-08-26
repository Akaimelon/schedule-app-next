import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export function createChild(data: Prisma.ChildCreateInput) {
  return prisma.child.create({ data });
}

export function findChildren({ skip, take }: { skip: number; take: number }) {
  return prisma.child.findMany({
    skip,
    take,
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
}

export function countChildren() {
  return prisma.child.count();
}

export function findChildById(id: number) {
  return prisma.child.findUnique({ where: { id } });
}

export function findAllChildId() {
  return prisma.child.findMany({ select: { id: true } });
}

export function updateChild(id: number, data: Prisma.ChildUpdateInput) {
  return prisma.child.update({ where: { id }, data });
}

export async function findMaxSortOrder() {
  const result = await prisma.child.aggregate({
    _max: { sortOrder: true },
  });
  return result._max.sortOrder;
}

export function deleteChild(id: number) {
  return prisma.child.delete({ where: { id } });
}

export function reorderChildren(ids: number[]) {
  return prisma.$transaction(
    ids.map((id, index) =>
      prisma.child.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}
