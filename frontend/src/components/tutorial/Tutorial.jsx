import { useState } from 'react';
import BlueprintLayout from '../../layouts/BlueprintLayout';
import Icon from '../common/Icon';
import ToolbarSide from '../blueprint/ToolbarSide';
import Toolbar from '../blueprint/Toolbar';
import { useRecoilState } from 'recoil';
import { colorState } from '../../recoil/common/color';
import ToolbarOpacity from '../blueprint/ToolbarOpacity';
import SelectBox from '../common/SelectBox';
import styled from 'styled-components';
import MainBlueprint from '../../assets/images/mainBlueprint-removebg.png';
import PinContents from '../blueprint/PinContents';

const Tutorial = ({ setIsTutorial }) => {
  // 단계들
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: '프로젝트 생성하기',
      content: '새로운 프로젝트를 만들어 도면을 관리할 수 있습니다.',
    },
    {
      title: 'Ref Mate에 오신 것을 환영합니다',
      content: 'Ref Mate와 함께 효율적인 도면 관리를 시작해보세요.',
    },
    {
      title: '도면 업로드',
      content: '프로젝트에 도면을 업로드하여 관리를 시작하세요.',
    },
    {
      title: '핀 추가하기',
      content: '도면 위에 핀을 추가하여 중요한 부분을 표시할 수 있습니다.',
    },
    {
      title: '노트 작성하기',
      content: '핀에 노트를 작성하여 상세 정보를 기록하세요.',
    },
    {
      title: '이미지 첨부',
      content: '핀에 이미지를 첨부하여 시각적 참조를 추가할 수 있습니다.',
    },
    {
      title: '도면 버전 관리',
      content: '도면의 버전을 관리하여 변경 사항을 추적할 수 있습니다.',
    },
    {
      title: '도면 오버레이',
      content: '여러 버전의 도면을 겹쳐보며 변경사항을 비교할 수 있습니다.',
    },
    {
      title: '팀 협업',
      content: '팀원들과 함께 도면을 공유하고 협업할 수 있습니다.',
    },
    {
      title: '시작해볼까요?',
      content:
        '이제 Ref Mate의 주요 기능을 모두 살펴보았습니다. 실제로 사용해보세요!',
    },
  ];

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  ///////////////////// 블루프린트 페이지
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDetailSidebarOpen, setIsDetailSidebarOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [colors, setColors] = useRecoilState(colorState);

  const [isViewFolder, setIsViewFolder] = useState(true);
  const [pins, setPins] = useState([
    {
      pin_id: 79,
      pin_name: '화장실',
      pin_x: 830,
      pin_y: 450,
      preview_image_list: [],
      preview_image_count: 0,
      pin_group: {
        pin_group_id: 372,
        pin_group_name: '조명계획',
        pin_group_color: '#F7825B',
        pin_group_color_light: '#FFE9E0',
      },
      is_active: true,
      is_open_note: false,
      is_open_image: false,
      unread_note_ids: [],
      isHighlighted: false,
      isPinContentsOpen: false,
    },
    {
      pin_id: 80,
      pin_name: '안방',
      pin_x: 600,
      pin_y: 550,
      preview_image_list: [],
      preview_image_count: 0,
      pin_group: {
        pin_group_id: 377,
        pin_group_name: '공간구성',
        pin_group_color: '#647FE1',
        pin_group_color_light: '#E5EAFF',
      },
      is_active: true,
      is_open_note: false,
      is_open_image: false,
      unread_note_ids: [],
      isHighlighted: false,
      isPinContentsOpen: false,
    },
    {
      pin_id: 81,
      pin_name: '주방',
      pin_x: 500,
      pin_y: 770,
      preview_image_list: [],
      preview_image_count: 0,
      pin_group: {
        pin_group_id: 376,
        pin_group_name: '마감재',
        pin_group_color: '#87B5FA',
        pin_group_color_light: '#E5F0FF',
      },
      is_active: true,
      is_open_note: true,
      is_open_image: true,
      unread_note_ids: [],
      isHighlighted: false,
      isPinContentsOpen: true,
    },
  ]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    setIsDetailSidebarOpen((prev) => {
      if (prev === true) {
        return false;
      }
    });
  };

  const openBlueprintVersion = () => setIsVersionOpen(true);
  const closeBlueprintVersion = () => setIsVersionOpen(false);

  const onClickPin = (pin) => {
    console.log(pin);
    setPins((prev) => {
      return prev.map((item) => {
        if (item.pin_id === pin.pin_id) {
          return { ...item, isPinContentsOpen: true };
        }
        return item;
      });
    });
  };

  return (
    <BlueprintLayout>
      {/* 블루프린트 영역 */}
      <div className="relative overflow-hidden">
        <ToolbarSide
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        {pins.map((pin, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${pin.pin_x}px`,
              top: `${pin.pin_y}px`,
              zIndex: 1,
              pointerEvents: 'auto',
              transform: `translate(-50%, -50%)`,
              transformOrigin: 'center center',
              // animation:
              //   highlightedPinId === item.pin_id ? 'pulse 1s infinite' : 'none',
            }}
          >
            <div
              className={`relative ${
                pin.isHighlighted
                  ? 'scale-125 transition-transform duration-200'
                  : 'transition-transform duration-200'
              }`}
            >
              {/* 핀 아이콘 (활성화 상태일 때 테두리 추가) */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                {/* 하이라이트 효과용 배경 */}
                {pin.isHighlighted && (
                  <div
                    className="absolute w-16 h-16 rounded-full transition-all duration-200"
                    style={{
                      background: pin.isHighlighted
                        ? `radial-gradient(circle, ${pin.pin_group?.pin_group_color || '#87B5FA'} 0%, transparent 70%)`
                        : 'radial-gradient(circle, #87B5FA 0%, transparent 70%)',
                      filter: pin.isHighlighted ? 'blur(8px)' : 'blur(10px)',
                      opacity: pin.isHighlighted ? 0.8 : 0.6,
                      transform: pin.isHighlighted ? 'scale(1.2)' : 'scale(1)',
                      zIndex: -1,
                      animation: pin.isHighlighted
                        ? 'pulse-highlight 1.5s infinite'
                        : 'none',
                    }}
                  />
                )}
              </div>

              {/* 아이콘 */}
              <Icon
                name="IconTbPin"
                width={40}
                height={40}
                color={pin.pin_group?.pin_group_color || 'gray'}
                className={pin.isHighlighted ? 'animate-bounce-gentle' : ''}
                onClick={() => onClickPin(pin)}
              />

              {/* {!isContentsOpen && hoveredPin && (
                <div className="relative">
                  <Popup
                    onMouseEnter={() => setHoveredPin(pin)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div
                      className="absolute right-2 top-2 p-1 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClickPin(pin);
                      }}
                      onMouseEnter={handleButtonMouseEnter}
                      onMouseLeave={handleButtonMouseLeave}
                    >
                      <Icon
                        name="IconInfoCircle"
                        width={16}
                        height={16}
                        color="white"
                      />
                    </div>
                    <PopupTitle>{recentNotes?.title || '제목 없음'}</PopupTitle>
                    <PopupDivider />
                    <PopupContent>
                      {recentNotes?.content || '내용 없음'}
                    </PopupContent>
                  </Popup>
                </div>
              )} */}

              {/* 클릭 시 PinContents 직접 표시 */}
              <div className="absolute top-50 left-50">
                {true && (
                  <PinContents
                    pinInfo={pin}
                    pinId={pin.pin_id}
                    activeTab={pin.is_open_image ? 'image' : 'note'}
                    scale={1}
                    onClickPin={onClickPin}
                    onClose={() =>
                      setPins((prev) => {
                        return prev.map((item) => {
                          if (item.pin_id === pin.pin_id) {
                            return {
                              ...item,
                              is_open_note: false,
                              is_open_image: false,
                            };
                          }
                          return item;
                        });
                      })
                    }
                  />
                )}
              </div>
            </div>
          </div>
        ))}
        <div className={`w-full h-screen pt-[48px] relative`}>
          {isOverlayVisible ? <ToolbarOpacity /> : null}
          <div className="relative w-full h-full">
            <img
              src={MainBlueprint}
              alt="메인 블루프린트"
              className={`absolute top-0 left-0 h-full object-contain ${isSidebarOpen ? 'w-[calc(100%-22rem)]' : 'w-full'}`}
            />
          </div>
          <Toolbar
            isOverlayVisible={isOverlayVisible}
            openBlueprintVersion={openBlueprintVersion}
          />
        </div>
        <div
          className={`absolute top-0 right-0 transition-all duration-300 ease-in-out transform ${
            isSidebarOpen ? 'translate-x-0 w-[22rem]' : 'translate-x-full w-0'
          } h-screen border-l border-[#CBCBCB] z-[4] bg-white flex flex-col overflow-hidden`}
        >
          <div className="pt-[48px]" />
          <div className="mt-[60px] px-[0.3rem] grid grid-cols-1 grid-rows-1 h-[calc(100%-115px)]">
            <div className="h-full border border-[#CBCBCB] rounded-lg shadow-md bg-white">
              <div className="text-center p-2 border-b border-[#CBCBCB] rounded-t-lg bg-[#F5F5F5]">
                전체 핀
              </div>
              <div className="p-2 h-[calc(100vh-170px)]">
                <TabContainer>
                  <TabGroup>
                    <Tab className="text-[#7ba8ec] font-bold border-b-2 border-[#7BA8EC]">
                      진행중
                    </Tab>
                    <Tab>완료</Tab>
                  </TabGroup>
                  <button className="flex justify-center items-center rounded-md cursor-pointer hover:bg-[#F1F1F1] p-1">
                    <Icon name="IconTbMenu2" />
                  </button>
                </TabContainer>
                <div className="py-2 flex justify-end items-center gap-2">
                  <SelectBox placeholder={'전체'} width={40} />
                </div>
                {!pins.length ? (
                  <div className="border border-dashed rounded-sm border-[#CBCBCB] h-[calc(100%-86px)] flex justify-center items-center bg-[#F1F1F1]">
                    <p className="text-center text-[#414141]">
                      생성된 핀이 없습니다.
                      <br />
                      도면을 클릭해 핀을 생성해주세요.
                    </p>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <div
                      className={`absolute w-full left-0 top-0 grid grid-cols-2 gap-2 overflow-y-auto max-h-[calc(100vh-280px)]`}
                    >
                      {pins.map((pin) => (
                        <div
                          key={pin.pin_id}
                          className="border border-[#CBCBCB] rounded-md shadow-sm cursor-pointer"
                        >
                          <div
                            className="flex items-center justify-between pl-1 py-0.5 rounded-t-md relative group overflow-hidden border-b border-[#CBCBCB]"
                            style={{
                              backgroundColor: `${pin.pin_group?.pin_group_color}15`,
                            }}
                          >
                            <div
                              className="absolute inset-0 bg-current transition-all duration-300 ease-out transform translate-x-[-100%] group-hover:translate-x-0 z-0"
                              style={{
                                backgroundColor: pin.pin_group?.pin_group_color,
                                opacity: 0.15,
                              }}
                            />
                            <div className="flex items-center gap-1 z-10">
                              <button className="w-7 h-7 flex items-center justify-center hover:bg-white/50 cursor-pointer rounded-full">
                                <Icon
                                  name="IconTbPinFill"
                                  width={23}
                                  color={pin.pin_group?.pin_group_color}
                                />
                              </button>
                              <div className="w-23 truncate font-medium">
                                {pin.pin_name}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 grid-rows-1 gap-rows-1 place-items-center p-2">
                            <div className="w-full h-[8rem] flex items-center justify-center text-gray-400 bg-gray-100 rounded-md">
                              No image
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* 상세 사이드바 */}
        {/* 안내문 영역 */}
        {/* <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-4 z-100">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {tutorialSteps[currentStep].title}
              </h2>
              <button
                onClick={() => setIsTutorial(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icon name="IconCgClose" />
              </button>
            </div>

            <p className="text-gray-600 mb-8">
              {tutorialSteps[currentStep].content}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {currentStep + 1} / {tutorialSteps.length}
              </span>
              <div className="flex gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 rounded-lg ${
                    currentStep === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  이전
                </button>
                <button
                  onClick={
                    currentStep === tutorialSteps.length - 1
                      ? () => setIsTutorial(false)
                      : handleNext
                  }
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {currentStep === tutorialSteps.length - 1 ? '종료' : '다음'}
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </BlueprintLayout>
  );
};

export default Tutorial;

const Tab = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 'bold';
  color: '#7ba8ec';
  border-bottom: '2px solid #7BA8EC';
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #ddd;
`;

const TabGroup = styled.div`
  display: flex;
  gap: 10px;
`;
