import React, { useState, useEffect } from 'react';
import { get } from '../../api';
import CreateProject from './CreateProject';
import TextButton from '../common/TextButton';
import { useSetRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';

const SubHeader = ({ setProjects }) => {
  const [userName, setUserName] = useState('');
  const setModal = useSetRecoilState(modalState);

  const handleCreateProject = () => {
    setModal({
      type: 'modal',
      title: '새 프로젝트',
      content: <CreateProject setProjects={setProjects} />,
    });
  };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await get(`users/me`);
        const email = response.data.content.user_email;
        const name = email.split('@')[0]; // '@' 전까지의 문자열을 추출
        setUserName(name);
      } catch (error) {
        console.error('사용자 이름을 가져오는데 실패했습니다.', error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <div className="flex justify-between items-center w-full px-5 py-2.5">
      <div className="flex gap-4">
        <div className="text-xl font-semibold">{`${userName} 님의 공간`}</div>
      </div>
      <TextButton onClick={handleCreateProject}>
        새 프로젝트 만들기 +
      </TextButton>
    </div>
  );
};

export default SubHeader;
