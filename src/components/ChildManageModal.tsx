"use client";

import { useUiStore } from "@/stores/useUiStore";
import { Modal } from "./Modal";
import { ChildList } from "./ChildList";
import { ChildForm } from "./ChildForm";

export function ChildManageModal() {
  const isOpen = useUiStore((s) => s.isChildModalOpen);
  const close = useUiStore((s) => s.closeChildModal);

  if (!isOpen) return null;

  return (
    <Modal
      title="子供管理"
      onClose={close}
      panelClass="h-[min(88vh,940px)] w-[min(912px,100%)] max-w-[calc(100vw-32px)] min-w-70"
      footer={
        <div className="border-line flex shrink-0 justify-end gap-2 border-t px-5 py-3.5">
          <button
            className="border-line-btn h-9.5 cursor-pointer rounded-xl border bg-white px-4 text-sm hover:bg-[#fbf8f2]"
            onClick={close}
          >
            閉じる
          </button>
        </div>
      }
    >
      <div className="text-ink-soft mb-2 text-xs font-bold">新しい子を追加</div>
      <ChildForm />

      <div className="text-ink-soft mb-2 text-xs font-bold">登録済み</div>
      <ChildList />
    </Modal>
  );
}
