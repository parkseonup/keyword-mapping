import type { ChangeEvent } from 'react';

import { message } from 'antd';

export default function App() {
  const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files?.length === 0) {
      message.error('파일이 없습니다.');
      return;
    }

    const file = e.target.files[0];
    console.log('file: ', file);
  };

  return (
    <>
      <h1>Keyword mapping</h1>
      <input type="file" accept=".xlsx" onChange={handleChangeFile} />
    </>
  );
}
