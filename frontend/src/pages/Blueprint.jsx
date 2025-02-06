import { useEffect, useState } from 'react';
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

  const [isFirstRender, setIsFirstRender] = useState(true);

  // current blueprint
  const [blueprintTitle, setBlueprintTitle] = useState('');
  const [blueprintUrl, setBlueprintUrl] = useState('');
  const [draftUrl, setDraftUrl] = useState('');
  const [blueprints, setBlueprints] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAllPinVisible, setIsAllPinVisible] = useState(true);
  const [isPinButtonEnaled, setIsPinButtonEnaled] = useState(true);
  const [isDraftVisible, setIsDraftVisible] = useState(false);
  const [initialPins, setInitialPins] = useState([]);
  const [isVersionOpen, setIsVersionOpen] = useState(false);

  const onClickPinButton = () => {
    setIsPinButtonEnaled(true);
  };

  const onClickMouseButon = () => {
    setIsPinButtonEnaled(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
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

  useEffect(() => {
    setIsFirstRender(false);
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
  }, []);

  return (
    <BlueprintLayout>
      <div className="relative overflow-hidden">
        {/* 사이드바 컨트롤 버튼 */}
        <div className="fixed top-[48px] w-[20rem] right-0 z-10 p-2 flex justify-between">
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
          className={`h-screen pt-[48px] border border-black transition-all duration-300 ${isSidebarOpen ? 'w-[calc(100%-20rem)]' : 'w-full'}`}
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
            isSidebarOpen={isSidebarOpen}
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
          className={`absolute top-0 right-0 transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'w-[20rem]' : 'w-0'} h-screen border border-black z-[4] bg-white flex flex-col`}
        >
          <div className="pt-[48px]" />
          <div className="mt-[60px] flex-1 overflow-y-auto">
            <p>blueprintTitle</p>
            {/* <ImportantNoteSection /> */}
            <NoteHistory />
            {/* <PinNotes /> */}
          </div>
        </div>
        <div
          className={`absolute top-0 right-0 transition-transform duration-500 ease-in-out ${true ? 'w-[20rem]' : 'w-0'} h-screen border border-black z-[4] bg-white flex flex-col`}
        >
          <div className="pt-[40px]" />
          <div className="mt-[60px] flex-1 overflow-y-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button className="w-[2.4rem] h-[2.4rem] flex justify-center items-center border border-black cursor-pointer hover:bg-[#F1F1F1]">
                  <Icon name="IconGoChevronPrev" />
                </button>
                <p className=" break-words">{blueprintTitle}</p>
              </div>
              <div>
                <DropDown />
              </div>
            </div>
            <ImportantNoteSection />
            <PinNotes />
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
