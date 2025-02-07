import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { modalState } from '../recoil/common/modal';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import Login from '../components/main/Login';
import TextButton from '../components/common/TextButton';

const MainPage = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const setModal = useSetRecoilState(modalState);

  const handleOpenLogin = () => setIsLoginVisible(true);
  const handleCloseLogin = () => setIsLoginVisible(false);

  return (
    <>
      <Header />
      <div className="flex flex-col h-screen p-4 box-border">
        <div className="flex items-center h-full gap-4">
          {/* 왼쪽 섹션 */}
          <div className="flex-1">
            <h1 className="text-2xl mb-2">서비스 소개</h1>
            <p className="text-lg mb-4">서비스설명</p>
            <TextButton type="start" onClick={handleOpenLogin}>
              시작하기
            </TextButton>

            {/* 모달 테스트 */}
            <div className="mt-4">
              <button
                onClick={() =>
                  setModal({
                    type: 'modal',
                    title: '모달 제목',
                    content: <div>여기에 컨텐츠</div>,
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
          </div>

          {/* 이미지 영역 */}
          <Link to="/projects">프로젝트 페이지</Link>
          <div className="w-[830px] h-[520px] flex items-center justify-center mr-[65px] border border-gray-300 rounded-md">
            이미지 표시 영역
          </div>
        </div>

        {/* 버튼 섹션 */}
        <div className="flex gap-4 mt-4 mx-auto w-4/5 max-w-[800px]">
          {['버튼 1', '버튼 2', '버튼 3', '버튼 4', '버튼 5'].map(
            (text, index) => (
              <TextButton
                key={index}
                type="content"
                onClick={() => console.log(text)}
              >
                {text}
              </TextButton>
            ),
          )}
        </div>

        <BackButton />
      </div>
      <Login isVisible={isLoginVisible} onClose={handleCloseLogin} />
    </>
  );
};

export default MainPage;
