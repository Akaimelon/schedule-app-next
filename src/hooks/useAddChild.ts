"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateChildInput } from "@/schemas/childSchema";
import type { Child } from "@/types/api";
import { toast } from "sonner";

async function postChild(input: CreateChildInput): Promise<Child> {
  const res = await fetch("/api/children", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      body?.errors?.[0]?.message ?? body?.error ?? "登録に失敗しました";
    throw new Error(message);
  }
  return res.json();
}

export function useAddChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postChild,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      toast.success("登録しました");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
