import { useState, type Key } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { formatThousands } from '@shared/utils/formatThousands';
import { Card, Input, message, Table, Tag, Typography } from 'antd';

import type { KeywordItem } from '@/entities/types/keyword';
import type { ColumnsType } from 'antd/es/table';

import {
  KEYWORD_CATEGORY_ROW_INDEX,
  KEYWORD_DATA_START_ROW_INDEX,
  KEYWORD_ENUMS,
} from '@/entities/consts/keyword';
import UploadXlsxField, {
  type Props as UploadXlsxFieldProps,
} from '@shared/ui/UploadXlsxField';
import { reverseObject } from '@/shared/utils/reverseObject';

interface Props {
  selectedValues: KeywordItem[];
  onSelect: (key: Key[], keywords: KeywordItem[]) => void;
}

export default function Keyword({ selectedValues, onSelect }: Props) {
  const [data, setData] = useState<KeywordItem[]>([]);
  const [searchText, setSearchText] = useState('');

  // TODO: 데이터 타입 안 맞으면 에러 처리 === 카테고리명으로 비교
  const handleChangeFile: UploadXlsxFieldProps['onChange'] = (rawData) => {
    if (!rawData) {
      message.error('데이터가 없습니다.');
      return;
    }

    const categories = rawData.slice(
      KEYWORD_CATEGORY_ROW_INDEX,
      KEYWORD_CATEGORY_ROW_INDEX + 1
    )[0];
    const data = rawData.slice(KEYWORD_DATA_START_ROW_INDEX);
    const keywordMap = reverseObject(KEYWORD_ENUMS);

    const tableData = data.map((row) => {
      // TODO: 타입 정의
      const newRow = row.reduce((acc, curr, i) => {
        acc[keywordMap[categories[i]]] = curr;
        return acc;
      }, {} as KeywordItem);

      return {
        ...newRow,
        key: newRow.keyword,
      };
    });

    setData(tableData);
  };

  const handleRemoveData = () => {
    setData([]);
  };

  const tableColumns: ColumnsType<KeywordItem> = [
    {
      title: KEYWORD_ENUMS.rank,
      dataIndex: 'rank',
      key: 'rank',
      width: 70,
      sorter: (a, b) => a.rank - b.rank,
      className: 'text-right',
    },
    {
      title: KEYWORD_ENUMS.keyword,
      dataIndex: 'keyword',
      key: 'keyword',
      width: 180,
      fixed: 'left',
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
      sorter: (a, b) => a.searchVolume - b.searchVolume,
      className: 'text-right',
      render: (value) => formatThousands(value),
    },
    {
      title: KEYWORD_ENUMS.prevSearchVolume,
      dataIndex: 'prevSearchVolume',
      key: 'prevSearchVolume',
      width: 120,
      sorter: (a, b) => a.prevSearchVolume - b.prevSearchVolume,
      className: 'text-right',
      render: (value) => formatThousands(value),
    },
    {
      title: KEYWORD_ENUMS.growthRate,
      dataIndex: 'growthRate',
      key: 'growthRate',
      width: 100,
      sorter: (a, b) => a.growthRate - b.growthRate,
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
      sorter: (a, b) => a.productCount - b.productCount,
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
        // TODO: 매우높음, 높음, 보통, 낮음, 매우낮음
        let color = 'green';
        if (value === '중간') color = 'blue';
        else if (value === '높음') color = 'orange';
        else if (value === '매우 높음') color = 'red';
        return <Tag color={color}>{value}</Tag>;
      },
    },
  ];

  return (
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
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-lg border-gray-300"
            allowClear
          />
        </div>
        <Table
          columns={tableColumns}
          dataSource={data}
          rowSelection={{
            type: 'checkbox',
            onChange: onSelect,
          }}
          size="small"
          scroll={{ x: 1200, y: 400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `총 ${total}개 항목`,
          }}
          rowClassName={(record, index) =>
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
  );
}
