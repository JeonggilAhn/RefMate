import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { modalState } from '../recoil/common/modal';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import Login from '../components/main/Login';
import TextButton from '../components/common/TextButton';
import Icon from '../components/common/Icon';

// 버튼별 컴포넌트 import
import Button1 from '../components/main/Button1';
import Button2 from '../components/main/Button2';
import Button3 from '../components/main/Button3';
import Button4 from '../components/main/Button4';

const MainPage = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const setModal = useSetRecoilState(modalState);

  // 현재 선택된 버튼 (기본값: 첫 번째 버튼)
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);

  // 버튼 데이터 배열
  const buttons = [
    {
      text: '핀 단위 관리',
      iconName: 'IconTbPinStroke',
      component: <Button1 />,
    },
    {
      text: '노트 히스토리 기록',
      iconName: 'IconTbNotes',
      component: <Button2 />,
    },
    {
      text: '도면 업로드 및 비교',
      iconName: 'IconTbFileImport',
      component: <Button3 />,
    },
    {
      text: '프로젝트 단위 관리',
      iconName: 'IconLuGalleryVerticalEnd',
      component: <Button4 />,
    },
  ];

  return (
    <>
      <Header />
      <div className="flex flex-col h-screen p-4 box-border">
        <div className="flex justify-center items-center h-full gap-4">
          {/* 왼쪽 섹션 */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl mb-2">Ref Mate</h1>
            <p className="text-lg mb-4">서비스 설명</p>
            <TextButton type="start" onClick={() => setIsLoginVisible(true)}>
              시작하기
            </TextButton>
          </div>

          {/* 이미지 및 컴포넌트 영역 */}
          <div className="w-[830px] h-[520px] flex items-center justify-center border border-gray-300 rounded-md">
            {buttons[selectedButtonIndex].component}
          </div>
        </div>

        {/* 버튼 섹션 */}
        <div className="flex gap-4 mt-4 mx-auto w-4/5 max-w-[800px]">
          {buttons.map(({ text, iconName }, index) => (
            <TextButton
              key={index}
              type="content"
              isSelected={selectedButtonIndex === index}
              onClick={() => setSelectedButtonIndex(index)}
              className="w-full text-sm font-medium h-16 flex items-center justify-center gap-2"
            >
              <Icon name={iconName} width={24} height={24} />
              {text}
            </TextButton>
          ))}
        </div>

        <BackButton />
      </div>
      <Login
        isVisible={isLoginVisible}
        onClose={() => setIsLoginVisible(false)}
      />
    </>
  );
};

export default MainPage;
