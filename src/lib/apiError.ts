import type { ZodError } from "zod";
import type { FieldError } from "@/types/api";

export function toFieldErrors(error: ZodError): FieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}