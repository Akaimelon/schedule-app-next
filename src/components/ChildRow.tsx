"use client";

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useDeleteChild } from "@/hooks/useDeleteChild";
import { useUpdateChild } from "@/hooks/useUpdateChild";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ColorSwatches } from "@/components/ColorSwatches";
import { CONTRACT_PER_MONTH_OPTIONS, TIME_OPTIONS } from "@/constants";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Child } from "@/types/api";

const INPUT_CLASS =
  "border-line-btn focus:border-accent h-9 w-full rounded-xl border bg-white px-3 text-sm outline-none";

export const CHILD_GRID_COLS =
  "30px minmax(110px,1fr) 84px 92px minmax(160px,1.8fr) 30px";

function toTimeFrame(value: string): Child["defaultTimeFrame"] {
  return value === "AM" || value === "PM" ? value : null;
}

export function ChildRow({ child }: { child: Child }) {
  const [name, setName] = useState(child.name);
  const debouncedName = useDebounce(name);
  const updateChild = useUpdateChild();
  const lastSaved = useRef(child.name);
  const deleteChild = useDeleteChild();
  const [confirming, setConfirming] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: child.id });

  useEffect(() => {
    if (debouncedName === lastSaved.current) return;

    lastSaved.current = debouncedName;
    updateChild.mutate({ id: child.id, name: debouncedName });
  }, [debouncedName, child.id, updateChild]);

  return (
    <li
      ref={setNodeRef}
      className={`mb-2 grid items-center gap-2 rounded-xl border px-3 py-2.5 ${
        isDragging
          ? "border-[#6ea8dc] bg-[#eaf2fb] shadow-[inset_0_0_0_1px_rgba(74,134,196,0.18)]"
          : "border-line bg-white"
      }`}
      style={{
        gridTemplateColumns: CHILD_GRID_COLS,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div
        {...attributes}
        {...listeners}
        className="text-ink-muted flex cursor-grab touch-none items-center justify-center select-none active:cursor-grabbing"
      >
        ⋮⋮
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ color: child.color }}
        className={`${INPUT_CLASS} font-semibold`}
      />
      <select
        value={child.contractDays}
        onChange={(e) =>
          updateChild.mutate({
            id: child.id,
            contractDays: Number(e.target.value),
          })
        }
        className={INPUT_CLASS}
      >
        {CONTRACT_PER_MONTH_OPTIONS.map((n) => (
          <option key={n} value={n}>
            {n}日
          </option>
        ))}
      </select>

      <select
        value={child.defaultTimeFrame ?? ""}
        onChange={(e) =>
          updateChild.mutate({
            id: child.id,
            defaultTimeFrame: toTimeFrame(e.target.value),
          })
        }
        className={INPUT_CLASS}
      >
        {TIME_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <ColorSwatches
        value={child.color}
        onChange={(color) => updateChild.mutate({ id: child.id, color: color })}
      />

      <button
        type="button"
        className="text-ink-muted h-8 w-8 shrink-0 cursor-pointer rounded-md border-none bg-transparent text-base hover:bg-[#fbe9e9] hover:text-[#d75a5a]"
        onClick={() => setConfirming(true)}
      >
        ×
      </button>
      {confirming && (
        <ConfirmDialog
          title="子供を削除"
          message={`${child.name} を削除します。\nこの子の出席記録もすべて消えます。元に戻せません。`}
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            deleteChild.mutate(child.id);
          }}
        />
      )}
    </li>
  );
}
