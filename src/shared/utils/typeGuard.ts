export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isString2DArray(
  value: unknown
): value is (string | number)[][] {
  return (
    Array.isArray(value) &&
    value.every(
      (inner) =>
        Array.isArray(inner) &&
        inner.every((item) => isString(item) || isNumber(item))
    )
  );
}

export function hasProperty<
  T extends object,
  K extends string | number | symbol
>(obj: T, prop: K): obj is T & Record<K, unknown> {
  return prop in obj;
}
