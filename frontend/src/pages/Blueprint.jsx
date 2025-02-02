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

  const [isPinButtonEnaled, setIsPinButtonEnaled] = useState(true);

  const [initialPins, setInitialPins] = useState([]);

  const onClickPinButton = () => {
    setIsPinButtonEnaled(true);
  };

  const onClickMouseButon = () => {
    setIsPinButtonEnaled(false);
  };

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
      <div className="flex">
        <div className="w-full h-screen pt-[48px] border border-black">
          <BlueprintCanvas
            imageUrl={blueprintUrl}
            isPinButtonEnaled={isPinButtonEnaled}
            initialPins={initialPins}
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
        <div className="min-w-[20rem] w-[20rem] h-screen pt-[48px] border border-black">
          <div>sidebar</div>
          <ImportantNoteSection />
          <NoteHistory />
        </div>
      </div>
    </BlueprintLayout>
  );
};

export default Blueprint;
