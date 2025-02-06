import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import ProjectTabs from '../components/project/ProjectTabs';
import Thumbnail from '../components/project/Thumbnail';
import ProjectSubHeader from '../components/project/ProjectSubHeader';

function ProjectList() {
  const userId = 96168794; // 예시 userId

  const [filterType, setFilterType] = useState('all');

  return (
    <Wrapper>
      <Header />
      <ContentWrapper>
        <ProjectSubHeader userId={userId} />
        <ProjectTabs
          actions={[
            { name: '모든 프로젝트', type: 'all' },
            { name: '내 프로젝트', type: 'mine' },
            { name: '공유 프로젝트', type: 'shared' },
          ]}
          setFilterType={setFilterType}
        />
        <Thumbnail userId={userId} filterType={filterType} />
      </ContentWrapper>
      <BackButton />
    </Wrapper>
  );
}

export default ProjectList;

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 48px; // 헤더자리
  height: calc(100vh - 48px);
  overflow: hidden; /* Wrapper에는 스크롤을 적용하지 않음 */
`;

const ContentWrapper = styled.div`
  padding: 25px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  flex-grow: 1;
`;
