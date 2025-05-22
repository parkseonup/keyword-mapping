export type ProductItem = Record<StringField, string>;

const stringField = [
  'key',
  'id',
  'type',
  'name',
  'salesStatus',
  'productStatus',
  'marketPrice',
  'salePrice',
  'discountedPrice',
] as const;

type StringField = (typeof stringField)[number];

export function isStringField(key: string): key is StringField {
  return stringField.includes(key as StringField);
}
