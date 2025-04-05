export enum EventRecurringType {
  None = 0,
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Yearly = 4,
}

export default class Event {
  id: number;
  title: string;
  description: string | null;
  start_time: number | null;
  end_time: number | null;
  start_time_str: string | null;
  end_time_str: string | null;
  recurring_type: EventRecurringType;
  recurring_dow: number | null;
  recurring_date: number | null;
  recurring_month: number | null;
  deleted_at: number | null;

  constructor(data: Partial<Event> = {}) {
    this.id = data.id ?? 0;
    this.title = data.title ?? "";
    this.description = data.description ?? null;
    this.start_time = data.start_time ?? null;
    this.end_time = data.end_time ?? null;
    this.start_time_str = data.start_time_str ?? null;
    this.end_time_str = data.end_time_str ?? null;
    this.recurring_type = data.recurring_type ?? EventRecurringType.None;
    this.recurring_dow = data.recurring_dow ?? null;
    this.recurring_date = data.recurring_date ?? null;
    this.recurring_month = data.recurring_month ?? null;
    this.deleted_at = data.deleted_at ?? null;
  }
}