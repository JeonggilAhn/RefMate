import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';

const MainPage = () => {
  return (
    <>
      <Header /> {/* 헤더를 최상단에 위치 */}
      <Container>
        <Explain>
          <LeftSection>
            <Title>서비스 소개</Title>
            <Description>서비스설명</Description>
            <StartButton>
              <Link to="/projects">프로젝트 페이지</Link>
            </StartButton>
          </LeftSection>
          <ImageBox>이미지 표시 영역</ImageBox>
        </Explain>
        <ButtonSection>
          {['버튼 1', '버튼 2', '버튼 3', '버튼 4', '버튼 5'].map(
            (text, index) => (
              <ContentButton key={index}>{text}</ContentButton>
            ),
          )}
        </ButtonSection>
        <BackButton />
      </Container>
    </>
  );
};

export default MainPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 16px;
  box-sizing: border-box;
`;

const Explain = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 16px;
`;

const LeftSection = styled.div`
  flex: 1;
`;

const ImageBox = styled.div`
  width: 830px;
  height: 520px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 65px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 8px;
`;

const Description = styled.p`
  font-size: 16px;
  margin-bottom: 16px;
`;

const StartButton = styled.button`
  height: 32px;
  padding: 8px 33px;
  font-size: 16px;
  background-color: #7ba8ec;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #6589bf;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  gap: 16px;
  margin: 16px auto 0;
  width: 80%;
  max-width: 800px;
`;

const ContentButton = styled.button`
  flex: 1;
  width: 154px;
  height: 34px;
  padding: 7px 16px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;

  &:hover {
    background-color: #d9d9d9;
  }
`;
