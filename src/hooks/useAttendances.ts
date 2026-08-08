"use client";

import { useQuery } from "@tanstack/react-query";
import type { Attendance } from "@/types/api";

async function fetchAttendances(year: number, month: number): Promise<Attendance[]> {
  const res = await fetch(`/api/attendances?year=${year}&month=${month}`);
  if (!res.ok) throw new Error("出席の取得に失敗しました");
  return res.json();
}

export function useAttendances(year: number, month: number) {
  return useQuery({
    queryKey: ["attendances", year, month],
    queryFn: () => fetchAttendances(year, month),
  });
}