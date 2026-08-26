"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function deleteChild(id: number) {
  const res = await fetch(`/api/children/${id}`, { method: "DELETE" });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "削除に失敗しました");
  }
}

export function useDeleteChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChild,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
      toast.success("削除しました");
    },
    onError: (error) => toast.error(error.message),
  });
}
