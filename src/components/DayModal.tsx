"use client";

import { useChildList } from "@/hooks/useChildList";
import { useUiStore } from "@/stores/useUiStore";
import { useAttendances } from "@/hooks/useAttendances";
import {
  useRegisterAttendance,
  useCancelAttendance,
  useUpdateAttendance,
} from "@/hooks/useAttendanceMutations";
import { Modal } from "./Modal";
import {
  DAY_LABELS,
  TRANSPORT_OPTIONS,
  MAX_PER_DAY,
  type TransportKey,
} from "@/constants";
import { Attendance } from "@/types/api";


const TOGGLE_ACTIVE: Record<TransportKey, string> = {
  AM: "border-[#7cc1e8] bg-[#e2f3fc] text-[#2a7fb0]",
  PM: "border-[#e9a668] bg-[#fcebd6] text-[#c2742a]",
  pickup: "border-[#bbd8f0] bg-[#e3f0fb] text-[#3f82c6]",
  dropoff: "border-[#bbe0c8] bg-[#e4f3e8] text-[#4e9a5c]",
};

const TOGGLE_BOX_ACTIVE: Record<TransportKey, string> = {
  AM: "border-[#2a7fb0] bg-[#2a7fb0] text-white",
  PM: "border-[#c2742a] bg-[#c2742a] text-white",
  pickup: "border-[#3f82c6] bg-[#3f82c6] text-white",
  dropoff: "border-[#4e9a5c] bg-[#4e9a5c] text-white",
};

const PILL_BASE =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.25 text-[11px] font-semibold select-none";
const PILL_OFF = "border-line-btn bg-white";
const BOX_BASE =
  "inline-flex h-3.5 w-3.5 items-center justify-center rounded-sm border text-[10px] leading-none";
const BOX_OFF = "border-current bg-transparent";

function isOptionOn(attendance: Attendance | undefined, key: TransportKey) {
  if (!attendance) {
    return false;
  }
  if (key === "AM" || key === "PM") return attendance.timeFrame === key;
  return attendance[key];
}

export function DayModalContent({ date }: { date: string }) {
  const closeDay = useUiStore((s) => s.closeDay);

  const register = useRegisterAttendance();
  const cancel = useCancelAttendance();
  const update = useUpdateAttendance();
  const [year, month, day] = date.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  const title = `${year}年${month}月${day}日 (${DAY_LABELS[dateObj.getDay()]})`;
  const { data: attendances } = useAttendances(year, month);
  const { data: childData } = useChildList();
  const dayAttendances = attendances?.filter((a) => a.date === date) ?? [];
  const isFull = dayAttendances.length >= MAX_PER_DAY;
  const visibleChildren = (childData?.data ?? []).filter(
    (child) => !isFull || dayAttendances.some((a) => a.childId === child.id),
  );

  return (
    <Modal
      title={title}
      onClose={closeDay}
      panelClass="max-h-[88vh] w-157.5 max-w-[calc(100vw-32px)]"
    >
      <div className="text-ink-soft mb-2 text-xs font-bold">来る子を選択</div>

      {isFull && (
        <div className="mb-2 rounded-lg border border-[#fecdd3] bg-[#fff1f2] px-3 py-2 text-xs font-bold text-[#b42318]">
          この日は満員です（{MAX_PER_DAY}人）。これ以上追加できません。
        </div>
      )}

      {visibleChildren.map((child) => {
        const attendance = dayAttendances.find((a) => a.childId === child.id);
        const isAttending = Boolean(attendance);
        return (
          <div
            key={child.id}
            className={`mb-1.5 flex items-center gap-2.5 rounded-xl border px-3.25 py-2.75 transition-colors duration-100 ${
              isAttending ? "border-[#6ea8dc] bg-[#eaf2fb]" : "border-line"
            }`}
          >
            <div
              className={`mr-auto flex min-w-0 cursor-pointer items-center gap-2.25 rounded-lg p-1 select-none ${
                isAttending ? "" : "hover:bg-panel2"
              }`}
              onClick={() =>
                isAttending
                  ? cancel.mutate({ date, childId: child.id })
                  : register.mutate({ date, childId: child.id })
              }
            >
              <span
                className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] text-xs leading-none text-white ${
                  isAttending
                    ? "border-accent bg-accent"
                    : "border-line-btn bg-white"
                }`}
              >
                {isAttending ? "✓" : ""}
              </span>
              <span
                className="truncate text-sm font-semibold"
                style={{ color: child.color }}
              >
                {child.name}
              </span>
            </div>

            <div className="inline-flex flex-wrap items-center gap-1.5">
              {TRANSPORT_OPTIONS.map((opt) => {
                const isOn = isOptionOn(attendance, opt.key);

                return (
                  <button
                    key={opt.key}
                    disabled={!isAttending}
                    className={`${PILL_BASE} ${isOn ? TOGGLE_ACTIVE[opt.key] : PILL_OFF} ${
                      isAttending
                        ? "cursor-pointer"
                        : "cursor-not-allowed opacity-55"
                    }`}
                    onClick={() => {
                      const base = { date, childId: child.id };
                      if (opt.key === "AM" || opt.key === "PM") {
                        update.mutate({
                          ...base,
                          timeFrame: isOn ? null : opt.key,
                        });
                      } else if (opt.key === "pickup") {
                        update.mutate({ ...base, pickup: !isOn });
                      } else {
                        update.mutate({ ...base, dropoff: !isOn });
                      }
                    }}
                  >
                    <span
                      className={`${BOX_BASE} ${isOn ? TOGGLE_BOX_ACTIVE[opt.key] : BOX_OFF}`}
                    >
                      {isOn ? "✓" : ""}
                    </span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </Modal>
  );
}

export function DayModal() {
  const selectedDate = useUiStore((s) => s.selectedDate);

  if (!selectedDate) return null;

  return <DayModalContent date={selectedDate} />;
}
