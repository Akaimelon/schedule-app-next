"use client";

import { useAttendances } from "@/hooks/useAttendances";
import { useChildList } from "@/hooks/useChildList";
import { BarChartIcon } from "./Icon";

const TD = "border-b border-[#f2eee5] px-2 py-3 text-center";
const TH =
  "text-ink-soft border-b border-[#eee9df] bg-white px-2 py-3 text-center text-[13px] font-semibold whitespace-nowrap";

function remClass(rem: number) {
  if (rem < 0) return "font-semibold text-[#d75a5a]";
  if (rem === 0) return "text-ink-soft";
  return "";
}

export function Sidebar({ year, month }: { year: number; month: number }) {
  const { data: attendances } = useAttendances(year, month + 1);
  const { data: childData } = useChildList();

  const childList = childData?.data ?? [];
  const byChildId = Map.groupBy(attendances ?? [], (a) => a.childId);

  const usedOf = (childId: number) => byChildId.get(childId)?.length ?? 0;

  const totalContract = childList.reduce((sum, c) => sum + c.contractDays, 0);
  const totalUsed = childList.reduce((sum, c) => sum + usedOf(c.id), 0);
  const totalRem = totalContract - totalUsed;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="text-ink-strong inline-flex items-center gap-1 text-[19px] font-extrabold">
          <BarChartIcon />
          利用状況
        </div>
      </div>

      <table className="w-full table-fixed border-separate border-spacing-0 overflow-hidden rounded-xl border border-[#eee9df] text-sm [&_tbody_tr:last-child_td]:border-b-0">
        <thead>
          <tr>
            <th className={`${TH} w-[52%] pl-3.5 text-left`}>利用者</th>
            <th className={`${TH} w-[16%]`}>契約</th>
            <th className={`${TH} w-[16%]`}>利用</th>
            <th className={`${TH} w-[16%]`}>残</th>
          </tr>
        </thead>

        <tbody>
          {childList.map((child) => {
            const used = usedOf(child.id);
            const rem = child.contractDays - used;

            return (
              <tr key={child.id}>
                <td className={`${TD} pl-3.5 text-left`}>
                  <span className="flex min-w-0 items-center gap-2.25">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: child.color }}
                    />
                    <span className="truncate">{child.name}</span>
                  </span>
                </td>
                <td className={`${TD} text-ink-soft`}>{child.contractDays}</td>
                <td className={`${TD} font-semibold`}>{used}</td>
                <td className={`${TD} ${remClass(rem)}`}>{rem}</td>
              </tr>
            );
          })}

          <tr className="[&>td]:bg-panel2 [&>td]:font-bold">
            <td className={`${TD} pl-3.5 text-left`}>合計</td>
            <td className={TD}>{totalContract}</td>
            <td className={TD}>{totalUsed}</td>
            <td className={TD}>{totalRem}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
