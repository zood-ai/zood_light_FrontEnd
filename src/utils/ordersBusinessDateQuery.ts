import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

/** Matches DataTableComp date suffix for `/orders` listings (business_date + from/to). */
export function buildOrdersBusinessDateQuery(
  startDate: string,
  endDate: string
): string {
  const rangeValue = `${startDate} - ${endDate}`;
  return `&business_date=${rangeValue}&from_date=${startDate}&to_date=${endDate}`;
}

/** Client-side filter for POS refund list (API date filters are inconsistent for this query). */
export function isRefundOrderInDateRange(
  order: { business_date?: string; created_at?: string },
  range: [Dayjs, Dayjs]
): boolean {
  const raw = order.business_date ?? order.created_at;
  if (!raw) return true;
  const ts = dayjs(raw).valueOf();
  const start = range[0].startOf('day').valueOf();
  const end = range[1].endOf('day').valueOf();
  return ts >= start && ts <= end;
}
