import React from 'react';
import styled from 'styled-components';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import Tabs from '../components/common/Tabs';
import Thumbnail from '../components/project/Thumbnail';

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
`;

const SubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: orange;
  width: 100%;
  padding: 10px 20px; /* 좌우 간격 추가 */
`;

function ProjectLayout() {
  const userId = 96168794; // 예시 userId

  return (
    <Wrapper>
      <Header />
      <ContentWrapper>
        <SubHeader>
          <h3>공간</h3>
          <button>만들기</button>
        </SubHeader>
        <Tabs
          tabs={['모든 프로젝트', '내 프로젝트', '공유 프로젝트']}
          iconType="search"
        />
        <Thumbnail userId={userId} />
      </ContentWrapper>
      <BackButton />
    </Wrapper>
  );
}

export default ProjectLayout;
