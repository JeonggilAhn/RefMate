import React, { useState, useEffect } from 'react';
import { patch } from '../../api';
import { useRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';
import TextButton from '../../components/common/TextButton';

const UpdateBlueprintName = ({
  blueprintId,
  blueprintTitle,
  setBlueprintName,
}) => {
  const [modal, setModal] = useRecoilState(modalState);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    setNewTitle(blueprintTitle);
  }, [blueprintTitle]);

  const updateblueprintTitle = async () => {
    try {
      const response = await patch(`blueprints/${blueprintId}`, {
        blueprint_title: newTitle,
      });

      console.log(response);
      alert('수정 완료');
      setBlueprintName(newTitle);
      setModal(null);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="pt-8 p-4">
      <div className="p-2">이름</div>
      <div className="border border-gray-200 mb-8 rounded-md p-2 flex flex-wrap gap-2 min-h-[40px] items-center">
        <input
          type="text"
          className="w-auto flex-grow border-none focus:ring-0 outline-none text-sm p-1"
          value={newTitle} // value를 newTitle로 바인딩
          onChange={(e) => setNewTitle(e.target.value)} // 입력값을 newTitle에 저장
        />
      </div>
      <div className="flex justify-end">
        <TextButton type="start" onClick={updateblueprintTitle}>
          완료
        </TextButton>
      </div>
    </div>
  );
};

export default UpdateBlueprintName;
