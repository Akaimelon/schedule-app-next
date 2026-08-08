"use client";

import { useChildList } from "@/hooks/useChildList";
import { useUiStore } from "@/stores/useUiStore";
import { useAttendances } from "@/hooks/useAttendances";
import {
  useRegisterAttendance,
  useCancelAttendance,
} from "@/hooks/useAttendanceMutations";

export function DayModalContent({ date }: { date: string }) {
  const closeDay = useUiStore((s) => s.closeDay);
  const [year, month] = date.split("-").map(Number);
  const { data: attendances } = useAttendances(year, month);
  const { data: childData } = useChildList();
  const register = useRegisterAttendance();
  const cancel = useCancelAttendance();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="rounded-lg bg-white p-6">
        <p>{date}</p>
        <ul>
          {childData?.data.map((child) => {
            const isAttending =
              attendances?.some(
                (a) => a.childId === child.id && a.date === date,
              ) ?? false;

            return (
              <li
                key={child.id}
                onClick={() =>
                  isAttending
                    ? cancel.mutate({ date, childId: child.id })
                    : register.mutate({ date, childId: child.id })
                }
                className="cursor-pointer"
              >
                <span>{isAttending ? "☑" : "☐"}</span>
                <span style={{ color: child.color }}>{child.name}</span>
              </li>
            );
          })}
        </ul>
        <button onClick={closeDay}>閉じる</button>
      </div>
    </div>
  );
}

export function DayModal() {
  const selectedDate = useUiStore((s) => s.selectedDate);

  if (!selectedDate) return null;

  return <DayModalContent date={selectedDate} />;
}
