import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { modalState } from '../recoil/common/modal';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import TextButton from '../components/common/TextButton';
import Icon from '../components/common/Icon';
import LoginContent from '../components/main/LoginContent';

// 버튼별 컴포넌트 import
import Button1 from '../components/main/Button1';
import Button2 from '../components/main/Button2';
import Button3 from '../components/main/Button3';
import Button4 from '../components/main/Button4';

import Animation from '../components/main/Animation';

const MainPage = () => {
  const setModal = useSetRecoilState(modalState);

  // 현재 선택된 버튼 (기본값: 첫 번째 버튼)
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);

  // 버튼 데이터 배열
  const buttons = [
    {
      text: '핀 단위 관리',
      iconName: 'IconTbPinStroke',
      component: <Button1 />,
      description:
        '중요한 논의가 필요한 위치에 핀을 표시해보세요.\n각 핀마다 상세 정보를 저장하고 팀원들과 공유할 수 있습니다.',
    },
    {
      text: '노트 히스토리 기록',
      iconName: 'IconTbNotes',
      component: <Button2 />,
      description:
        '블루프린트에 작성된 모든 노트를 한눈에 확인하세요.\n시간순으로 정리된 노트로 프로젝트의 진행 과정을 쉽게 파악할 수 있습니다.',
    },
    {
      text: '도면 업로드 및 비교',
      iconName: 'IconTbFileImport',
      component: <Button3 />,
      description:
        '새로운 버전의 도면을 자유롭게 업로드해보세요.\n이전 도면과의 변경사항을 정확히 파악할 수 있습니다.',
    },
    {
      text: '프로젝트 단위 버전 관리',
      iconName: 'IconLuGalleryVerticalEnd',
      component: <Button4 />,
      description:
        '프로젝트의 모든 도면을 체계적으로 관리하세요.\n각 버전 별 히스토리를 통해 프로젝트의 진행 과정을 효율적으로 관리할 수 있습니다.',
    },
  ];

  return (
    <>
      <Header />
      <main className="absolute top-[47px] left-0 w-full h-[calc(100vh-47px)] bg-gray-100 flex flex-col items-center justify-center overflow-hidden">
        <Animation />
        {/* <div className="p-10 rounded-md flex flex-col gap-10">
          {buttons.map(({ text, iconName, component, description }, index) => (
            <div
              key={index}
              className={`flex gap-6 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div className="w-2/3 h-120 flex justify-center items-center">
                {component}
              </div>
              <div className="w-1/3 flex flex-col justify-center">
                <h2 className="text-xl font-bold mb-2">{text}</h2>
                <p className="text-sm whitespace-pre-line">{description}</p>
              </div>
            </div>
          ))}
        </div> */}

        {/* todo : scroll 이벤트로 변경 */}
        <div className="fixed flex justify-center items-center w-full gap-40 mb-8 z-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl mb-2">Ref Mate</h1>
            <TextButton
              type="start"
              onClick={() =>
                setModal({
                  type: 'modal',
                  content: <LoginContent />,
                })
              }
            >
              시작하기
            </TextButton>
          </div>
        </div>
        <div className="fixed bottom-0 flex justify-center mb-5">
          <p>© 2025 RefMate. All rights reserved.</p>
        </div>
        <BackButton />
      </main>
    </>
  );
};

export default MainPage;
