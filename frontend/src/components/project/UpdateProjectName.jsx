import React, { useState, useEffect } from 'react';
import { patch } from '../../api';

const UpdateName = ({ projectId, projectTitle, setModal }) => {
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    // projectTitle이 변경될 때마다 newTitle을 업데이트
    setNewTitle(projectTitle);
  }, [projectTitle]);

  const updateProjectTitle = async () => {
    try {
      const response = await patch(`projects/${projectId}`, {
        project_title: newTitle,
      });

      console.log(response);
      alert('수정 완료');
      setModal(null);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-4">
      <div className="p-2 text-lg">이름</div>
      <input
        type="text"
        className="border p-2 w-full"
        value={newTitle} // value를 newTitle로 바인딩
        onChange={(e) => setNewTitle(e.target.value)} // 입력값을 newTitle에 저장
      />
      <div className="flex justify-end">
        <button
          onClick={updateProjectTitle}
          className="px-4 py-2 mt-2 bg-blue-500 text-white rounded"
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default UpdateName;
