import { useState, type Key } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import useSearch from '@shared/hooks/useSearch';
import UploadXlsxField, {
  type Props as UploadXlsxFieldProps,
} from '@shared/ui/UploadXlsxField';
import { formatThousands } from '@shared/utils/formatThousands';
import { hasProperty, isString2DArray } from '@shared/utils/typeGuard';
import { Card, Input, message, Table, Tag, Typography } from 'antd';

import type { ColumnsType } from 'antd/es/table';

import {
  KEWYORD_DATA_TYPE,
  KEYWORD_CATEGORY_ROW_INDEX,
  KEYWORD_DATA_START_ROW_INDEX,
  KEYWORD_ENUMS,
} from '@/entities/consts/keyword';
import {
  isKeywordNumberField,
  isKeywordStringField,
  type KeywordData,
  type KeywordItem,
} from '@/entities/types/keyword';
import { reverseObject } from '@/shared/utils/reverseObject';

interface Props {
  selectedValues: KeywordItem[];
  onSelect: (key: Key[], keywords: KeywordItem[]) => void;
}

export default function Keyword({ selectedValues, onSelect }: Props) {
  const [data, setData] = useState<KeywordData | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const { searchTerm, filteredData, setSearchTerm } = useSearch(data);

  const handleChangeFile: UploadXlsxFieldProps['onChange'] = (rawData) => {
    // 데이터를 찾을 수 없을 경우 > 에러 출력
    if (!rawData) {
      messageApi.error('데이터가 없습니다.');
      return;
    }

    // 데이터가 문자열로 된 2차원 배열이 아닐 경우 > 에러 출력
    // TODO: 타입 가드 함수를 이렇게 묶는게 맞을까?
    if (!isString2DArray(rawData)) {
      messageApi.error('잘못된 파일입니다.');
      return;
    }

    const keywordMap = reverseObject(KEYWORD_ENUMS);
    const categories = rawData
      .slice(KEYWORD_CATEGORY_ROW_INDEX, KEYWORD_CATEGORY_ROW_INDEX + 1)[0]
      .filter((item) => hasProperty(keywordMap, item));

    const data = rawData.slice(KEYWORD_DATA_START_ROW_INDEX);

    try {
      const tableData = data.map((row) => {
        const newRow = row
          .filter((_, i) => hasProperty(keywordMap, categories[i]))
          .reduce((acc, curr, i) => {
            const categoryKey = keywordMap[categories[i]];

            // 유효한 카테고리 키인지 확인
            if (!categoryKey) {
              return acc;
            }

            // 숫자 필드인 경우
            if (isKeywordNumberField(categoryKey) && typeof curr === 'number') {
              acc[categoryKey] = curr;
            }
            // 문자열 필드인 경우
            else if (
              isKeywordStringField(categoryKey) &&
              typeof curr === 'string'
            ) {
              acc[categoryKey] = curr;
            } else {
              throw new Error(
                `${categoryKey}에 대한 잘못된 값 타입입니다: ${curr}`
              );
            }

            return acc;
          }, {} as KeywordItem);

        // 데이터가 비어있을 경우 > 에러 출력
        if (Object.keys(newRow).length === 0) {
          throw new Error('잘못된 파일입니다.');
        }

        // 필수 필드 확인
        if (!newRow.keyword) {
          throw new Error('keyword 필드가 없습니다.');
        }

        // key 필드 추가
        newRow.key = newRow.keyword;

        return newRow;
      });

      setData({
        type: KEWYORD_DATA_TYPE,
        value: tableData,
      });
    } catch (error) {
      console.error(error);
      messageApi.error('잘못된 파일입니다.');
      return;
    }
  };

  const handleRemoveData = () => {
    setData(null);
  };

  const tableColumns: ColumnsType<KeywordItem> = [
    {
      title: KEYWORD_ENUMS.rank,
      dataIndex: 'rank',
      key: 'rank',
      width: 70,
      sorter: (a, b) => Number(a.rank) - Number(b.rank),
      className: 'text-right',
    },
    {
      title: KEYWORD_ENUMS.keyword,
      dataIndex: 'keyword',
      key: 'keyword',
      width: 180,
      sorter: (a, b) => a.keyword.localeCompare(b.keyword),
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: KEYWORD_ENUMS.category1,
      dataIndex: 'category1',
      key: 'category1',
      width: 120,
      sorter: (a, b) => a.category1.localeCompare(b.category1),
    },
    {
      title: KEYWORD_ENUMS.category2,
      dataIndex: 'category2',
      key: 'category2',
      width: 120,
      sorter: (a, b) => a.category2.localeCompare(b.category2),
    },
    {
      title: KEYWORD_ENUMS.category3,
      dataIndex: 'category3',
      key: 'category3',
      width: 120,
      sorter: (a, b) => a.category3.localeCompare(b.category3),
    },
    {
      title: KEYWORD_ENUMS.searchVolume,
      dataIndex: 'searchVolume',
      key: 'searchVolume',
      width: 100,
      sorter: (a, b) => Number(a.searchVolume) - Number(b.searchVolume),
      className: 'text-right',
      render: (value) => formatThousands(value),
    },
    {
      title: KEYWORD_ENUMS.prevSearchVolume,
      dataIndex: 'prevSearchVolume',
      key: 'prevSearchVolume',
      width: 120,
      sorter: (a, b) => Number(a.prevSearchVolume) - Number(b.prevSearchVolume),
      className: 'text-right',
      render: (value) => formatThousands(value),
    },
    {
      title: KEYWORD_ENUMS.growthRate,
      dataIndex: 'growthRate',
      key: 'growthRate',
      width: 100,
      sorter: (a, b) => Number(a.growthRate) - Number(b.growthRate),
      className: 'text-right',
      render: (value) => {
        const color =
          value > 0
            ? 'text-red-500'
            : value < 0
            ? 'text-blue-500'
            : 'text-gray-500';
        return <span className={color}>{value.toFixed(2)}%</span>;
      },
    },
    {
      title: KEYWORD_ENUMS.productCount,
      dataIndex: 'productCount',
      key: 'productCount',
      width: 100,
      sorter: (a, b) => Number(a.productCount) - Number(b.productCount),
      className: 'text-right',
      render: (value) => formatThousands(value),
    },
    {
      title: KEYWORD_ENUMS.competitionLevel,
      dataIndex: 'competitionLevel',
      key: 'competitionLevel',
      width: 100,
      sorter: (a, b) => a.competitionLevel.localeCompare(b.competitionLevel),
      render: (value) => {
        let color = 'green';

        if (value === '보통') color = 'blue';
        else if (value === '높음') color = 'orange';
        else if (value === '매우높음') color = 'red';

        return <Tag color={color}>{value}</Tag>;
      },
    },
  ];

  return (
    <>
      <section>
        <Card className="shadow-md">
          <div className="flex justify-between items-center mb-4">
            <Typography.Title level={2} style={{ margin: 0, fontSize: '20px' }}>
              키워드 선택
            </Typography.Title>
            <UploadXlsxField
              onChange={handleChangeFile}
              onRemove={handleRemoveData}
            />
          </div>
          <div className="mb-4">
            <Input
              placeholder="키워드 검색..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border-gray-300"
              allowClear
            />
          </div>
          <Table
            columns={tableColumns}
            dataSource={filteredData ?? data?.value}
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: selectedValues.map((values) => values.key),
              onChange: onSelect,
            }}
            size="small"
            scroll={{ x: 1200, y: 400 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `총 ${total}개 항목`,
            }}
            rowClassName={(_, index) =>
              index % 2 === 0
                ? 'bg-white hover:bg-blue-50'
                : 'bg-gray-50 hover:bg-blue-50'
            }
            className="border border-gray-200 rounded-lg overflow-hidden"
          />
          <div className="mt-4">
            <Typography.Text type="secondary">
              선택된 키워드: {selectedValues.length}개
            </Typography.Text>
          </div>
        </Card>
      </section>
      {contextHolder}
    </>
  );
}
