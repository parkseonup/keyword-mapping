import { useState, type Key } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import useSearch from '@shared/hooks/useSearch';
import UploadXlsxField, {
  type Props as UploadXlsxFieldProps,
} from '@shared/ui/UploadXlsxField';
import { formatThousands } from '@shared/utils/formatThousands';
import {
  hasProperty,
  isString,
  isString2DArray,
} from '@shared/utils/typeGuard';
import { Card, Input, message, Table, Tag, Typography } from 'antd';

import type { ColumnsType } from 'antd/es/table';

import {
  PRODUCT_CATEGORY_ROW_INDEX,
  PRODUCT_DATA_START_ROW_INDEX,
  PRODUCT_DATA_TYPE,
  PRODUCT_ENUMS,
} from '@/entities/consts/product';
import {
  isProductStringField,
  type ProductData,
  type ProductItem,
} from '@/entities/types/product';
import { reverseObject } from '@/shared/utils/reverseObject';

interface Props {
  selectedValue: ProductItem | null;
  onSelect: (key: Key[], keywords: ProductItem[]) => void;
}

export default function Product({ selectedValue, onSelect }: Props) {
  const [data, setData] = useState<ProductData | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const { searchTerm, filteredData, setSearchTerm } = useSearch(data);

  const handleChangeFile: UploadXlsxFieldProps['onChange'] = (rawData) => {
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

    const productMap = reverseObject(PRODUCT_ENUMS);
    const categories = rawData
      .slice(PRODUCT_CATEGORY_ROW_INDEX, PRODUCT_CATEGORY_ROW_INDEX + 1)[0]
      .filter((item) => hasProperty(productMap, item));

    const data = rawData.slice(PRODUCT_DATA_START_ROW_INDEX);

    try {
      const tableData = data.map((row) => {
        const newRow = row
          .filter((_, i) => hasProperty(productMap, categories[i]))
          .reduce((acc, curr, i) => {
            const categoryKey = productMap[categories[i]];

            // 유효한 카테고리 키인지 확인
            if (!categoryKey) {
              return acc;
            }

            // 데이터 값이 string이 아닐 경우 > 에러 출력
            if (!isString(curr)) {
              throw new Error('잘못된 파일입니다.');
            }

            if (isProductStringField(categoryKey) && typeof curr === 'string') {
              acc[categoryKey] = curr;
            } else {
              throw new Error(
                `${categoryKey}에 대한 잘못된 값 타입입니다: ${curr}`
              );
            }

            acc[categoryKey] = curr;
            return acc;
          }, {} as ProductItem);

        // 데이터가 비어있을 경우 > 에러 출력
        if (Object.keys(newRow).length === 0) {
          throw new Error('잘못된 파일입니다.');
        }

        // 필수 필드 확인
        if (!newRow.id) {
          throw new Error('id 필드가 없습니다.');
        }

        // key 필드 추가
        newRow.key = newRow.id;

        return newRow;
      });

      setData({
        type: PRODUCT_DATA_TYPE,
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
      sorter: (a, b) => Number(a.marketPrice) - Number(b.marketPrice),
      className: 'text-right',
      render: (value) => `${formatThousands(value)}`,
    },
    {
      title: PRODUCT_ENUMS.salePrice,
      dataIndex: 'salePrice',
      key: 'salePrice',
      width: 120,
      sorter: (a, b) => Number(a.salePrice) - Number(b.salePrice),
      className: 'text-right',
      render: (value) => `${formatThousands(value)}`,
    },
    {
      title: PRODUCT_ENUMS.discountedPrice,
      dataIndex: 'discountedPrice',
      key: 'discountedPrice',
      width: 180,
      sorter: (a, b) => Number(a.discountedPrice) - Number(b.discountedPrice),
      className: 'text-right',
      render: (value) => `${formatThousands(value)}`,
    },
  ];

  return (
    <>
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
              type: 'radio',
              selectedRowKeys: selectedValue ? [selectedValue.key] : [],
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
              선택된 제품: {selectedValue ? selectedValue.name : '0'}
            </Typography.Text>
          </div>
        </Card>
      </section>
      {contextHolder}
    </>
  );
}
