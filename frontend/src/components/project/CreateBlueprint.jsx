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
    <div className="p-4 w-150">
      <form onSubmit={handleSubmit}>
        <div>
          <div className="mb-2">
            <label htmlFor="blueprintTitle">이름</label>
          </div>
          <div className="border border-gray-200 mb-8 rounded-md p-2 flex flex-wrap gap-2 min-h-[40px] items-center">
            <input
              type="text"
              id="blueprintTitle"
              value={blueprintTitle}
              onChange={handleInputChange}
              placeholder="블루프린트 이름을 입력하세요."
              className="w-auto flex-grow border-none focus:ring-0 outline-none text-sm p-1"
            />
          </div>
        </div>

        {/* 업로드 기능 추가 해야 함 */}
        <div className="mb-2">업로드</div>
        <div className="border border-gray-200 rounded-md mb-2 p-2 bg-blue-100 text-center">
          블루프린트 선택
        </div>
        <div className="text-center">
          해상도는 1920 * 1810 이상만 지원합니다.
        </div>
        {/* 업로드 기능 추가 해야 함 */}

        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-4 py-2 mt-2 text-white rounded ${
              blueprintTitle.trim()
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 cursor-not-allowed opacity-50'
            }`}
            disabled={!blueprintTitle.trim()}
          >
            완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlueprint;
