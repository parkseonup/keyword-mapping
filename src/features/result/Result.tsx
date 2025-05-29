import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import DraggableTag from '@shared/ui/DraggableTag';
import { isString } from '@shared/utils/typeGuard';
import { Button, Card, message, Space, Table, Tooltip, Typography } from 'antd';

import type { KeywordItem } from '@/entities/types/keyword';
import type { ProductItem } from '@/entities/types/product';
import type { ResultColumn } from '@/entities/types/result';
import type { ColumnsType } from 'antd/es/table';

interface Props {
  data: ResultColumn[];
  changeKeywordOrder: (
    productKey: ProductItem['key'],
    keywordKey: KeywordItem['key'],
    overKey: KeywordItem['key']
  ) => void;
  onRemoveAllKeywords: (productKey: ResultColumn['key']) => void;
  onRemoveKeyword: (
    productKey: ProductItem['key'],
    keywordKey: KeywordItem['key']
  ) => void;
}

export default function Result({
  data,
  changeKeywordOrder,
  onRemoveAllKeywords,
  onRemoveKeyword,
}: Props) {
  const [messageApi, contextHolder] = message.useMessage();

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (e: DragEndEvent, productKey: ProductItem['key']) => {
    const { active, over } = e;

    if (!over) return;
    if (active.id === over.id) return;
    if (!(isString(active.id) && isString(over.id))) return;

    changeKeywordOrder(productKey, active.id, over.id);
  };

  const resultsColumns: ColumnsType<ResultColumn> = [
    {
      title: '제품',
      dataIndex: ['product', 'name'],
      key: 'product',
      width: '30%',
      render: (_, record) => {
        return (
          <div>
            <div className="font-medium">{record.product.name}</div>
            <div className="text-xs text-gray-500">{record.product.id}</div>
          </div>
        );
      },
    },
    {
      title: '매핑된 키워드',
      dataIndex: 'keywords',
      key: 'keywords',
      width: '50%',
      render: (keywords, record) => {
        return (
          <DndContext
            sensors={sensors}
            onDragEnd={(e) => handleDragEnd(e, record.product.key)}
            collisionDetection={closestCenter}
          >
            <SortableContext items={keywords}>
              <div className="flex flex-wrap gap-1">
                {keywords.map((keyword: KeywordItem) => (
                  <DraggableTag
                    key={keyword.key}
                    id={keyword.key}
                    onClose={() => {
                      onRemoveKeyword(record.product.key, keyword.key);
                    }}
                  >
                    {keyword.keyword}
                  </DraggableTag>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        );
      },
    },
    {
      title: '작업',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <Space>
          <Tooltip title="키워드 복사">
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={() => copyKeywords(record.keywords)}
              className="!rounded-button whitespace-nowrap"
            >
              키워드 복사
            </Button>
          </Tooltip>
          <Tooltip title="매핑 삭제">
            <Button
              icon={<DeleteOutlined />}
              className="!rounded-button whitespace-nowrap"
              onClick={() => onRemoveAllKeywords(record.product.key)}
            ></Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const copyKeywords = (keywords: KeywordItem[]) => {
    const keywordText = keywords.map((k) => k.keyword).join(' ');
    navigator.clipboard.writeText(keywordText);
    messageApi.success('키워드가 클립보드에 복사되었습니다.');
  };

  return (
    <>
      {data ? (
        <section>
          <Card className="shadow-md mt-6">
            <div className="flex justify-between items-center mb-4">
              <Typography.Title
                level={2}
                style={{ margin: 0, fontSize: '20px' }}
              >
                매핑 결과
              </Typography.Title>
            </div>
            <Table
              columns={resultsColumns}
              dataSource={data}
              size="middle"
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                showTotal: (total) => `총 ${total}개 매핑`,
              }}
              rowClassName={(_, index) =>
                index % 2 === 0
                  ? 'bg-white hover:bg-blue-50'
                  : 'bg-gray-50 hover:bg-blue-50'
              }
              className="border border-gray-200 rounded-lg overflow-hidden"
              locale={{
                emptyText:
                  '매핑된 결과가 없습니다. 제품과 키워드를 선택하여 매핑해주세요.',
              }}
            />
          </Card>
        </section>
      ) : null}
      {contextHolder}
    </>
  );
}
