import React, { useState } from 'react';
import { post } from '../../api';

const CreateBlueprint = ({ setModal }) => {
  const [blueprintTitle, setBlueprintTitle] = useState('');

  const handleInputChange = (event) => {
    setBlueprintTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await post('projects/{project_id}/blueprints', {
        blueprint_title: blueprintTitle,
        // origin_file: originFile,
      });
      console.log('블루프린트트 생성 성공:', response.data);
      alert('생성 완료');
      setModal(null);
    } catch (error) {
      console.error('블루프린트 생성 실패:', error);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="blueprintTitle">이름</label>
          <div className="border">
            <input
              type="text"
              id="blueprintTitle"
              value={blueprintTitle}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* 업로드 기능 추가 해야 함 */}
        <br />
        <div>업로드</div>
        <button className="border">블루프린트 선택</button>
        <div>해상도는 1920 * 1810 이상만 지원합니다.</div>
        {/* 업로드 기능 추가 해야 함 */}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 mt-2 bg-blue-500 text-white rounded"
          >
            완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlueprint;
