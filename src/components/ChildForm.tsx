"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createChildSchema,
  type CreateChildInput,
} from "@/schemas/childSchema";
import { useAddChild } from "@/hooks/useAddChild";
import { ColorSwatches } from "./ColorSwatches";
import {
  CHILD_COLORS,
  CONTRACT_PER_MONTH_OPTIONS,
  TIME_OPTIONS,
} from "@/constants";

const INPUT_CLASS =
  "border-line-btn focus:border-accent h-9 w-full rounded-xl border bg-white px-3 text-sm outline-none";
const GRID_COLS = "1.7fr 0.9fr 0.9fr 1.1fr auto";

export function ChildForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateChildInput>({
    resolver: zodResolver(createChildSchema),
    defaultValues: {
      name: "",
      color: CHILD_COLORS[0],
      contractDays: 0,
      defaultTimeFrame: null,
    },
  });
  const addChild = useAddChild();
  const onSubmit = (values: CreateChildInput) => {
    addChild.mutate(values, {
      onSuccess: () => reset(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <div
        className="grid items-center gap-2"
        style={{ gridTemplateColumns: GRID_COLS }}
      >
        <input
          {...register("name")}
          placeholder="名前"
          className={INPUT_CLASS}
        />

        <select
          {...register("contractDays", { valueAsNumber: true })}
          className={INPUT_CLASS}
        >
          {CONTRACT_PER_MONTH_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}日
            </option>
          ))}
        </select>

        <select
          {...register("defaultTimeFrame", {
            setValueAs: (v) => (v === "" ? null : v),
          })}
          className={INPUT_CLASS}
        >
          {TIME_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <ColorSwatches value={field.value} onChange={field.onChange} />
          )}
        />

        <button
          type="submit"
          disabled={addChild.isPending}
          className="bg-accent h-9 shrink-0 cursor-pointer rounded-xl border-none px-4.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          追加
        </button>
      </div>

      {errors.name && (
        <p className="mt-1 text-xs text-[#b42318]">{errors.name.message}</p>
      )}
      {errors.contractDays && (
        <p className="mt-1 text-xs text-[#b42318]">
          {errors.contractDays.message}
        </p>
      )}
    </form>
  );
}
