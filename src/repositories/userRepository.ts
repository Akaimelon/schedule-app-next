import { prisma } from "@/lib/prisma";

export function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}