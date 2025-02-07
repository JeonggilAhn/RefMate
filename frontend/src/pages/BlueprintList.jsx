import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import BlueprintListSubHeader from '../components/project/BlueprintListSubHeader';
import BlueprintThumbnail from '../components/project/BlueprintThumbnail';
import BlueprintListTabs from '../components/project/BlueprintListTabs';

function BlueprintList() {
  const userId = 96168794; // 예시 userId
  const { projectId } = useParams(); // projectId 가져오기

  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Wrapper>
      <Header />
      <ContentWrapper>
        <BlueprintListSubHeader userId={userId} projectId={projectId} />
        <BlueprintListTabs
          actions={[{ name: '모든 블루프린트', type: 'all' }]}
          setFilterType={setFilterType}
          setSearchQuery={setSearchQuery}
        ></BlueprintListTabs>
        <BlueprintThumbnail
          projectId={projectId}
          filterType={filterType}
          searchQuery={searchQuery}
        />
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
