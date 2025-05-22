export type KeywordItem = Record<NumberField, number> &
  Record<StringField, string>;

// 숫자 필드
const numberFieldKeys = [
  'rank',
  'searchVolume',
  'prevSearchVolume',
  'growthRate',
  'productCount',
] as const;

type NumberField = (typeof numberFieldKeys)[number];

export function isNumberField(key: string): key is NumberField {
  return numberFieldKeys.includes(key as NumberField);
}

// 문자열 필드
const stringFieldKeys = [
  'key',
  'keyword',
  'category1',
  'category2',
  'category3',
  'competitionLevel',
] as const;

type StringField = (typeof stringFieldKeys)[number];

export function isStringField(key: string): key is StringField {
  return stringFieldKeys.includes(key as StringField);
}
