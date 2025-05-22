export function reverseObject<T extends Record<string, string>>(
  obj: T
): Record<T[keyof T], keyof T> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [value, key])
  ) as Record<T[keyof T], keyof T>;
}
