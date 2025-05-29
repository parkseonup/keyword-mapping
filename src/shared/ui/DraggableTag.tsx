import { HolderOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { Tag, type TagProps } from 'antd';

interface Props extends Pick<TagProps, 'onClose' | 'children'> {
  id: string;
}

const commonStyle = {
  transition: 'unset',
};

export default function DraggableTag({ id, children, onClose }: Props) {
  const { listeners, transition, transform, isDragging, setNodeRef } =
    useSortable({ id });

  const style = transform
    ? {
        ...commonStyle,
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: isDragging ? 'unset' : transition,
      }
    : commonStyle;

  return (
    <Tag
      ref={setNodeRef}
      icon={<HolderOutlined {...listeners} className="cursor-move" />}
      color="blue"
      style={style}
      onClose={onClose}
      closable
    >
      {children}
    </Tag>
  );
}
