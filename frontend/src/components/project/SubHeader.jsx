import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { get } from '../../api';
import { useLocation } from 'react-router-dom';
import EditButton from '../common/EditButton';
import CreateProject from './CreateProject';
import EmailInput from './EmailInput';

const SubHeader = ({ userId, projectId }) => {
  const [userName, setUserName] = useState('');
  const [projectName, setProjectName] = useState('');
  const location = useLocation();

  const [isCreate, setIsCreate] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false); // 이메일 초대 입력 상태 추가

  const handleOpenCreate = () => {
    setIsCreate(true);
  };

  const handleToggleInvite = () => {
    setIsInviteOpen((prev) => !prev); // 초대 아이콘 클릭 시 이메일 입력창 토글
  };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await get(`users/${userId}`);
        const email = response.data.content.user_email;
        const name = email.split('@')[0]; // '@' 전까지의 문자열을 추출
        setUserName(name);
      } catch (error) {
        console.error('사용자 이름을 가져오는데 실패했습니다.', error);
      }
    };

    const fetchProjectName = async () => {
      if (projectId) {
        try {
          const response = await get(`projects/${projectId}`);
          setProjectName(response.data.content.project_title);
        } catch (error) {
          console.error('프로젝트 이름을 가져오는데 실패했습니다.', error);
        }
      }
    };

    fetchUserName();
    fetchProjectName();
  }, [userId, projectId]);

  const isBlueprintListPage = location.pathname.includes('blueprints');

  return (
    <SubHeaderWrapper>
      <LeftSection>
        <h3>{isBlueprintListPage ? projectName : `${userName}님의 공간`}</h3>
        {isBlueprintListPage && <EditButton />}
      </LeftSection>
      <div className="border border-black flex">
        {isBlueprintListPage && (
          <div className="border">
            <button onClick={handleToggleInvite}>초대 아이콘</button>
          </div>
        )}
        <button onClick={handleOpenCreate}>
          {isBlueprintListPage
            ? '새 블루프린트 만들기 +'
            : '새 프로젝트 만들기 +'}
        </button>
      </div>
      {isCreate && <CreateProject />}
      {isInviteOpen && <EmailInput />} {/* 이메일 입력 컴포넌트 토글 */}
    </SubHeaderWrapper>
  );
};

const SubHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export default SubHeader;
