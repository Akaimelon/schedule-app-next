"use client";

import Image from "next/image";
import { UsersIcon, CopyIcon } from "@/components/Icon";
import { useUiStore } from "@/stores/useUiStore";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useCopyPreviousMonth } from "@/hooks/useCopyPreviousMonth";

export function Header({ year, month }: { year: number; month: number }) {
  const openChildModal = useUiStore((s) => s.openChildModal);
  const [confirming, setConfirming] = useState(false);
  const copy = useCopyPreviousMonth();

  const BASE_BTN =
    "inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.75 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors duration-120";

  const SOFT_BTN =
    "border-line-btn border font-medium text-[#56524b] hover:border-[#e0d9cc] hover:bg-[#fbf8f2]";

  const PRIMARY_BTN =
    "text-accent border-[1.5px] border-[#6ea8dc] font-semibold hover:bg-[#f3f8fd]";

  return (
    <header className="mb-5.5 flex items-start justify-between gap-6 max-[980px]:flex-col max-[980px]:items-stretch">
      <div className="flex items-center gap-4">
        <Image
          src="/house_icon.png"
          alt=""
          width={96}
          height={91}
          className={"h-15 w-15 shrink-0 object-contain"}
        />
        <div>
          <div className="text-ink-strong text-[28px] font-extrabold tracking-[1px] whitespace-nowrap">
            ひまわり予定表
          </div>
          <div className="text-ink-muted mt-1 text-sm">
            月間スケジュールを管理し、子どもたちの利用状況を把握しましょう
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          className={`${BASE_BTN} ${SOFT_BTN}`}
          onClick={() => setConfirming(true)}
        >
          <CopyIcon />
          先月コピー
        </button>
        <button
          className={`${BASE_BTN} ${PRIMARY_BTN}`}
          onClick={openChildModal}
        >
          <UsersIcon />
          子供管理
        </button>
      </div>
      {confirming && (
        <ConfirmDialog
          title="先月の予定をコピー"
          message={`先月の予定を${month + 1}月に写します。\n祝日と、既に入っている予定はそのままです。`}
          confirmLabel="コピーする"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            copy.mutate({ year, month: month + 1 });
          }}
        />
      )}
    </header>
  );
}
