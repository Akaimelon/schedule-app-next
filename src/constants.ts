export const WEEKDAYS = ["月", "火", "水", "木", "金"] as const;
export const DAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"] as const;

export const TRANSPORT_OPTIONS = [
  { key: "AM", label: "午前", mark: "前" },
  { key: "PM", label: "午後", mark: "後" },
  { key: "pickup", label: "迎え", mark: "迎" },
  { key: "dropoff", label: "送り", mark: "送" },
] as const;

export const TIME_OPTIONS = [
  { value: "", label: "なし" },
  { value: "AM", label: "午前" },
  { value: "PM", label: "午後" },
] as const;

export type TransportKey = (typeof TRANSPORT_OPTIONS)[number]["key"];

//契約上の利用定員が10のため
export const MAX_PER_DAY = 10;

export const CHILD_COLORS = [
  "#000000",
  "#C44040",
  "#185FA5",
  "#1D9E75",
] as const;

export const HOLIDAY_API = "https://holidays-jp.github.io/api/v1";
