import { useEffect, useState, useRef } from 'react';
import { get } from '../api/index';
import { useRecoilState } from 'recoil';

import BlueprintLayout from '../layouts/BlueprintLayout';
import BlueprintCanvas from '../components/blueprint/BlueprintCanvas';
import ImportantNoteSection from '../components/blueprint/ImportantNoteSection';
import NoteHistory from '../components/blueprint/NoteHistory';
import PinNotes from '../components/blueprint/PinNotes';
import { SelectItem } from '@/components/ui/select';
import Blueprintversions from '../components/blueprint/BlueprintVersions';

import Icon from '../components/common/Icon';

import DropDown from '../components/common/DropDown';
import SelectBox from '../components/common/SelectBox';
import { pinState } from '../recoil/blueprint';
import EditOption from '../components/project/EditOption';
import Tabs from '../components/common/Tabs';
import Slider from '../components/common/Slider';
import { modalState } from '../recoil/common/modal';
import ImageCarouselPopup from '../components/blueprint/ImageCarouselPopup';

const Blueprint = () => {
  const blueprint_id = 1;
  const blueprint_version_id = 1987029227680993;

  // pins
  const [pins, setPins] = useRecoilState(pinState);
  const [isViewFolder, setIsViewFolder] = useState(true);

  // current blueprint
  const [blueprint, setBlueprint] = useState({});
  // overlay blueprint
  const [overlayBlueprint, setOverlayBlueprint] = useState({});

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDetailSidebarOpen, setIsDetailSidebarOpen] = useState(false);

  // sidebar tool bar
  const [isPinButtonEnaled, setIsPinButtonEnaled] = useState(true);

  // version tool bar
  const [blueprints, setBlueprints] = useState([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState({});
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  // sidebar detail
  const [detailPinImages, setDetailPinImages] = useState([]);
  const bottomRef = useRef(null);
  const [detailPin, setDetailPin] = useState({});

  const [modal, setModal] = useRecoilState(modalState);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [detailPopupImages, setDetailPopupImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const onClickPinButton = () => {
    setIsPinButtonEnaled(true);
  };

  const onClickMouseButon = () => {
    setIsPinButtonEnaled(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    setIsDetailSidebarOpen((prev) => {
      if (prev === true) {
        return false;
      }
    });
  };

  const toggleAllPinVisible = () => {
    setPins((prev) => {
      return prev.map((pin) => {
        return { ...pin, is_visible: !pin.is_visible };
      });
    });
  };

  const togglePinVisible = (pin_id) => {
    setPins((prev) => {
      return prev.map((pin) => {
        if (pin.pin_id === pin_id) {
          return { ...pin, is_visible: !pin.is_visible };
        }

        return { ...pin };
      });
    });
  };

  // todo : 고장남 ㅋ
  const toggleOverlayVisible = () => {
    setIsOverlayVisible((prev) => {
      if (prev === false) {
        setOverlayOpacity(0.8);
      } else {
        setOverlayOpacity(0);
      }

      return !prev;
    });
  };

  const closeAllNotePopup = () => {
    setPins((prev) => {
      return prev.map((pin) => {
        return { ...pin, is_open_note: !pin.is_open_note };
      });
    });
  };

  const closeAllImagePopup = () => {
    setPins((prev) => {
      return prev.map((pin) => {
        return { ...pin, is_open_image: !pin.is_open_image };
      });
    });
  };

  const openBlueprintVersion = () => setIsVersionOpen(true);
  const closeBlueprintVersion = () => setIsVersionOpen(false);

  const onClickInfoButton = (pin) => {
    console.log('pin info button');
    setDetailPin(pin);
    console.log('핀 정보: ', pin);

    // 01 핀 상세 이미지 조회
    // 02 핀 상세 중요 노트 조회
    // 03 핀 상세 모든 노트 조회

    get('pins/{pin_id}/images').then((res) => {
      const {
        status,
        data: { content },
      } = res;

      if (status === 200) {
        console.log('이미지다', content);
        // 배열
        // image_list
        // image_id
        // image_origin
        // image_preview
        // is_bookmark
        // note_id
        // note_title
        setDetailPinImages(content);
        setIsDetailSidebarOpen(true);
      }
    });
  };

  const onClickSidebarBackButton = () => {
    setIsDetailSidebarOpen(false);
  };

  useEffect(() => {
    // 개별 블루프린트 조회
    // 첫 조회 블루프린트가 곧 첫 오버레이 블루프린트
    get(`blueprints/${blueprint_id}/${blueprint_version_id}`).then((res) => {
      const {
        status,
        data: { content },
      } = res;

      if (status === 200) {
        // todo : 추후 제거
        content.blueprint_image =
          'https://magazine.brique.co/wp-content/uploads/2022/08/3_%EB%8F%84%EB%A9%B4_3%EC%B8%B5%ED%8F%89%EB%A9%B4%EB%8F%84.jpeg';
        setBlueprint(content);
        setOverlayBlueprint(content);
      }
    });
  }, []);

  useEffect(() => {
    get(`blueprints/${blueprint_id}/${blueprint_version_id}/pins`).then(
      (res) => {
        const {
          status,
          data: { content },
        } = res;

        if (status === 200) {
          const data = content.map((item) => {
            return {
              is_visible: true,
              is_open_note: false,
              is_open_image: false,
              ...item,
            };
          });
          setPins(data);
        }
      },
    );

    // 모든 블루프린트 버전 리스트 조회
    get(`blueprints/${blueprint_id}`).then((res) => {
      const {
        status,
        data: { content },
      } = res;

      if (status === 200) {
        const newContent = content.map((item, index) => {
          return { ...item, index };
        });
        console.log(newContent);
        setBlueprints(newContent);
      }
    });
  }, []);

  // 현재는 같을리가 없겠구나 ..
  // blue_print_version_id 비교 필요
  useEffect(() => {
    const print = blueprints.find((item) => {
      return item.blueprint_version_name === blueprint.blueprint_version_name;
    });
    setSelectedBlueprint(print);
  }, [blueprints, blueprint]);

  // todo : 상세 이미지 컴포넌트가 렌더링될 때마다 스크롤을 가장 아래로 이동안함
  useEffect(() => {
    // bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [detailPinImages]);

  const pinActions = [
    { name: '수정', handler: () => {} },
    { name: '완료', handler: () => {} },
  ];

  const tabActions = [
    { name: '진행중', handler: () => {} },
    { name: '완료', handler: () => {} },
  ];

  const onClickViewOptionButton = () => {
    setIsViewFolder((prev) => !prev);
  };

  const onChangeSlider = (value) => {
    setOverlayOpacity(value[0]);
  };

  const onClickPrevBlueprintButton = () => {
    setSelectedBlueprint((prev) => {
      console.log('prev', prev);
      if (prev.index > 0) {
        return { ...blueprints[prev.index - 1] };
      }

      return prev;
    });
  };

  const onClickNextBlueprintButton = () => {
    setSelectedBlueprint((prev) => {
      console.log('prev', prev);
      if (prev.index < blueprints.length - 1) {
        return { ...blueprints[prev.index + 1] };
      }

      return prev;
    });
  };

  const onSelectBlueprintVersion = (blueprint) => {
    // 개별 블루프린트 조회
    setSelectedBlueprint(blueprint);
    get(`blueprints/${blueprint_id}/${blueprint.blueprint_version_id}`).then(
      (res) => {
        const {
          status,
          data: { content },
        } = res;

        if (status === 200) {
          // todo : 추후 제거
          content.blueprint_image =
            'https://dimg.donga.com/wps/NEWS/IMAGE/2022/01/28/111500268.2.jpg';
          setOverlayBlueprint(content);
        }
      },
    );
  };

  const onClickImage = (imageList, imageIndex) => {
    // imageIndex 아직 사용하진 않음
    setDetailPopupImages(imageList);
    setCurrentImageIndex(imageIndex);
    setIsDetailPopupOpen(true);
  };

  const onClickPinImage = (pinId) => {};

  return (
    <BlueprintLayout>
      <div className="relative overflow-hidden">
        {/* 사이드바 컨트롤 버튼 */}
        <div className="fixed top-[48px] w-[22rem] right-0 z-10 p-2 flex justify-between">
          <button onClick={toggleSidebar} className="p-2">
            <Icon name="IconLuPanelRight" width={24} height={24} />
          </button>
          <div className="flex gap-2">
            <button onClick={toggleAllPinVisible} className="p-2">
              <Icon name="IconTbPinStroke" width={24} height={24} />
            </button>
            <button onClick={closeAllNotePopup} className="p-2">
              <Icon name="IconTbNotes" width={24} height={24} />
            </button>
            <button onClick={closeAllImagePopup} className="p-2">
              <Icon name="IconTbPhoto" width={24} height={24} />
            </button>
          </div>
        </div>

        {/* todo : canvas resize 기능 develop */}
        <div className={`w-full h-screen pt-[48px]`}>
          {/* <div className="w-full h-screen pt-[48px] border border-black"> */}
          <div className="border border-[#CBCBCB] rounded-sm absolute left-2 top-[58px] z-6 px-2 py-2 bg-[#ffffff]">
            <div className="flex justify-between items-center gap-2">
              <button
                className="w-[2.4rem] h-[2.4rem] flex justify-center items-center rounded-md cursor-pointer hover:bg-[#F1F1F1]"
                onClick={openBlueprintVersion}
              >
                <Icon name="IconBsLayers" />
              </button>
              <div className="flex items-center gap-1">
                <button
                  className="w-[2.4rem] h-[2.4rem] flex justify-center items-center border border-[#CBCBCB] bg-[#F5F5F5] rounded-md cursor-pointer hover:bg-[#F1F1F1]"
                  onClick={onClickPrevBlueprintButton}
                >
                  <Icon name="IconGoChevronPrev" width={20} height={20} />
                </button>
                {/* 개별 블루프린트 조회시 blueprint_version_seq 내려달라고 요청할 것 */}
                <SelectBox
                  value={selectedBlueprint}
                  onValueChange={onSelectBlueprintVersion}
                  placeholder={`[${blueprint.blueprint_version_seq}] ${blueprint.blueprint_version_name}`}
                >
                  {blueprints.map((print, index) => (
                    <SelectItem key={print.blueprint_version_id} value={print}>
                      [{print.blueprint_version_seq}]{' '}
                      {print.blueprint_version_name}
                    </SelectItem>
                  ))}
                </SelectBox>

                <button
                  className="w-[2.4rem] h-[2.4rem] flex justify-center items-center border border-[#CBCBCB] bg-[#F5F5F5] rounded-md cursor-pointer hover:bg-[#F1F1F1]"
                  onClick={onClickNextBlueprintButton}
                >
                  <Icon name="IconGoChevronNext" width={20} height={20} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <button
                className="w-[2.9rem] h-[2.4rem] flex justify-center items-center rounded-md cursor-pointer hover:bg-[#F1F1F1]"
                onClick={toggleOverlayVisible}
              >
                {isOverlayVisible ? (
                  <Icon name="IconTbEye" />
                ) : (
                  <Icon name="IconTbEyeClosed" />
                )}
              </button>
              <Slider
                defaultValue={[overlayOpacity]}
                max={1}
                step={0.01}
                disabled={isOverlayVisible ? false : true}
                onChangeSlider={onChangeSlider}
              />
            </div>
          </div>
          <BlueprintCanvas
            imageUrl={blueprint.blueprint_image}
            overlayImageUrl={overlayBlueprint.blueprint_image}
            overlayOpacity={overlayOpacity}
            isOverlayVisible={isOverlayVisible}
            isPinButtonEnaled={isPinButtonEnaled}
            onClickInfoButton={onClickInfoButton}
          />
          {/* toolbar */}
          <div className="flex justify-between border w-[5.5rem] border-black absolute left-[50%] bottom-4 p-[0.2rem]">
            <button
              className="w-[2.4rem] h-[2.4rem] flex justify-center items-center border border-black cursor-pointer hover:bg-[#F1F1F1]"
              onClick={onClickPinButton}
            >
              <Icon name="IconTbPinStroke" width={30} height={30} />
            </button>
            <button
              className="w-[2.4rem] h-[2.4rem] flex justify-center items-center border border-black cursor-pointer hover:bg-[#F1F1F1]"
              onClick={onClickMouseButon}
            >
              <Icon name="IconBsCursor" width={25} height={25} />
            </button>
          </div>
        </div>
        {/* sidebar */}
        <div
          className={`absolute top-0 right-0 transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'w-[22rem]' : 'min-w-0 w-0 overflow-hidden'} h-screen border border-black z-[4] bg-white flex flex-col overflow-hidden`}
        >
          <div className="pt-[48px]" />
          <div className="mt-[60px] px-[0.3rem] flex-1">
            <NoteHistory />
            {/* pin list section */}
            <div className="h-[32rem] border pb-2 rounded-lg shadow-md bg-white">
              <div className="text-center font-semibold p-2 border-b">
                전체 핀
              </div>
              {/* todo : 컴포넌트 수정 후 연동 */}
              {/* <Tabs actions={tabActions} /> */}
              <div className="p-2">
                <div className="flex justify-between items-center p-2 border-b">
                  <div className="flex gap-4">
                    <button className="font-semibold text-blue-600">
                      진행중
                    </button>
                    <button className="text-gray-500">완료</button>
                  </div>
                  <button className="flex justify-center items-center border border-black cursor-pointer hover:bg-[#F1F1F1]">
                    <Icon
                      name="IconTbMenu2"
                      onClick={onClickViewOptionButton}
                    />
                  </button>
                </div>

                <div className="p-2 flex justify-end items-center gap-2">
                  <SelectBox value={'haha'} onValueChange={() => {}}>
                    {blueprints.map((item, index) => (
                      <SelectItem
                        key={item.blueprint_version_id}
                        value={item.blueprint_version_id}
                      >
                        [{item.blueprint_version_seq}]{' '}
                        {item.blueprint_version_name}
                      </SelectItem>
                    ))}
                  </SelectBox>
                </div>

                <div className="relative w-full">
                  <div
                    className={`absolute h-[20rem] grid grid-cols-2 grid-rows-[12rem] gap-2 overflow-y-auto overflow-x-hidden ${isViewFolder ? 'visible' : 'invisible'}`}
                  >
                    {pins.map((pin, index) => {
                      return (
                        <div
                          key={pin.pin_id}
                          className="border rounded-md p-2 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => togglePinVisible(pin.pin_id)}
                              >
                                {pin.is_visible ? (
                                  <Icon name="IconTbEye" width={19} />
                                ) : (
                                  <Icon name="IconTbEyeClosed" width={19} />
                                )}
                              </button>
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              <span className="w-18 truncate font-medium">
                                {pin.pin_name}
                              </span>
                            </div>
                            <EditOption actions={pinActions} />
                          </div>

                          {!pin.preview_image_list.length ? (
                            <div className="grid grid-cols-1 grid-rows-1 gap-rows-1 place-items-center mt-2">
                              <div className="w-full h-[8rem] flex items-center justify-center text-gray-400 bg-gray-100 rounded-md">
                                No image
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 grid-row-2 gap-1 place-items-center mt-2">
                              {pin.preview_image_list.map((item, idx) => (
                                <div
                                  key={item.image_id}
                                  onClick={() => onClickPinImage('haha')}
                                >
                                  <img
                                    src={item.image_preview}
                                    alt="reference"
                                    className="w-[4rem] h-[4rem] object-cover rounded-md border"
                                  />
                                  {item.image_id && item.is_bookmark && (
                                    <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 clip-triangle"></div>
                                  )}
                                  {idx === 3 && pin.image_list.length > 4 && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm font-semibold rounded-md">
                                      +{pin.image_list.length - 4}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className={`absolute h-[20rem] grid grid-cols-1 grid-rows-8 gap-2 overflow-y-auto overflow-x-hidden ${isViewFolder ? 'invisible' : 'visible'}`}
                  >
                    {pins.map((pin) => (
                      <div
                        key={pin.pin_id}
                        className="flex items-center justify-between bg-gray-100 rounded-md p-2 shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">{pin.icon}</span>
                          <button onClick={() => togglePinVisible(pin.pin_id)}>
                            {pin.is_visible ? (
                              <Icon name="IconTbEye" width={19} />
                            ) : (
                              <Icon name="IconTbEyeClosed" width={19} />
                            )}
                          </button>
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="w-[13.8rem] text-sm font-medium">
                            {pin.pin_name}
                          </span>
                        </div>
                        <EditOption actions={pinActions} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* pin list section */}
          </div>
        </div>
        <div
          className={`absolute top-0 right-0 transition-transform duration-500 ease-in-out ${isDetailSidebarOpen ? 'w-[22rem]' : 'min-w-0 w-0 overflow-hidden'} h-screen border border-black z-[4] bg-white flex flex-col overflow-hidden`}
        >
          <div className="pt-[40px]" />
          <div className="mt-[60px] px-[0.3rem] flex-1 overflow-hidden">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button className="w-[2.4rem] h-[2.4rem] flex justify-center items-center border border-black cursor-pointer hover:bg-[#F1F1F1]">
                  <Icon
                    name="IconGoChevronPrev"
                    onClick={onClickSidebarBackButton}
                  />
                </button>
                <p className="break-words">
                  {blueprint.blueprint_version_name}
                </p>
              </div>
              <div>
                <DropDown />
              </div>
            </div>
            <div className="relative border border-[#CBCBCB] rounded-lg shadow-md bg-white h-[250px]">
              <div className="sticky top-0 w-full rounded-t-lg text-lg font-semibold bg-[#F5F5F5]">
                <h2>레퍼런스</h2>
              </div>
              <div ref={bottomRef} className="h-[210px] overflow-y-auto p-2">
                {detailPinImages.map((pin) => {
                  const images = pin.image_list.slice(0, 3); // 최대 3개 표시
                  return (
                    <div key={pin.note_id} className="mb-2">
                      <div className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-md">
                        {pin.note_title}
                      </div>
                      <div className="grid gap-1 mt-2 grid-cols-3 place-items-center">
                        {images.map((item, idx) => (
                          <div
                            key={item.image_id}
                            className="relative w-[6.1rem] h-[6.1rem]"
                            onClick={() => onClickImage(pin.image_list, idx)}
                          >
                            <img
                              src={item.image_preview}
                              alt="reference"
                              className="w-full h-full object-cover rounded-md border"
                            />
                            {item.is_bookmark && (
                              <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 clip-triangle"></div>
                            )}
                            {idx === 2 && pin.image_list.length > 3 && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm font-semibold rounded-md">
                                +{pin.image_list.length - 3}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <ImportantNoteSection />
            <PinNotes pinInfo={detailPin} isSidebar={true} />
          </div>
        </div>
      </div>
      {isVersionOpen && (
        <Blueprintversions
          blueprintId={blueprint_id}
          blueprintTitle={blueprint.blueprint_version_name}
          closeModal={closeBlueprintVersion}
        />
      )}
      <ImageCarouselPopup
        images={detailPopupImages}
        initialIndex={currentImageIndex}
        isOpen={isDetailPopupOpen}
        onClickCloseButton={() => setIsDetailPopupOpen(false)}
      />
    </BlueprintLayout>
  );
};

export default Blueprint;
