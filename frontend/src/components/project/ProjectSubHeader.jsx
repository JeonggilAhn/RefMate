import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { get } from '../../api';
import { useLocation } from 'react-router-dom';
import EditButton from '../common/EditButton';
import CreateProject from './CreateProject';
import TextButton from '../common/TextButton';
import { useSetRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';

const SubHeader = ({ userId, projectId }) => {
  const [userName, setUserName] = useState('');
  const location = useLocation();
  const setModal = useSetRecoilState(modalState);

  const handleCreateProject = () => {
    setModal({
      type: 'modal',
      title: '새 프로젝트',
      content: <CreateProject setModal={setModal} />,
    });
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

    fetchUserName();
  }, [userId, projectId]);

  const isBlueprintListPage = location.pathname.includes('blueprints');

  return (
    <SubHeaderWrapper>
      <LeftSection>
        <h3>{isBlueprintListPage ? projectName : `${userName}님의 공간`}</h3>
        {isBlueprintListPage && <EditButton />}
      </LeftSection>
      <TextButton onClick={handleCreateProject}>
        새 프로젝트 만들기 +
      </TextButton>
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
