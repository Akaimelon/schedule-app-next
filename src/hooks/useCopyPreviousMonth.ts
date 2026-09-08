"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CopyInput = { year: number; month: number };

async function postCopy(input: CopyInput): Promise<{ copied: number }> {
  const res = await fetch("/api/attendances/copy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      body?.errors?.[0]?.message ?? body?.error ?? "コピーに失敗しました",
    );
  }
  return res.json();
}

export function useCopyPreviousMonth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCopy,
    onSuccess: (data, input) => {
      queryClient.invalidateQueries({
        queryKey: ["attendances", input.year, input.month],
      });
      toast.success(`${data.copied}件コピーしました`);
    },
    onError: (error) => toast.error(error.message),
  });
}
