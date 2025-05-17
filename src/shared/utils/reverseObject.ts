export function reverseObject(obj: Record<string, unknown>) {
  const reversed = Object.entries(obj).map(([key, value]) => [value, key]);
  return Object.fromEntries(reversed);
}
