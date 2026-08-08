"use client";

import { useChildList } from "@/hooks/useChildList";
import { ChildListSkeleton } from "./ChildListSkelton";

export function ChildList() {
  const { data, isPending, isError } = useChildList();

  if (isPending) return <ChildListSkeleton />;
  if (isError) return <p>エラーが発生しました</p>;

  return (
    <ul>
      {data.data.map((child) => (
        <li key={child.id} style={{ color: child.color }}>
          {child.name}（契約 {child.contractDays} 日）
        </li>
      ))}
    </ul>
  );
}
