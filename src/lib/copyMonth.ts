import { MAX_PER_DAY } from "@/constants";
import {
  dateStrToLocalDate,
  dateStrToDate,
  toStr,
  getWeekdayOccurrence,
  findNthWeekday,
  dateToDateStr,
} from "@/lib/date";

import type { Holidays } from "@/lib/holidays";
import type { Attendance } from "@/types/api";

export type NewAttendance = {
  date: Date;
  childId: number;
  timeFrame: "AM" | "PM" | null;
  pickup: boolean;
  dropoff: boolean;
};

export function mapToTargetMonth(
  sources: Attendance[],
  year: number,
  month: number,
  holidays: Holidays,
): NewAttendance[] {
  const rows: NewAttendance[] = [];

  for (const source of sources) {
    const sourceDate = dateStrToLocalDate(source.date);
    const weekday = sourceDate.getDay();
    const occurrence = getWeekdayOccurrence(sourceDate);

    const target = findNthWeekday(year, month, weekday, occurrence);
    if (target === null) continue;

    const targetStr = toStr(target);
    if (holidays[targetStr]) continue;

    rows.push({
      date: dateStrToDate(targetStr),
      childId: source.childId,
      timeFrame: source.timeFrame,
      pickup: source.pickup,
      dropoff: source.dropoff,
    });
  }
  return rows;
}

export function limitPerDay(
  rows: NewAttendance[],
  existing: Attendance[],
): NewAttendance[] {
  const byDate = new Map<string, Set<number>>();
  for (const a of existing) {
    let ids = byDate.get(a.date);
    if (!ids) {
      ids = new Set();
      byDate.set(a.date, ids);
    }
    ids.add(a.childId);
  }

  const kept: NewAttendance[] = [];
  for (const row of rows) {
    const key = dateToDateStr(row.date);

    let ids = byDate.get(key);
    if (!ids) {
      ids = new Set();
      byDate.set(key, ids);
    }

    if (ids.has(row.childId)) continue;
    if (ids.size >= MAX_PER_DAY) continue;

    ids.add(row.childId);
    kept.push(row);
  }

  return kept;
}
