import React, { useState } from 'react';

import { arrayMove } from '@dnd-kit/sortable';
import Result from '@features/result/Result';
import { message } from 'antd';

import Keyword from './features/keyword/Keyword';
import Product from './features/product/Product';

import type { KeywordItem } from './entities/types/keyword';
import type { ProductItem } from './entities/types/product';
import type { ResultColumn } from './entities/types/result';

export default function App() {
  const [results, setResults] = useState<ResultColumn[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null
  );

  const [messageApi, contextHolder] = message.useMessage();

  const handleProductSelection = (
    _: React.Key[],
    selectedRows: ProductItem[]
  ) => {
    const newSelectProduct = selectedRows[0];
    setSelectedProduct(newSelectProduct);
  };

  const handleKeywordSelection = (
    _: React.Key[],
    selectedRows: KeywordItem[]
  ) => {
    if (!selectedProduct) {
      messageApi.error('제품을 먼저 선택해주세요.');
      return;
    }

    setResults((prev) => {
      const foundProduct = results.find(
        (result) => result.key === selectedProduct.key
      );

      // 매핑 목록에 없는 제품이면 생성
      if (!foundProduct) {
        return [
          ...prev,
          {
            key: selectedProduct.key,
            product: selectedProduct,
            keywords: selectedRows,
          },
        ];
      }
      // 매핑 목록에 있는 제품이면 추가
      else {
        return prev.map((item) =>
          item.key === selectedProduct.key
            ? { ...item, keywords: selectedRows }
            : item
        );
      }
    });
  };

  const handleRemoveAllKeywords = (productKey: ResultColumn['key']) => {
    setResults((prev) => {
      return prev.filter((item) => item.key === productKey);
    });
  };

  const handleRemoveKeyword = (
    productKey: ProductItem['key'],
    keywordKey: KeywordItem['key']
  ) => {
    setResults((prev) => {
      const foundProduct = prev.find((result) => result.key === productKey);

      if (!foundProduct) return prev;

      const filteredKeyword = foundProduct.keywords.filter(
        (keyword) => keyword.key !== keywordKey
      );

      return filteredKeyword.length === 0
        ? prev.filter((item) => item.key !== productKey) // 매핑된 키워드가 전부 제거되어 없으면 제품 기록을 제거한다.
        : replaceKeywords(prev, productKey, filteredKeyword); // 매핑된 키워드가 남아있으면 newKeywords로 교체한다.
    });
  };

  const replaceKeywords = (
    results: ResultColumn[],
    productKey: ProductItem['key'],
    newKeywords: KeywordItem[]
  ) => {
    return results.map((result) =>
      result.key === productKey ? { ...result, keywords: newKeywords } : result
    );
  };

  const changeKeywordOrder = (
    productKey: ProductItem['key'],
    keywordKey: KeywordItem['key'],
    overKey: KeywordItem['key']
  ) => {
    setResults((prev) => {
      const targetProduct = prev.find((item) => item.key === productKey);

      if (!targetProduct) return prev;

      const oldIndex = targetProduct.keywords.findIndex(
        (keyword) => keyword.key === keywordKey
      );
      const newIndex = targetProduct.keywords.findIndex(
        (keyword) => keyword.key === overKey
      );

      const newKeywords = arrayMove(targetProduct.keywords, oldIndex, newIndex);

      return replaceKeywords(prev, productKey, newKeywords);
    });
  };

  const selectedKeywords =
    (selectedProduct &&
      results.find((result) => result.key === selectedProduct.key)?.keywords) ??
    [];

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 font-pretendard">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              제품-키워드 매핑 시스템
            </h1>
            <p className="text-gray-600 mt-2">
              판매 제품에 대한 키워드를 매핑하고 관리하는 시스템입니다.
            </p>
          </header>
          <main>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Product
                selectedValue={selectedProduct}
                onSelect={handleProductSelection}
              />
              <Keyword
                selectedValues={selectedKeywords}
                onSelect={handleKeywordSelection}
              />
            </div>
            <div className="mt-6">
              <Result
                data={results}
                changeKeywordOrder={changeKeywordOrder}
                onRemoveAllKeywords={handleRemoveAllKeywords}
                onRemoveKeyword={handleRemoveKeyword}
              />
            </div>
          </main>
        </div>
      </div>
      {contextHolder}
    </>
  );
}
