import type { KeywordItem } from '../../entities/types/keyword';
import type { ProductItem } from '../../entities/types/product';

export interface Results {
  [prouductKey: ProductItem['key']]: ResultItem;
}

export interface ResultItem {
  product: ProductItem;
  keywords: KeywordItem[];
}

export interface ResultColumn extends ResultItem {
  key: ProductItem['key'];
}
