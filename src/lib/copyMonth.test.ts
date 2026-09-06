import { describe, it, expect } from "vitest";
import { mapToTargetMonth } from "@/lib/copyMonth";
import { dateStrToDate, dateToDateStr } from "@/lib/date";
import type { Attendance } from "@/types/api";

const HOLIDAYS = { "2026-08-11": "山の日" };

function src(date: string): Attendance {
  return { date, childId: 1, timeFrame: "AM", pickup: false, dropoff: false };
}

describe("mapToTargetMonth", () => {
  it("第1火曜は第1火曜に写る（7/7 → 8/4）", () => {
    const rows = mapToTargetMonth([src("2026-07-07")], 2026, 7, {});
    expect(rows.length).toBe(1);
    expect(dateToDateStr(rows[0].date)).toBe("2026-08-04");
  });

  it("写す先が祝日なら捨てる（7/14 → 8/11 は山の日）", () => {
    const rows = mapToTargetMonth([src("2026-07-14")], 2026, 7, HOLIDAYS);
    expect(rows.length).toBe(0);
  });

  it("写す先の第5週が無ければ捨てる（7/29 は第5水曜、8月に第5水曜は無い）", () => {
    const rows = mapToTargetMonth([src("2026-07-29")], 2026, 7, {});
    expect(rows.length).toBe(0);
  });

  it("出席のオプションはそのまま運ばれる", () => {
    const source: Attendance = {
      date: "2026-07-07",
      childId: 3,
      timeFrame: "PM",
      pickup: true,
      dropoff: false,
    };
    const rows = mapToTargetMonth([source], 2026, 7, {});
    expect(rows[0]).toEqual({
      date: dateStrToDate("2026-08-04"),
      childId: 3,
      timeFrame: "PM",
      pickup: true,
      dropoff: false,
    });
  });
});
