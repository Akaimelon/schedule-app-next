"use client";

import { Modal } from "./Modal";

const CANCEL_CLASS =
  "border-line-btn h-9.5 cursor-pointer rounded-xl border bg-white px-4 text-sm hover:bg-[#fbf8f2]";
const DANGER_CLASS =
  "h-9.5 cursor-pointer rounded-xl border-none bg-[#d75a5a] px-4 text-sm font-semibold text-white hover:bg-[#c44848]";

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "削除する",
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      panelClass="w-[min(420px,calc(100vw-32px))]"
      footer={
        <div className="border-line flex shrink-0 justify-end gap-2 border-t px-5 py-3.5">
          <button type="button" className={CANCEL_CLASS} onClick={onCancel}>
            キャンセル
          </button>
          <button type="button" className={DANGER_CLASS} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      }
    >
      <p className="text-sm whitespace-pre-line">{message}</p>
    </Modal>
  );
}
