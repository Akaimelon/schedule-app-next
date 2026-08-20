import Link from "next/link";
import { ChevronLeft, ChevronRight } from "./Icon";

export function CalendarNav({ year, month }: { year: number; month: number }) {
  const prev = new Date(year, month - 1, 1);
  const next = new Date(year, month + 1, 1);

  const btnClass =
    "inline-flex items-center gap-1 border-line-btn cursor-pointer rounded-[10px] border bg-white px-3.75 py-2 text-sm font-medium text-[#6b665d] transition-colors duration-120 hover:bg-[#fbf8f2]";

  return (
    <div className="mb-3 flex items-center justify-between gap-2.5 px-2 py-1">
      <Link
        className={btnClass}
        href={`/?year=${prev.getFullYear()}&month=${prev.getMonth() + 1}`}
      >
        <ChevronLeft />
        前月
      </Link>

      <div className="text-ink-strong text-center text-[26px] font-extrabold tracking-[1px]">
        {`${year}年 ${month + 1}月`}
      </div>

      <Link
        className={btnClass}
        href={`/?year=${next.getFullYear()}&month=${next.getMonth() + 1}`}
      >
        翌月
        <ChevronRight />
      </Link>
    </div>
  );
}
