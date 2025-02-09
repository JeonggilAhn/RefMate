import { useEffect, useState, useRef } from 'react';
import { get } from '../api/index';

import BlueprintLayout from '../layouts/BlueprintLayout';
import BlueprintCanvas from '../components/blueprint/BlueprintCanvas';
import ImportantNoteSection from '../components/blueprint/ImportantNoteSection';
import NoteHistory from '../components/blueprint/NoteHistory';
import PinNotes from '../components/blueprint/PinNotes';
import { SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Blueprintversions from '../components/blueprint/BlueprintVersions';

import Icon from '../components/common/Icon';

import DropDown from '../components/common/DropDown';
import SelectBox from '../components/common/SelectBox';

const Blueprint = () => {
  const blueprint_id = 1;
  const blueprint_version_id = 1987029227680993;

  // current blueprint
  const [blueprintTitle, setBlueprintTitle] = useState('');
  const [blueprintUrl, setBlueprintUrl] = useState('');

  // compare blueprint
  const [draftUrl, setDraftUrl] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDetailSidebarOpen, setIsDetailSidebarOpen] = useState(false);

  // sidebar tool bar
  const [isAllPinVisible, setIsAllPinVisible] = useState(true);
  const [isPinButtonEnaled, setIsPinButtonEnaled] = useState(true);

  // version tool bar
  const [blueprints, setBlueprints] = useState([]);
  const [isDraftVisible, setIsDraftVisible] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);

  // pins
  const [initialPins, setInitialPins] = useState([]);

  // sidebar detail
  const [detailPinImages, setDetailPinImages] = useState([]);
  const bottomRef = useRef(null);

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

  const togglePinVisible = () => {
    setIsAllPinVisible((prev) => !prev);
  };

  const toggleDraftVisible = () => {
    setIsDraftVisible((prev) => !prev);
  };

  const closeAllNotePopup = () => {};
  const closeAllImagePopup = () => {};

  const openBlueprintVersion = () => setIsVersionOpen(true);
  const closeBlueprintVersion = () => setIsVersionOpen(false);

  const onClickInfoButton = () => {
    console.log('pin info button');

    // 01 핀 상세 이미지 조회
    // 02 핀 상세 중요 노트 조회
    // 03 핀 상세 모든 노트 조회

    get('pins/{pin_id}/images').then((res) => {
      const {
        status,
        data: { content },
      } = res;

      if (status === 200) {
        setDetailPinImages(content);
        setIsDetailSidebarOpen(true);
      }
    });
  };

  const onClickSidebarBackButton = () => {
    setIsDetailSidebarOpen(false);
  };

  useEffect(() => {
    get(`blueprints/${blueprint_id}/${blueprint_version_id}`).then((res) => {
      const {
        status,
        data: { content },
      } = res;

      if (status === 200) {
        setBlueprintTitle(content.blueprint_version_title);
        setBlueprintUrl(
          'https://magazine.brique.co/wp-content/uploads/2022/08/3_%EB%8F%84%EB%A9%B4_3%EC%B8%B5%ED%8F%89%EB%A9%B4%EB%8F%84.jpeg',
        );
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
          setInitialPins(content);
        }
      },
    );

    get(`blueprints/${blueprint_id}`).then((res) => {
      const {
        status,
        data: { content },
      } = res;

      if (status === 200) {
        setBlueprints(content);
      }
    });

    // test
    get('pins/{pin_id}/images').then((res) => {
      const {
        status,
        data: { content },
      } = res;

      if (status === 200) {
        setDetailPinImages(content);
      }
    });
  }, []);

  // 상세 이미지 컴포넌트가 렌더링될 때마다 스크롤을 가장 아래로 이동
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [detailPinImages]);

  return (
    <BlueprintLayout>
      <div className="relative overflow-hidden">
        {/* 사이드바 컨트롤 버튼 */}
        <div className="fixed top-[48px] w-[22rem] right-0 z-10 p-2 flex justify-between">
          <button onClick={toggleSidebar} className="p-2">
            <Icon name="IconLuPanelRight" width={24} height={24} />
          </button>
          <div className="flex gap-2">
            <button onClick={togglePinVisible} className="p-2">
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

        {/* todo : canvas 크기 변경시 아직 문제 많음 */}
        <div
          className={`h-screen pt-[48px] border border-black transition-all duration-300 ${isSidebarOpen ? 'w-[calc(100%-22rem)]' : 'w-full'}`}
        >
          {/* <div className="w-full h-screen pt-[48px] border border-black"> */}
          <div className="border border-black absolute left-2 top-[58px] z-1">
            <div className="flex justify-between items-center">
              <button
                className="border border-black"
                onClick={openBlueprintVersion}
              >
                시안
              </button>
              <div className="flex">
                <button className="border border-black">{'<'}</button>
                {/* todo : 현재 블루프린트와 일치하는 버전 노출 */}
                <SelectBox>
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

                <button className="border border-black">{'>'}</button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                className="border border-black"
                onClick={toggleDraftVisible}
              >
                {isDraftVisible ? '눈알 켰다' : '눈알 껐다'}
              </button>
              <Slider
                defaultValue={[33]}
                max={100}
                step={1}
                className="h-[8px] bg-zinc-300 rounded-full"
              />
            </div>
          </div>
          <BlueprintCanvas
            imageUrl={blueprintUrl}
            isPinButtonEnaled={isPinButtonEnaled}
            initialPins={initialPins}
            isAllPinVisible={isAllPinVisible}
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
          className={`absolute top-0 right-0 transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'w-[22rem]' : 'min-w-0 w-0 overflow-hidden'} h-screen border border-black z-[4] bg-white flex flex-col`}
        >
          <div className="pt-[48px]" />
          <div className="mt-[60px] px-[0.3rem] flex-1">
            <NoteHistory />
            {/* start */}
            <div className="h-[32rem] border pb-2 rounded-lg shadow-md bg-white">
              <div className="text-center font-semibold p-2 border-b">
                전체 핀
              </div>
              <div className="px-2">
                <div className="flex justify-between items-center p-2 border-b">
                  <div className="flex gap-4">
                    <button className="font-semibold text-blue-600">
                      진행중
                    </button>
                    <button className="text-gray-500">완료</button>
                  </div>
                  <button className="flex justify-center items-center border border-black cursor-pointer hover:bg-[#F1F1F1]">
                    <Icon name="IconTbMenu2" />
                  </button>
                </div>

                <div className="p-2 flex justify-end items-center gap-2">
                  <SelectBox>
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

                <div className="h-[20rem] grid grid-cols-2 grid-rows-[12rem] gap-2 overflow-y-auto">
                  {initialPins.map((pin, index) => {
                    return (
                      <div
                        key={pin.pin_id}
                        className="border rounded-md p-2 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span className="w-28 truncate font-medium">
                              {pin.pin_name}
                            </span>
                          </div>
                          <button className="text-gray-400">⋮</button>
                        </div>

                        <div className="grid grid-cols-2 gap-row-2 gap-1 place-items-center mt-2">
                          {!pin.preview_image_list.length ? (
                            <div className="w-full h-[4rem] flex items-center justify-center text-gray-400 bg-gray-100 rounded-md">
                              No image
                            </div>
                          ) : (
                            pin.preview_image_list.map((item, idx) => (
                              <div key={item.image_id}>
                                <img
                                  src={item.image_preview}
                                  alt="reference"
                                  className="w-[4rem] h-[4rem] object-cover rounded-md border"
                                />
                                {item.is_bookmark && (
                                  <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 clip-triangle"></div>
                                )}
                                {idx === 3 && pin.image_list.length > 4 && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm font-semibold rounded-md">
                                    +{pin.image_list.length - 4}
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* end */}
          </div>
        </div>
        <div
          className={`absolute top-0 right-0 transition-transform duration-500 ease-in-out ${isDetailSidebarOpen ? 'w-[22rem]' : 'min-w-0 w-0 overflow-hidden'} h-screen border border-black z-[4] bg-white flex flex-col`}
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
                <p className=" break-words">{blueprintTitle}</p>
              </div>
              <div>
                <DropDown />
              </div>
            </div>
            <div className="relative border border-[#CBCBCB] rounded-lg shadow-md bg-white h-[250px]">
              <div className="sticky top-0 w-full rounded-t-lg text-lg font-semibold bg-[#F5F5F5]">
                <h2>레퍼런스</h2>
              </div>
              <div className="h-[210px] overflow-y-auto p-2">
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
                <div ref={bottomRef} />
              </div>
            </div>
            <ImportantNoteSection />
            <PinNotes isSidebar={true} />
          </div>
        </div>
      </div>
      {isVersionOpen && (
        <Blueprintversions
          blueprintId={blueprint_id}
          blueprintTitle={blueprintTitle}
          closeModal={closeBlueprintVersion}
        />
      )}
    </BlueprintLayout>
  );
};

export default Blueprint;
