export function toStr(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getWeeks(year: number, month: number): (Date | null)[][] {
  const weeks = new Map<string, (Date | null)[]>();
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    const dayOfWeek = date.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const monday = new Date(date);
      monday.setDate(date.getDate() - (dayOfWeek - 1));
      const weekKey = toStr(monday);
      let week = weeks.get(weekKey);
      if (!week) {
        week = [null, null, null, null, null];
        weeks.set(weekKey, week);
      }
      week[dayOfWeek - 1] = new Date(date);
    }
    date.setDate(date.getDate() + 1);
  }
  return [...weeks.values()];
}

export function dateStrToDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00Z`);
}

export function dateToDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}
