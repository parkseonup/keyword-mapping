import { useEffect, useState } from 'react';

import useDebounce from './useDebounce';

import {
  isKeywordData,
  type KeywordData,
  type KeywordItem,
} from '@/entities/types/keyword';
import {
  isProductData,
  type ProductData,
  type ProductItem,
} from '@/entities/types/product';

type ResultType<T> = T extends KeywordData
  ? KeywordItem[]
  : T extends ProductData
  ? ProductItem[]
  : T extends null
  ? undefined
  : never;

export default function useSearch<T extends KeywordData | ProductData | null>(
  data: T
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<ResultType<T>>();
  const { debounce } = useDebounce();

  const resetSearchTerm = () => {
    setSearchTerm('');
  };

  useEffect(() => {
    debounce(() => {
      const filteredData = getFilteredData(data, searchTerm) as ResultType<T>;

      if (!filteredData) return;

      setFilteredData(filteredData);
    }, 200);
  }, [searchTerm, data]);

  return {
    searchTerm,
    filteredData,
    setSearchTerm,
    resetSearchTerm,
  };
}

function getFilteredData(
  data: KeywordData | ProductData | null,
  searchTerm: string
) {
  if (!data) return;

  if (isKeywordData(data)) {
    return filteData(data, searchTerm) as KeywordItem[];
  } else if (isProductData(data)) {
    return filteData(data, searchTerm) as ProductItem[];
  }
}

function filteData(data: KeywordData | ProductData, searchTerm: string) {
  return data.value.filter((row) =>
    Object.values(row).some((item) => String(item).match(searchTerm) !== null)
  );
}
