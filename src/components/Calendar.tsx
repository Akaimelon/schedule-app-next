"use client";

import { getWeeks, toStr } from "@/lib/date";
import { useAttendances } from "@/hooks/useAttendances";
import { useChildList } from "@/hooks/useChildList";
import { useUiStore } from "@/stores/useUiStore";
import Link from "next/link";

const Calendar = ({ year, month }: { year: number; month: number }) => {
  const weeks = getWeeks(year, month);
  const prev = new Date(year, month - 1, 1);
  const next = new Date(year, month + 1, 1);

  const { data: attendances } = useAttendances(year, month + 1);
  const { data: childData } = useChildList();

  const openDay = useUiStore((s) => s.openDay);

  const btnClass =
    "inline-flex items-center gap-1 border-line-btn cursor-pointer rounded-[10px] border bg-white px-3.75 py-2 text-sm font-medium text-[#6b665d] transition-colors duration-120 hover:bg-[#fbf8f2]";

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2.5 px-2 py-1">
        <Link
          className={btnClass}
          href={`/?year=${prev.getFullYear()}&month=${prev.getMonth() + 1}`}
        >
          前月
        </Link>
        <span>
          {year}年{month + 1}月
        </span>
        <Link
          className={btnClass}
          href={`/?year=${next.getFullYear()}&month=${next.getMonth() + 1}`}
        >
          翌月
        </Link>
      </div>
      <table className="w-full table-fixed border-separate border-spacing-1.5">
        <thead>
          <tr>
            {["月", "火", "水", "木", "金"].map((day) => (
              <th
                key={day}
                className="text-ink-soft rounded-lg bg-[#f6f2ea] py-2.25 font-semibold"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((date, dateIndex) => {
                const dateStr = date ? toStr(date) : "";
                const dayAttendances =
                  attendances?.filter((a) => a.date === dateStr) ?? [];
                return (
                  <td key={dateIndex} onClick={() => date && openDay(dateStr)}>
                    {date && (
                      <>
                        <div>{date.getDate()}</div>
                        {dayAttendances.map((a) => {
                          const child = childData?.data.find(
                            (c) => c.id === a.childId,
                          );
                          return (
                            <div
                              key={a.childId}
                              style={{ color: child?.color }}
                            >
                              {child?.name}
                            </div>
                          );
                        })}
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Calendar;
