import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  overflow: hidden; // Wrapper에는 스크롤을 적용하지 않음
`;

const Header = styled.header`
  background-color: aqua;
  width: 100%;
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
  padding: 10px 0;
`;

const Tab = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: pink;
  width: 100%;
  padding: 10px 0;
`;

const Components = styled.div`
  background-color: yellow;
  flex-grow: 1; // 남은 공간을 차지하도록
  width: 100%;
  overflow-y: auto; // 이 부분만 스크롤 가능하도록
  max-height: calc(
    100vh - 200px
  ); // Header, SubHeader, Tab의 총 높이를 제외한 영역만 차지
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 한 줄에 3개 */
  gap: 10px;
`;

const Item = styled.div`
  background-color: lightblue;
  padding: 20px;
  text-align: center;
`;

function ProjectLayout() {
  return (
    <Wrapper>
      <Header>header</Header>
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
            <Item key={i}> 프로젝트 컴포넌트 {i + 1}</Item>
          ))}
        </Components>
      </ContentWrapper>
    </Wrapper>
  );
}

export default ProjectLayout;
