export const utcNow = (): Date => new Date();

export const utcDate = (value?: string | number | Date): Date => {
  if (value === undefined) {
    return new Date();
  }
  return new Date(value);
};

export const utcFromParts = (
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0,
): Date => {
  return new Date(
    Date.UTC(year, month, day, hour, minute, second, millisecond),
  );
};
