"use client";

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useUpdateChild } from "@/hooks/useUpdateChild";
import type { Child } from "@/types/api";

export function ChildRow({ child }: { child: Child }) {
  const [name, setName] = useState(child.name);
  const debouncedName = useDebounce(name);
  const updateChild = useUpdateChild();
  const lastSaved = useRef(child.name);

  useEffect(() => {
    if (debouncedName === lastSaved.current) return;

    lastSaved.current = debouncedName;
    updateChild.mutate({ id: child.id, name: debouncedName });
  }, [debouncedName, child.id, updateChild]);

  return (
    <li>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ color: child.color }}
      />
    </li>
  );
}
