import { useEffect, useState } from 'react';
import { get } from '../api/index';

import BlueprintLayout from '../layouts/BlueprintLayout';
import BlueprintCanvas from '../components/blueprint/BlueprintCanvas';
import ImportantNoteSection from '../components/blueprint/ImportantNoteSection';
import NoteHistory from '../components/blueprint/NoteHistory';

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
        <div className="w-full h-screen pt-[48px] border border-black">
          <BlueprintCanvas
            imageUrl={blueprintUrl}
            isPinButtonEnaled={isPinButtonEnaled}
            initialPins={initialPins}
            isAllPinVisible={isAllPinVisible}
          />
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
