import { HOLIDAY_API } from "@/constants";

export type Holidays = Record<string, string>;

export async function fetchHolidays(year: number): Promise<Holidays> {
  const res = await fetch(`${HOLIDAY_API}/${year}/date.json`);

  if (!res.ok) {
    throw new Error("祝日の取得に失敗しました");
  }

  return res.json();
}
