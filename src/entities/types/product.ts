import { PRODUCT_DATA_TYPE } from '../consts/product';

export type ProductData = {
  type: typeof PRODUCT_DATA_TYPE;
  value: ProductItem[];
};

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

export function isProductStringField(key: string): key is StringField {
  return stringField.includes(key as StringField);
}

export function isProductData(
  data: Record<string, unknown>
): data is ProductData {
  return (
    typeof data === 'object' &&
    'type' in data &&
    data.type === PRODUCT_DATA_TYPE
  );
}
