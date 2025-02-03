import { useEffect, useState } from 'react';
import { get } from '../api/index';

import BlueprintLayout from '../layouts/BlueprintLayout';
import BlueprintCanvas from '../components/blueprint/BlueprintCanvas';
import ImportantNoteSection from '../components/blueprint/ImportantNoteSection';
import PinNoteHistory from '../components/blueprint/PinNoteHistory';
import PinNotes from '../components/blueprint/PinNotes';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const Blueprint = () => {
  // params 로 변경
  const blueprint_id = 1;
  const blueprint_version_id = 1987029227680993;

  const [blueprintTitle, setBlueprintTite] = useState('');
  const [blueprintUrl, setBlueprintUrl] = useState('');

  // sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAllPinVisible, setIsAllPinVisible] = useState(true);

  // toolbar
  const [isPinButtonEnaled, setIsPinButtonEnaled] = useState(true);

  const [initialPins, setInitialPins] = useState([]);

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

  const closeAllNotePopup = () => {};

  const closeAllImagePopup = () => {};

  // init
  useEffect(() => {
    // 개별 blueprint 요청
    get(`blueprints/${blueprint_id}/${blueprint_version_id}`).then((res) => {
      const {
        status,
        data: { content },
      } = res;

      if (status === 200) {
        setBlueprintTite(content.blueprint_version_title);
        // setBlueprintUrl(content.blueprint_image);
        // 임시 도면
        setBlueprintUrl(
          'https://magazine.brique.co/wp-content/uploads/2022/08/3_%EB%8F%84%EB%A9%B4_3%EC%B8%B5%ED%8F%89%EB%A9%B4%EB%8F%84.jpeg',
        );
      }
    });
  }, [blueprintTitle]);

  useEffect(() => {
    get(`blueprints/${blueprint_id}/${blueprint_version_id}/pins`).then(
      (res) => {
        const {
          status,
          data: { content },
        } = res;

        if (status === 200) {
          setInitialPins(content);
          console.log('요청');
          console.log(content);
        }
      },
    );
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
            <div className="flex justify-between">
              <button className="border border-black">시안</button>
              <div>
                <button>{'<'}</button>
                <Select>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>North America</SelectLabel>
                      <SelectItem value="est">
                        Eastern Standard Time (EST)
                      </SelectItem>
                      <SelectItem value="cst">
                        Central Standard Time (CST)
                      </SelectItem>
                      <SelectItem value="mst">
                        Mountain Standard Time (MST)
                      </SelectItem>
                      <SelectItem value="pst">
                        Pacific Standard Time (PST)
                      </SelectItem>
                      <SelectItem value="akst">
                        Alaska Standard Time (AKST)
                      </SelectItem>
                      <SelectItem value="hst">
                        Hawaii Standard Time (HST)
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Europe & Africa</SelectLabel>
                      <SelectItem value="gmt">
                        Greenwich Mean Time (GMT)
                      </SelectItem>
                      <SelectItem value="cet">
                        Central European Time (CET)
                      </SelectItem>
                      <SelectItem value="eet">
                        Eastern European Time (EET)
                      </SelectItem>
                      <SelectItem value="west">
                        Western European Summer Time (WEST)
                      </SelectItem>
                      <SelectItem value="cat">
                        Central Africa Time (CAT)
                      </SelectItem>
                      <SelectItem value="eat">
                        East Africa Time (EAT)
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Asia</SelectLabel>
                      <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                      <SelectItem value="ist">
                        India Standard Time (IST)
                      </SelectItem>
                      <SelectItem value="cst_china">
                        China Standard Time (CST)
                      </SelectItem>
                      <SelectItem value="jst">
                        Japan Standard Time (JST)
                      </SelectItem>
                      <SelectItem value="kst">
                        Korea Standard Time (KST)
                      </SelectItem>
                      <SelectItem value="ist_indonesia">
                        Indonesia Central Standard Time (WITA)
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Australia & Pacific</SelectLabel>
                      <SelectItem value="awst">
                        Australian Western Standard Time (AWST)
                      </SelectItem>
                      <SelectItem value="acst">
                        Australian Central Standard Time (ACST)
                      </SelectItem>
                      <SelectItem value="aest">
                        Australian Eastern Standard Time (AEST)
                      </SelectItem>
                      <SelectItem value="nzst">
                        New Zealand Standard Time (NZST)
                      </SelectItem>
                      <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>South America</SelectLabel>
                      <SelectItem value="art">Argentina Time (ART)</SelectItem>
                      <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                      <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                      <SelectItem value="clt">
                        Chile Standard Time (CLT)
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <button>{'>'}</button>
              </div>
            </div>
            <div className="flex justify-between">
              <button className="border border-black">눈알</button>
              <Slider defaultValue={[33]} max={100} step={1} />
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
          <PinNoteHistory />
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
    </BlueprintLayout>
  );
};

export default Blueprint;
