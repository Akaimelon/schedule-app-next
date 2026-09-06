import {
  dateStrToLocalDate,
  dateStrToDate,
  toStr,
  getWeekdayOccurrence,
  findNthWeekday,
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
