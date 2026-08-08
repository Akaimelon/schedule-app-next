import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export function createChild(data: Prisma.ChildCreateInput) {
  return prisma.child.create({ data });
}

export function findChildren({ skip, take }: { skip: number; take: number }) {
  return prisma.child.findMany({ skip, take, orderBy: { sortOrder: "asc" } });
}

export function countChildren() {
  return prisma.child.count();
}

export function findChildById(id: number) {
  return prisma.child.findUnique({ where: { id } });
}
