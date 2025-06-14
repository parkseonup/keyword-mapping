import { KEWYORD_DATA_TYPE } from '../consts/keyword';

export type KeywordData = {
  type: typeof KEWYORD_DATA_TYPE;
  value: KeywordItem[];
};

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

export function isKeywordNumberField(key: string): key is NumberField {
  return numberFieldKeys.includes(key as NumberField);
}

// 문자열 필드
const stringFieldKeys = [
  'key',
  'id',
  'keyword',
  'category1',
  'category2',
  'category3',
  'competitionLevel',
] as const;

type StringField = (typeof stringFieldKeys)[number];

export function isKeywordStringField(key: string): key is StringField {
  return stringFieldKeys.includes(key as StringField);
}

export function isKeywordData(
  data: Record<string, unknown>
): data is KeywordData {
  return (
    typeof data === 'object' &&
    'type' in data &&
    data.type === KEWYORD_DATA_TYPE
  );
}
