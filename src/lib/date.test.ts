import { describe, it, expect } from "vitest";
import { toStr, getWeeks, dateStrToDate, dateToDateStr } from "@/lib/date";

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
   expect(getWeeks(2026, 8)[0][0]).toBe(null)
  });
});


describe("getWeeks", () => {
  it("各週がちょうど5要素", () => {
   expect(getWeeks(2026, 7).every((w) => w.length === 5)).toBe(true)
  });
});

describe("DBとの日付変換", () => {
  it("往復しても値が変わらない", () => {
    expect(dateToDateStr(dateStrToDate("2026-08-03"))).toBe("2026-08-03");
  });
});