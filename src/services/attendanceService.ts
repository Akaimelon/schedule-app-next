import {
  findAttendancesByMonth,
  upsertAttendance,
  deleteAttendance,
} from "@/repositories/attendanceRepository";
import { findChildById } from "@/repositories/childRepository";
import { dateToDateStr, dateStrToDate } from "@/lib/date";
import { Attendance } from "@/types/api";

export async function getMonthlyAttendances({
  year,
  month,
}: {
  year: number;
  month: number;
}): Promise<Attendance[]> {
  const attendances = await findAttendancesByMonth(year, month);
  return attendances.map((a) => ({
    date: dateToDateStr(a.date),
    childId: a.childId,
    timeFrame: a.timeFrame,
    pickup: a.pickup,
    dropoff: a.dropoff,
  }));
}

export async function registerAttendance({
  date,
  childId,
}: {
  date: string;
  childId: number;
}): Promise<
  | { ok: false; status: number; message: string }
  | { ok: true; attendance: Attendance }
> {
  const child = await findChildById(childId);

  if (!child) {
    return { ok: false, status: 404, message: "子供が見つかりません" };
  }

  const attendance = await upsertAttendance(
    dateStrToDate(date),
    childId,
    child.defaultTimeFrame,
  );
  return {
    ok: true,
    attendance: {
      date: dateToDateStr(attendance.date),
      childId: attendance.childId,
      timeFrame: attendance.timeFrame,
      pickup: attendance.pickup,
      dropoff: attendance.dropoff,
    },
  };
}

export async function cancelAttendance({
  date,
  childId,
}: {
  date: string;
  childId: number;
}) {
  await deleteAttendance(dateStrToDate(date), childId);
}
