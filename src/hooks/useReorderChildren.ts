"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ChildListResponse } from "@/types/api";

async function putChildOrder(ids: number[]) {
  const res = await fetch("/api/children/order", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "並び替えに失敗しました");
  }
}

export function useReorderChildren() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putChildOrder,

    onMutate: async (ids: number[]) => {
      await queryClient.cancelQueries({ queryKey: ["children"] });

      const previous = queryClient.getQueryData<ChildListResponse>([
        "children",
      ]);

      if (previous) {
        const byId = new Map(previous.data.map((c) => [c.id, c]));
        const reordered = ids.flatMap((id) => byId.get(id) ?? []);
        queryClient.setQueryData<ChildListResponse>(["children"], {
          ...previous,
          data: reordered,
        });
      }

      return { previous };
    },

    onError: (error, _ids, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["children"], context.previous);
      }
      toast.error(error.message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
    },
  });
}
