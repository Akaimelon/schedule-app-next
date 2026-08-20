"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createChildSchema,
  type CreateChildInput,
} from "@/schemas/childSchema";
import { useAddChild } from "@/hooks/useAddChild";

export function ChildForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateChildInput>({
    resolver: zodResolver(createChildSchema),
    defaultValues: {
      name: "",
      color: "#4a86c4",
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register("name")} placeholder="名前" />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <input
          type="number"
          {...register("contractDays", { valueAsNumber: true })}
        />
        {errors.contractDays && <p>{errors.contractDays.message}</p>}
      </div>

      <div>
        <input type="color" {...register("color")} />
        {errors.color && <p>{errors.color.message}</p>}
      </div>

      <button type="submit" disabled={addChild.isPending}>
        追加
      </button>
    </form>
  );
}
