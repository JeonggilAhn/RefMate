import React from 'react';
import styled from 'styled-components';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
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

const Tab = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: pink;
  width: 100%;
  padding: 10px 20px; /* 좌우 간격 추가 */
`;

const Components = styled.div`
  background-color: yellow;
  flex-grow: 1; /* 남은 공간을 차지하도록 */
  width: 100%;
  overflow-y: auto; /* 이 부분만 스크롤 가능하도록 */
  max-height: calc(
    100vh - 200px
  ); /* Header, SubHeader, Tab의 총 높이를 제외한 영역만 차지 */
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 한 줄에 3개 */
  gap: 10px;
  padding: 10px; /* 콘텐츠와의 여백 추가 */
  box-sizing: border-box;
`;

const Item = styled.div`
  background-color: lightblue;
  padding: 20px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

function ProjectLayout() {
  return (
    <>
      <Header /> {/* 헤더를 최상단에 위치 */}
      <Wrapper>
        <ContentWrapper>
          <SubHeader>
            <h3>공간</h3>
            <button>만들기</button>
          </SubHeader>
          <Tab>
            <div>탭 탭 탭</div>
            <div>검색</div>
          </Tab>
          <Components>
            {Array.from({ length: 25 }, (_, i) => (
              <Item key={i}>프로젝트 컴포넌트 {i + 1}</Item>
            ))}
          </Components>
        </ContentWrapper>
        <BackButton />
      </Wrapper>
    </>
  );
}

export default ProjectLayout;
