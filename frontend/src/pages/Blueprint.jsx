import { useEffect, useState } from 'react';
import { get } from '../api/index';

import BlueprintLayout from '../layouts/BlueprintLayout';
import BlueprintCanvas from '../components/blueprint/BlueprintCanvas';
import ImportantNoteSection from '../components/blueprint/ImportantNoteSection';
import NoteHistory from '../components/blueprint/NoteHistory';
import PinNotes from '../components/blueprint/PinNotes';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Blueprintversions from '../components/blueprint/BlueprintVersions';

const Blueprint = () => {
  // params 로 변경
  const blueprint_id = 1;
  const blueprint_version_id = 1987029227680993;

  // current blueprint
  const [blueprintTitle, setBlueprintTite] = useState('');
  const [blueprintUrl, setBlueprintUrl] = useState('');

  // draft blueprint
  const [draftUrl, setDraftUrl] = useState('');

  // versionbar
  const [blueprints, setBlueprints] = useState([]);

  // sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAllPinVisible, setIsAllPinVisible] = useState(true);

  // toolbar
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

  // init
  useEffect(() => {
    // 개별 blueprint 요청
    get(`blueprints/${blueprint_id}/${blueprint_version_id}`).then((res) => {
      const {
        status,
        data: { content },
      } = res;

      if (status === 200) {
        setBlueprintTitle(content.blueprint_version_title);
        // setBlueprintUrl(content.blueprint_image);
        // 임시 도면
        setBlueprintUrl(
          'https://magazine.brique.co/wp-content/uploads/2022/08/3_%EB%8F%84%EB%A9%B4_3%EC%B8%B5%ED%8F%89%EB%A9%B4%EB%8F%84.jpeg',
        );
      }
    });
  }, []);

  // 모든 pin 정보 요청
  useEffect(() => {
    get(`blueprints/${blueprint_id}/${blueprint_version_id}/pins`).then(
      (res) => {
        const {
          status,
          data: { content },
        } = res;

        if (status === 200) {
          console.log(
            'GET blueprints/${blueprint_id}/${blueprint_version_id}/pins',
          );
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
        console.log('GET blueprints/${blueprint_id}');
        setBlueprints(content);
        console.log(content);
      }
    });
  }, []);

  return (
    <BlueprintLayout>
      <div className="relative overflow-hidden">
        {/* todo : canvas 크기 변경시 아직 문제 많음 */}
        {/* <div
          className={`h-screen pt-[48px] border border-black transition-all duration-300 ${isSidebarOpen ? 'w-[calc(100%-20rem)]' : 'w-full'}`}
        > */}
        <div className="w-full h-screen pt-[48px] border border-black">
          <div className="border border-black absolute left-2 top-[58px] z-1">
            <div className="flex justify-between items-center">
              <button className="border border-black">시안</button>
              <div>
                <button>{'<'}</button>
                <Select>
                  <SelectTrigger className="w-[125px] h-[32px] bg-white border-zinc-400 text-zinc-800 focus:ring-zinc-300">
                    {/* todo : 현재 블루프린트와 일치하는 버전 노출 시키기 */}
                    <SelectValue
                      placeholder={
                        '[' +
                        blueprints[0]?.blueprint_version_seq +
                        '] ' +
                        blueprints[0]?.blueprint_version_name
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="w-[120px] bg-white border-zinc-400 text-zinc-800 break-all">
                    <SelectGroup>
                      {blueprints.map((item, index) => (
                        <SelectItem
                          key={item.blueprint_version_id}
                          value={item.blueprint_version_id}
                        >
                          [{item.blueprint_version_seq}]{' '}
                          {item.blueprint_version_name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <button className="border">{'>'}</button>
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
          <div className="border border-black absolute left-[50%] bottom-4">
            <button className="border border-black" onClick={onClickPinButton}>
              핀
            </button>
            <button className="border border-black" onClick={onClickMouseButon}>
              마우스
            </button>
          </div>
        </div>
        <div
          className={`absolute top-0 right-0 transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0 w-[20rem]' : 'translate-x-full'
          } h-screen pt-[48px] border border-black z-[4] bg-white`}
        >
          <div>sidebar</div>
          <ImportantNoteSection />
          <NoteHistory />
          <PinNotes />
        </div>
        {/* sidebar open & close */}
        <div className="fixed top-[48px] right-0 bg-gray-200 p-2 z-10">
          {/* todo : icon 대체 필요 */}
          <button onClick={toggleSidebar}>
            {isSidebarOpen ? '사이드바 닫기' : '사이드바 열기'}/
          </button>
          <button onClick={togglePinVisible}>
            {isAllPinVisible ? '전체 핀 끄기' : '전체 핀 켜기'}/
          </button>
          <button onClick={closeAllNotePopup}>전체 노트 끄기/</button>
          <button onClick={closeAllImagePopup}>전체 이미지 끄기</button>
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
