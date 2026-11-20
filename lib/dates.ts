export type DateRange = {
  start: Date;
  end: Date;
};

export function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/**
 * Inclusive date ranges overlap when each start is on or before the other end.
 * Example: Sep 10–12 overlaps Sep 12–14; Sep 10–12 does not overlap Sep 13–14.
 */
export function rangesOverlap(a: DateRange, b: DateRange) {
  return a.start.getTime() <= b.end.getTime() && b.start.getTime() <= a.end.getTime();
}

export function assertBorrowingDates(input: {
  startDate: Date;
  endDate: Date;
  availableFrom: Date;
  availableUntil: Date;
  now?: Date;
}) {
  const startDate = input.startDate;
  const endDate = input.endDate;
  const errors: string[] = [];

  if (!(startDate < endDate)) {
    errors.push("startDate must be before endDate");
  }

  const today = startOfUtcDay(input.now ?? new Date());
  if (startOfUtcDay(startDate) < today) {
    errors.push("startDate cannot be in the past");
  }

  if (startDate < input.availableFrom || endDate > input.availableUntil) {
    errors.push("Borrowing dates must fall within the item availability window");
  }

  return errors;
}
