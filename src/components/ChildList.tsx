"use client";

import { useChildList } from "@/hooks/useChildList";
import { ChildListSkeleton } from "./ChildListSkeleton";
import { ChildRow } from "./ChildRow";

export function ChildList() {
  const { data, isPending, isError } = useChildList();

  if (isPending) return <ChildListSkeleton />;
  if (isError) return <p>エラーが発生しました</p>;

  return (
    <ul>
      {data.data.map((child) => (
        <ChildRow key={child.id} child={child} />
      ))}
    </ul>
  );
}
