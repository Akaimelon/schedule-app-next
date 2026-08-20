import { prisma } from "@/lib/prisma";
import type { Prisma, TimeFrame } from "@/generated/prisma/client";

export function findAttendancesByMonth(year: number, month: number) {
  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 1));

  return prisma.attendance.findMany({
    where: { date: { gte: start, lt: end } },
  });
}

export function upsertAttendance(
  date: Date,
  childId: number,
  timeFrame: TimeFrame | null,
) {
  return prisma.attendance.upsert({
    where: { date_childId: { date, childId } },
    create: { date, childId, timeFrame },
    update: {},
  });
}

export function deleteAttendance(date: Date, childId: number) {
  return prisma.attendance.deleteMany({
    where: { date, childId },
  });
}

export function findAttendance(date: Date, childId: number) {
  return prisma.attendance.findUnique({
    where: { date_childId: { date, childId } },
  });
}

export function updateAttendance(
  date: Date,
  childId: number,
  data: Prisma.AttendanceUpdateInput,
) {
  return prisma.attendance.update({
    where: { date_childId: { date, childId } },
    data,
  });
}

export function countAttendanceByDate(date: Date) {
  return prisma.attendance.count({ where: { date } });
}
