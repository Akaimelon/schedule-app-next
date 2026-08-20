"use client";

import { useEffect, useRef } from "react";

export const Modal = ({
  title,
  onClose,
  panelClass,
  children,
}: {
  title: string;
  onClose: () => void;
  panelClass?: string;
  children: React.ReactNode;
}) => {
  const pressedOnOverlay = useRef(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-500 flex items-center justify-center bg-[rgba(60,52,40,0.32)] p-4"
      onPointerDown={(e) => {
        pressedOnOverlay.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && pressedOnOverlay.current) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`border-line flex flex-col rounded-[18px] border bg-white shadow-[0_12px_40px_rgba(60,52,40,0.18)] ${panelClass}`}
      >
        <div className="border-line flex shrink-0 items-center justify-between border-b px-5 py-4">
          <div className="text-ink-strong text-[17px] font-extrabold">
            {title}
          </div>
          <button
            className="text-ink-muted hover:text-ink cursor-pointer border-none bg-transparent p-0 text-[22px] leading-none"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
};
