import { describe, it, expect } from "vitest";
import {
  toStr,
  getWeeks,
  dateStrToDate,
  dateToDateStr,
  getWeekdayOccurrence,
  findNthWeekday,
  dateStrToLocalDate,
} from "@/lib/date";

describe("toStr", () => {
  it("YYYY-MM-DD 形式に整形する", () => {
    expect(toStr(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("getWeeks", () => {
  it("その月が全部で何週あるかを確認する", () => {
    expect(getWeeks(2026, 7).length).toBe(5);
  });
});

describe("getWeeks", () => {
  it("最初の週の月曜が null である", () => {
    expect(getWeeks(2026, 8)[0][0]).toBe(null);
  });
});

describe("getWeeks", () => {
  it("各週がちょうど5要素", () => {
    expect(getWeeks(2026, 7).every((w) => w.length === 5)).toBe(true);
  });
});

describe("DBとの日付変換", () => {
  it("往復しても値が変わらない", () => {
    expect(dateToDateStr(dateStrToDate("2026-08-03"))).toBe("2026-08-03");
  });
});

describe("getWeekdayOccurrence", () => {
  it("2026-07-14 は第2火曜", () => {
    expect(getWeekdayOccurrence(new Date(2026, 6, 14))).toBe(2);
  });
  it("月初は第1週", () => {
    expect(getWeekdayOccurrence(new Date(2026, 6, 1))).toBe(1);
  });
});

describe("findNthWeekday", () => {
  it("2026年8月の第2火曜は 8/11", () => {
    expect(findNthWeekday(2026, 7, 2, 2)).toEqual(new Date(2026, 7, 11));
  });

  it("2026年8月に第5水曜は無い", () => {
    expect(findNthWeekday(2026, 7, 3, 5)).toBe(null);
  });
});

describe("dateStrToLocalDate", () => {
  it("ローカルタイムで曜日が取れる", () => {
    expect(dateStrToLocalDate("2026-07-14").getDay()).toBe(2);
  });

  it("DBから来た Date も文字列を挟めばローカルに直せる", () => {
    const fromDb = dateStrToDate("2026-07-14");
    expect(
      getWeekdayOccurrence(dateStrToLocalDate(dateToDateStr(fromDb))),
    ).toBe(2);
  });
});
