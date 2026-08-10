"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type AttendanceInput = { date: string; childId: number };

async function sendAttendance(
  method: "POST" | "DELETE",
  input: AttendanceInput,
) {
  const res = await fetch("/api/attendances", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      body?.errors?.[0]?.message ?? body?.error ?? "更新に失敗しました",
    );
  }
}

function attendanceQueryKey(date: string) {
  const [year, month] = date.split("-").map(Number);
  return ["attendances", year, month];
}

export function useRegisterAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AttendanceInput) => sendAttendance("POST", input),
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({
        queryKey: attendanceQueryKey(input.date),
      });
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCancelAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AttendanceInput) => sendAttendance("DELETE", input),
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({
        queryKey: attendanceQueryKey(input.date),
      });
    },
    onError: (error) => toast.error(error.message),
  });
}
