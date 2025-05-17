import { useState, type Key } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { formatThousands } from '@shared/utils/formatThousands';
import { Card, Input, message, Table, Tag, Typography } from 'antd';

import type { ProductItem } from '@/entities/types/product';
import type { ColumnsType } from 'antd/es/table';

import {
  PRODUCT_CATEGORY_ROW_INDEX,
  PRODUCT_DATA_START_ROW_INDEX,
  PRODUCT_ENUMS,
} from '@/entities/consts/product';
import UploadXlsxField, {
  type Props as UploadXlsxFieldProps,
} from '@shared/ui/UploadXlsxField';
import { reverseObject } from '@/shared/utils/reverseObject';

interface Props {
  onSelect: (key: Key[], keywords: ProductItem[]) => void;
}

export default function Product({ onSelect }: Props) {
  const [data, setData] = useState<ProductItem[]>([]);
  const [searchText, setSearchText] = useState('');

  // TODO: 데이터 타입 안 맞으면 에러 처리 === 카테고리명으로 비교
  const handleChangeFile: UploadXlsxFieldProps['onChange'] = (rawData) => {
    if (!rawData) {
      message.error('데이터가 없습니다.');
      return;
    }

    const categories = rawData.slice(
      PRODUCT_CATEGORY_ROW_INDEX,
      PRODUCT_CATEGORY_ROW_INDEX + 1
    )[0];
    const data = rawData.slice(PRODUCT_DATA_START_ROW_INDEX);
    const productMap = reverseObject(PRODUCT_ENUMS);

    const tableData = data.map((row) => {
      // TODO: 타입 정의
      const newRow = row.reduce((acc, curr, i) => {
        acc[productMap[categories[i]]] = curr;
        return acc;
      }, {} as ProductItem);

      return {
        ...newRow,
        key: newRow.id,
      };
    });

    setData(tableData);
  };

  const handleRemoveData = () => {
    setData([]);
  };

  const tableColumns: ColumnsType<ProductItem> = [
    {
      title: PRODUCT_ENUMS.id,
      dataIndex: 'id',
      key: 'id',
      width: 100,
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: PRODUCT_ENUMS.type,
      dataIndex: 'type',
      key: 'type',
      width: 100,
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: PRODUCT_ENUMS.name,
      dataIndex: 'name',
      key: 'name',
      width: 250,
      fixed: 'left',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: PRODUCT_ENUMS.salesStatus,
      dataIndex: 'salesStatus',
      key: 'salesStatus',
      width: 120,
      sorter: (a, b) => a.salesStatus.localeCompare(b.salesStatus),
    },
    {
      title: PRODUCT_ENUMS.productStatus,
      dataIndex: 'productStatus',
      key: 'productStatus',
      width: 120,
      sorter: (a, b) => a.productStatus.localeCompare(b.productStatus),
      render: (value) => {
        let color = 'green';
        if (value === '품절') color = 'red';
        else if (value === '판매중지') color = 'orange';
        else if (value === '입고예정') color = 'blue';
        return <Tag color={color}>{value}</Tag>;
      },
    },
    {
      title: PRODUCT_ENUMS.marketPrice,
      dataIndex: 'marketPrice',
      key: 'marketPrice',
      width: 120,
      sorter: (a, b) => a.marketPrice - b.marketPrice,
      className: 'text-right',
      render: (value) => `${formatThousands(value)}`,
    },
    {
      title: PRODUCT_ENUMS.salePrice,
      dataIndex: 'salePrice',
      key: 'salePrice',
      width: 120,
      sorter: (a, b) => a.salePrice - b.salePrice,
      className: 'text-right',
      render: (value) => `${formatThousands(value)}`,
    },
    {
      title: PRODUCT_ENUMS.discountedPrice,
      dataIndex: 'discountedPrice',
      key: 'discountedPrice',
      width: 180,
      sorter: (a, b) => a.discountedPrice - b.discountedPrice,
      className: 'text-right',
      render: (value) => `${formatThousands(value)}`,
    },
  ];

  return (
    <section>
      <Card className="shadow-md">
        <div className="flex justify-between items-center mb-4">
          <Typography.Title level={2} style={{ margin: 0, fontSize: '20px' }}>
            제품 선택
          </Typography.Title>
          <UploadXlsxField
            onChange={handleChangeFile}
            onRemove={handleRemoveData}
          />
        </div>
        <div className="mb-4">
          <Input
            placeholder="제품 검색..."
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
            type: 'radio',
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
      </Card>
    </section>
  );
}
