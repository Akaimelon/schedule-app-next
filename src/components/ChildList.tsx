"use client";

import { useChildList } from "@/hooks/useChildList";
import { ChildListSkeleton } from "./ChildListSkeleton";
import { ChildRow } from "./ChildRow";
import { CHILD_GRID_COLS } from "./ChildRow";

export function ChildList() {
  const { data, isPending, isError } = useChildList();

  if (isPending) return <ChildListSkeleton />;
  if (isError) return <p>エラーが発生しました</p>;

  return (
    <>
      {data.data.length > 0 && (
        <div
          className="text-ink-soft mb-2 grid gap-2 px-3 text-[11px]"
          style={{ gridTemplateColumns: CHILD_GRID_COLS }}
        >
          <div />
          <div>名前</div>
          <div>契約日数</div>
          <div>午前/午後</div>
          <div>名前色</div>
          <div />
        </div>
      )}

      <ul className="flex list-none flex-col">
        {data.data.map((child) => (
          <ChildRow key={child.id} child={child} />
        ))}
      </ul>
    </>
  );
}
