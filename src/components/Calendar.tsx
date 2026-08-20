"use client";

import { getWeeks, toStr } from "@/lib/date";
import { useAttendances } from "@/hooks/useAttendances";
import { useChildList } from "@/hooks/useChildList";
import { useUiStore } from "@/stores/useUiStore";
import { CalendarNav } from "./CalendarNav";
import { CalendarCell } from "./CalendarCell";
import { useHolidays } from "@/hooks/useHolidays";
import { WEEKDAYS } from "@/constants";

const Calendar = ({ year, month }: { year: number; month: number }) => {
  const weeks = getWeeks(year, month);

  const { data: attendances } = useAttendances(year, month + 1);
  const { data: childData } = useChildList();
  const { data: holidays } = useHolidays(year);

  const openDay = useUiStore((s) => s.openDay);

  const childList = childData?.data ?? [];
  const attendancesByDate = Map.groupBy(attendances ?? [], (a) => a.date);

  return (
    <>
      <CalendarNav year={year} month={month} />
      <table className="w-full table-fixed border-separate border-spacing-1.5">
        <thead>
          <tr>
            {WEEKDAYS.map((day) => (
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
                const dayAttendances = attendancesByDate.get(dateStr) ?? [];
                const holidayName = holidays?.[dateStr];
                return (
                  <CalendarCell
                    key={dateIndex}
                    date={date}
                    dayAttendances={dayAttendances}
                    childList={childList}
                    holidayName={holidayName}
                    onSelect={() => openDay(dateStr)}
                  />
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
