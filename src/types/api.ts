export type FieldError = {
  field: string;
  message: string;
};

export type Child = {
  id: number;
  name: string;
  color: string;
  contractDays: number;
  sortOrder: number;
};

export type ChildListResponse = {
  data: Child[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Attendance = {
  date: string;
  childId: number;
  timeFrame: "AM" | "PM" | null;
  pickup: boolean;
  dropoff: boolean;
};
