import type { Attendance, Child } from "@/types/api";

const CHIP_BASE =
  "mt-0.75 flex max-w-full items-center rounded-lg border px-1.5 py-0.5 text-sm font-bold";

const CHIP_TONE = {
  AM: "bg-[#E2F3FC] border-[#7CC1E8]",
  PM: "bg-[#FCEBD6] border-[#E9A668]",
  none: "bg-white border-[#d0d5db]",
};

const MARK_BASE =
  "ml-0.75 inline-flex h-4.25 w-4.25 shrink-0 items-center justify-center rounded-full border text-[10px] leading-none font-bold";

const MARK_PICKUP = "bg-[#edf5ff] border-[#c9def7] text-[#0c447c]";
const MARK_DROPOFF = "bg-[#e8f5ee] border-[#cbe6d7] text-[#0f5132]";

export function Chip({
  child,
  attendance,
}: {
  child: Child | undefined;
  attendance: Attendance;
}) {
  const tone = CHIP_TONE[attendance.timeFrame ?? "none"];

  return (
    <div className={`${CHIP_BASE} ${tone}`} style={{ color: child?.color }}>
      <span className="min-w-0 truncate">{child?.name}</span>

      {attendance.pickup && (
        <span className={`${MARK_BASE} ${MARK_PICKUP}`}>迎</span>
      )}
      {attendance.dropoff && (
        <span className={`${MARK_BASE} ${MARK_DROPOFF}`}>送</span>
      )}
    </div>
  );
}
