import React, { useState, useEffect } from 'react';
import { patch } from '../../api';
import { useRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';
import TextButton from '../common/TextButton';
import { useToast } from '@/hooks/use-toast';

const UpdateName = ({ projectId, projectTitle, setProjectName }) => {
  const [modal, setModal] = useRecoilState(modalState);
  const [newTitle, setNewTitle] = useState('');
  const { toast } = useToast(20);

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
      toast({
        title: '프로젝트 제목 수정이 완료되었습니다.',
        description: String(new Date()),
      });
      setProjectName(newTitle);
      setModal(null);
    } catch (error) {
      toast({
        title: '프로젝트 제목 수정에 실패했습니다.',
        description: String(new Date()),
      });
    }
  };

  return (
    <div className="pt-8 p-4">
      <div className="mb-2">이름</div>
      <div className="border border-gray-200 mb-8 rounded-md p-2 flex flex-wrap gap-2 min-h-[40px] items-center">
        <input
          type="text"
          value={newTitle} // value를 newTitle로 바인딩
          onChange={(e) => setNewTitle(e.target.value)} // 입력값을 newTitle에 저장
          className="w-auto flex-grow border-none focus:ring-0 outline-none text-sm p-1"
        />
      </div>
      <div className="flex justify-end">
        <TextButton type="start" onClick={updateProjectTitle}>
          완료
        </TextButton>
      </div>
    </div>
  );
};

export default UpdateName;
