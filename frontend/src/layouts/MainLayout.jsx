import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { modalState } from '../recoil/common/modal';

import styled from 'styled-components';
import Login from '../components/main/Login';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';

const MainPage = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  const handleOpenLogin = () => setIsLoginVisible(true);
  const handleCloseLogin = () => setIsLoginVisible(false);

  // modal test
  const setModal = useSetRecoilState(modalState);

  return (
    <>
      <Header />
      <Container>
        <Explain>
          <LeftSection>
            <Title>서비스 소개</Title>
            <Description>서비스설명</Description>
            <StartButton onClick={handleOpenLogin}>시작하기</StartButton>
            {/* modal test 나중에 지울 부분*/}
            <div>
              <button
                onClick={() =>
                  setModal({
                    type: 'modal',
                    title: '모달 제목',
                    content: <div>여기에 컨텐츠</div>, // 여기에 react component 넣으면 돼요
                  })
                }
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                폼 모달
              </button>
              <button
                onClick={() =>
                  setModal({
                    type: 'confirm',
                    message: '정말 진행하시겠습니까?',
                    onConfirm: () => alert('확인됨'),
                  })
                }
                className="px-4 py-2 bg-yellow-500 text-white rounded ml-2"
              >
                컨펌 모달
              </button>
              <button
                onClick={() =>
                  setModal({ type: 'alert', message: '경고 메시지입니다.' })
                }
                className="px-4 py-2 bg-red-500 text-white rounded ml-2"
              >
                알림 모달
              </button>
            </div>
            {/* modal test */}
          </LeftSection>
          <Link to="/projects">프로젝트 페이지</Link>
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
      <Login isVisible={isLoginVisible} onClose={handleCloseLogin} />
    </>
  );
};

export default MainPage;

// 기존 스타일 코드 (생략)

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
