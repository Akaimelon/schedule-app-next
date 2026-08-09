"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ChildList } from "./ChildList";
import { ChildForm } from "./ChildForm";

export function ChildPanel() {
  const [isOpen, setIsOpen] = useLocalStorage("child-panel-open", true);

  return (
    <section>
      <button onClick={() => setIsOpen(!isOpen)}>
        子供管理 {isOpen ? "▲" : "▼"}
      </button>

      {isOpen && (
        <>
          <ChildList />
          <ChildForm />
        </>
      )}
    </section>
  );
}