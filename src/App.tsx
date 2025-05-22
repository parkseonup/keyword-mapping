import React, { useState } from 'react';

import Result from '@features/result/Result';
import { message } from 'antd';

import Keyword from './features/keyword/Keyword';
import Product from './features/product/Product';

import type { KeywordItem } from './entities/types/keyword';
import type { ProductItem } from './entities/types/product';
import type { ResultColumn, Results } from './entities/types/result';

export default function App() {
  const [results, setResults] = useState<Results>({});
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
      const targetResult = prev[selectedProduct.key];

      return {
        ...prev,
        [selectedProduct.key]: {
          product: targetResult ? targetResult.product : selectedProduct,
          keywords: selectedRows,
        },
      };
    });
  };

  const handleRemoveAllKeywords = (productKey: ResultColumn['key']) => {
    setResults((prev) => {
      const copyPrev = { ...prev };
      delete copyPrev[productKey];

      return copyPrev;
    });
  };

  const handleRemoveKeyword = (
    productKey: ProductItem['key'],
    keywordKey: KeywordItem['key']
  ) => {
    setResults((prev) => {
      const targetResult = prev[productKey];
      const newKeywords = targetResult.keywords.filter(
        (keyword) => keyword.key !== keywordKey
      );

      const copyPrev = { ...prev };

      // 매핑된 키워드가 전부 제거되어 없으면 제품 기록을 제거한다.
      if (newKeywords.length === 0) {
        delete copyPrev[productKey];
      }
      // 매핑된 키워드가 남아있으면 newKeywords로 교체한다.
      else {
        copyPrev[productKey] = {
          ...copyPrev[productKey],
          keywords: newKeywords,
        };
      }

      return copyPrev;
    });
  };

  const resultsData: ResultColumn[] = Object.entries(results).map(
    ([productKey, values]) => {
      return {
        key: productKey,
        product: values.product,
        keywords: values.keywords,
      };
    }
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
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
                selectedValues={
                  selectedProduct && results[selectedProduct.key]
                    ? results[selectedProduct.key].keywords
                    : []
                }
                onSelect={handleKeywordSelection}
              />
            </div>
            <div className="mt-6">
              <Result
                data={resultsData}
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
