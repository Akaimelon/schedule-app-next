"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UpdateChildInput } from "@/schemas/childSchema";
import type { Child } from "@/types/api";

async function patchChild(id: number, input: UpdateChildInput): Promise<Child> {
  const res = await fetch(`/api/children/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      body?.errors?.[0]?.message ?? body?.error ?? "更新に失敗しました",
    );
  }

  return res.json();
}

export function useUpdateChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: UpdateChildInput & { id: number }) =>
      patchChild(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
    },
    onError: (error) => toast.error(error.message),
  });
}
