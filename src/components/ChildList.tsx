"use client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useReorderChildren } from "@/hooks/useReorderChildren";
import { useChildList } from "@/hooks/useChildList";
import { ChildListSkeleton } from "./ChildListSkeleton";
import { ChildRow } from "./ChildRow";
import { CHILD_GRID_COLS } from "./ChildRow";

export function ChildList() {
  const { data, isPending, isError } = useChildList();
  const reorder = useReorderChildren();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (isPending) return <ChildListSkeleton />;
  if (isError) return <p>エラーが発生しました</p>;

  const ids = data.data.map((c) => c.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(Number(active.id));
    const newIndex = ids.indexOf(Number(over.id));
    reorder.mutate(arrayMove(ids, oldIndex, newIndex));
  };

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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <ul className="flex list-none flex-col">
            {data.data.map((child) => (
              <ChildRow key={child.id} child={child} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </>
  );
}
