import { useState } from 'react';

import { DeleteOutlined, FileExcelOutlined } from '@ant-design/icons';
import {
  Button,
  message,
  Tooltip,
  Upload,
  type UploadFile,
  type UploadProps,
} from 'antd';
import { read, utils } from 'xlsx';

export interface Props {
  onChange: (data: unknown[] | undefined) => void;
  onRemove: () => void;
}

const getRowData = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const parsed = read(arrayBuffer);
  const workSheet = parsed.Sheets[parsed.SheetNames[0]];
  return utils.sheet_to_json(workSheet, { header: 1 }); // header 1 지정시 배열로 변환
};

export default function UploadXlsxField({ onChange, onRemove }: Props) {
  const [file, setFile] = useState<UploadFile | null>();
  const [messageApi, contextHolder] = message.useMessage();

  const handleDeleteFile = () => {
    setFile(null);
    onRemove();
  };

  const uploadProps: UploadProps = {
    accept: '.xlsx',
    fileList: file ? [file] : [],
    beforeUpload: async (file) => {
      const isXlsx =
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      if (!isXlsx) {
        messageApi.error('xlsx 파일만 업로드 가능합니다!');
        return false;
      }

      try {
        const data = await getRowData(file);
        onChange(data);
        setFile(file);
      } catch (error) {
        console.error(error);
        messageApi.error('파일 파싱에 실패했습니다.');
      }

      return false; // 반환 값이 false일 시 > 서버 api 요청 안함
    },
    showUploadList: false,
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <Upload {...uploadProps}>
          <Tooltip title="엑셀(.xlsx) 파일만 업로드">
            <Button
              icon={<FileExcelOutlined />}
              type="primary"
              className="!rounded-button whitespace-nowrap bg-blue-600 hover:bg-blue-700"
            >
              파일 업로드 (.xlsx)
            </Button>
          </Tooltip>
        </Upload>
        <Tooltip title="파일 삭제">
          <Button
            icon={<DeleteOutlined />}
            className="!rounded-button whitespace-nowrap"
            onClick={handleDeleteFile}
            disabled={!file}
          ></Button>
        </Tooltip>
      </div>
      {contextHolder}
    </>
  );
}
