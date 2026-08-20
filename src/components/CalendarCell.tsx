import { toStr } from "@/lib/date";
import type { Attendance, Child } from "@/types/api";
import { Chip } from "@/components/Chip";

const CELL_BASE = "rounded-[14px] border align-top";

const EMPTY_CELL = "cursor-default border-dashed border-[#eae3d5] bg-[#fbf8f2]";

const DATE_CELL =
  "min-h-30 cursor-pointer px-1.5 py-2 transition-[box-shadow,border-color] duration-120 hover:border-[#dcd3c2] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]";

const TONE_TODAY = "border-[#ead9a0] bg-[#fdf8e6]";
const TONE_NORMAL = "border-line bg-white";
const TONE_HOLIDAY = "border-line bg-[#fff9fa]";

const BADGE_BASE =
  "flex h-5.5 w-5.5 items-center justify-center rounded-full text-[13px] font-bold";
const BADGE_TODAY = "bg-[#5c97d8] text-white";
const BADGE_NORMAL = "text-[#454541]";
const BADGE_HOLIDAY =
  "mb-1 inline-flex max-w-full items-center truncate rounded-full border border-[#fecdd3] bg-[#fff1f2] px-1.5 py-px text-[10px] text-[#b42318]";

function pickTone(isToday: boolean, holidayName: string | undefined) {
  if (isToday) return TONE_TODAY;
  if (holidayName) return TONE_HOLIDAY;
  return TONE_NORMAL;
}

export function CalendarCell({
  date,
  dayAttendances,
  childList,
  holidayName,
  onSelect,
}: {
  date: Date | null;
  dayAttendances: Attendance[];
  childList: Child[];
  holidayName: string | undefined;
  onSelect: () => void;
}) {
  if (!date) {
    return <td className={`${CELL_BASE} ${EMPTY_CELL}`} />;
  }

  const isToday = toStr(date) === toStr(new Date());
  const tone = pickTone(isToday, holidayName);

  return (
    <td className={`${CELL_BASE} ${DATE_CELL} ${tone}`} onClick={onSelect}>
      <span
        className={` ${BADGE_BASE} ${isToday ? BADGE_TODAY : BADGE_NORMAL}`}
      >
        {date.getDate()}
      </span>
      {holidayName && <span className={BADGE_HOLIDAY}>{holidayName}</span>}
      <div className="mt-0.75 grid grid-cols-2 items-start gap-x-1 gap-y-0.5">
        {dayAttendances.map((a) => {
          const child = childList.find((c) => c.id === a.childId);
          return <Chip key={a.childId} child={child} attendance={a} />;
        })}
      </div>
    </td>
  );
}
