"use client";

import { useQuery } from "@tanstack/react-query";
import type { ChildListResponse } from "@/types/api";

async function fetchChildList(): Promise<ChildListResponse> {
  const res = await fetch("/api/children?limit=100");
  if (!res.ok) {
    throw new Error("子供の取得に失敗しました");
  }
  return res.json();
}

export function useChildList() {
  return useQuery({
    queryKey: ["children"],
    queryFn: fetchChildList,
  });
}
