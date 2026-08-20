import {
  findAttendancesByMonth,
  upsertAttendance,
  deleteAttendance,
  findAttendance,
  updateAttendance,
  countAttendanceByDate,
} from "@/repositories/attendanceRepository";
import { findChildById } from "@/repositories/childRepository";
import { dateToDateStr, dateStrToDate } from "@/lib/date";
import { Attendance } from "@/types/api";
import { AttendancePatchInput } from "@/schemas/attendanceSchema";
import { MAX_PER_DAY } from "@/constants";

function toAttendanceDto(a: {
  date: Date;
  childId: number;
  timeFrame: "AM" | "PM" | null;
  pickup: boolean;
  dropoff: boolean;
}): Attendance {
  return {
    date: dateToDateStr(a.date),
    childId: a.childId,
    timeFrame: a.timeFrame,
    pickup: a.pickup,
    dropoff: a.dropoff,
  };
}

export async function getMonthlyAttendances({
  year,
  month,
}: {
  year: number;
  month: number;
}): Promise<Attendance[]> {
  const attendances = await findAttendancesByMonth(year, month);
  return attendances.map(toAttendanceDto);
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
  const d = dateStrToDate(date);
  const existing = await findAttendance(d, childId);

  if (!existing) {
    const count = await countAttendanceByDate(d);
    if (count >= MAX_PER_DAY) {
      return {
        ok: false,
        status: 409,
        message: `1日に登録できるのは${MAX_PER_DAY}人までです`,
      };
    }
  }

  const attendance = await upsertAttendance(d, childId, child.defaultTimeFrame);
  return {
    ok: true,
    attendance: toAttendanceDto(attendance),
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

export async function changeAttendanceOptions({
  date,
  childId,
  timeFrame,
  pickup,
  dropoff,
}: AttendancePatchInput): Promise<
  | { ok: false; status: number; message: string }
  | { ok: true; attendance: Attendance }
> {
  const d = dateStrToDate(date);
  const existing = await findAttendance(d, childId);
  if (!existing) {
    return { ok: false, status: 404, message: "その行がありません" };
  }
  const update = await updateAttendance(d, childId, {
    timeFrame,
    pickup,
    dropoff,
  });

  return {
    ok: true,
    attendance: toAttendanceDto(update),
  };
}
