import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import SubHeader from '../components/project/SubHeader';
import { useLocation } from 'react-router-dom';
import BlueprintThumbnail from '../components/project/BlueprintThumbnail';

function BlueprintList() {
  const userId = 96168794; // 예시 userId
  const location = useLocation();

  const isBlueprintListPage = location.pathname.includes('blueprints');
  const [filterType, setFilterType] = useState('all');

  return (
    <Wrapper>
      <Header />
      <ContentWrapper>
        <SubHeader userId={userId} projectId={isBlueprintListPage ? 1 : null} />{' '}
        <BlueprintThumbnail></BlueprintThumbnail>
      </ContentWrapper>
      <BackButton />
    </Wrapper>
  );
}

export default BlueprintList;

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
