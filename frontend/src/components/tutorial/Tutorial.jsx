import { useRef, useEffect, useState } from 'react';
import BlueprintLayout from '../../layouts/BlueprintLayout';
import Icon from '../common/Icon';
import styled from 'styled-components';
import SelectBox from '../common/SelectBox';
import Slider from '../common/Slider';
import PinTabs from '../blueprint/PinTabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import EditOption from '../project/EditOption';
import NoteButton from '../blueprint/NoteButton';

const A3_WIDTH = 1587;
const A3_HEIGHT = 1123;

const Tutorial = ({ setIsTutorial }) => {
  // 단계들
  const [currentStep, setCurrentStep] = useState(0);

  const [blueprints, setBlueprints] = useState([
    {
      blueprint_version_id: 61,
      blueprint_version_name: '시안 1 도면',
      preview_image:
        'https://i12a807.p.ssafy.io:8800/uploads/11/45a1da38-913e-4a49-9974-bbf563323cd7/fc5de2cf-d28e-40cc-abb7-177e6e1805d1_preview.webp',
      created_at: '2025-02-18T17:40:59.639488',
      blueprint_version_seq: 1,
    },
  ]);

  const tutorialSteps = [
    {
      title: '핀 생성 모드',
      content:
        '핀 버튼을 누르거나 Ctrl을 눌러 핀 모드로 전환하면 원하는 위치를 클릭해 핀을 찍을 수 있어요.',
      top: '',
      left: '50%',
      bottom: '-10px',
      right: '',
    },
    {
      title: '이동 모드',
      content:
        '도면을 자유롭게 이동해보세요. 마우스 휠을 사용해 확대/축소도 가능해요.',
      top: '',
      left: '50%',
      bottom: '-10px',
      right: '',
    },
    {
      title: '버전 이동 및 생성',
      content:
        '이전 버전의 기록을 확인하거나, 새로운 버전을 업로드할 수 있어요.',
      top: '',
      left: '50%',
      bottom: '100px',
      right: '',
    },
    {
      title: '버전 비교',
      content: '현재 버전과 원하는 버전의 변경점을 조절하며 확인해 보세요.',
      top: '155px',
      left: '490px',
      bottom: '',
      right: '',
    },
    {
      title: '전체 사이드바 툴',
      content:
        '사이드바를 열고 닫을 수 있어요. 핀/노트/이미지를 한 번에 닫을 수도 있어요.',
      top: '150px',
      left: '',
      bottom: '',
      right: '160px',
    },
    {
      title: '핀 위치 추적',
      content:
        '폴더 제목을 클릭하면, 해당 핀이 어디에 위치해 있는지 알 수 있어요.',
      top: '315px',
      left: '',
      bottom: '',
      right: '160px',
    },
    {
      title: '핀 완료/미완료',
      content:
        '논의가 끝난 핀은 ‘완료’로 설정할 수 있어요. 완료된 핀을 다시 ‘미완료’로 변경할 수도 있어요.',
      top: '245px',
      left: '',
      bottom: '',
      right: '160px',
    },
    {
      title: '핀 노트/이미지 상세',
      content:
        '핀을 클릭하면 상세 창이 떠요. 창 왼쪽 상단에 있는 아이콘을 클릭하면 노트나 이미지만 따로 볼 수도 있어요.',
      top: '190px',
      left: '',
      bottom: '',
      right: '180px',
    },
    {
      title: '상세 사이드바',
      content:
        '중요 노트, 핀 노트, 핀 레퍼런스를 사이드바에서 볼 수 있어요. 왼쪽 상단 아이콘을 눌러 사이드바를 열고 닫을 수 있어요.',
      top: '220px',
      left: '',
      bottom: '',
      right: '180px',
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

  const [pins, setPins] = useState([
    {
      pin_id: 93,
      pin_name: '화장실',
      pin_x: 135.598,
      pin_y: -106.63,
      preview_image_list: [
        {
          image_id: 90,
          image_origin:
            'https://i12a807.p.ssafy.io:8800/uploads/11/587b44f5-b9e0-4552-bca0-06c201909db4/7ed9bfda-6390-45da-8a20-4f3184562acf.jpeg',
          image_preview:
            'https://i12a807.p.ssafy.io:8800/uploads/11/587b44f5-b9e0-4552-bca0-06c201909db4/7ed9bfda-6390-45da-8a20-4f3184562acf_preview.webp',
          is_bookmark: false,
        },
        {
          image_id: 91,
          image_origin:
            'https://i12a807.p.ssafy.io:8800/uploads/11/b3d19303-42dd-4649-9fc1-cfb8dd0db3d6/d37187e3-d788-4210-873d-5ed58380911b.jpeg',
          image_preview:
            'https://i12a807.p.ssafy.io:8800/uploads/11/b3d19303-42dd-4649-9fc1-cfb8dd0db3d6/d37187e3-d788-4210-873d-5ed58380911b_preview.webp',
          is_bookmark: false,
        },
        {
          image_id: 92,
          image_origin:
            'https://i12a807.p.ssafy.io:8800/uploads/11/1ad240a8-d3a1-44f6-827b-2baba8959669/a465de82-30e5-4c93-a27a-40ac3bde2297.jpeg',
          image_preview:
            'https://i12a807.p.ssafy.io:8800/uploads/11/1ad240a8-d3a1-44f6-827b-2baba8959669/a465de82-30e5-4c93-a27a-40ac3bde2297_preview.webp',
          is_bookmark: false,
        },
        {
          image_id: 93,
          image_origin:
            'https://i12a807.p.ssafy.io:8800/uploads/11/6a1c3801-21e3-4022-a2ab-e0f9874fe636/bfdd787e-63d6-47ce-a176-27be310651e3.jpeg',
          image_preview:
            'https://i12a807.p.ssafy.io:8800/uploads/11/6a1c3801-21e3-4022-a2ab-e0f9874fe636/bfdd787e-63d6-47ce-a176-27be310651e3_preview.webp',
          is_bookmark: false,
        },
      ],
      preview_image_count: 4,
      pin_group: {
        pin_group_id: 382,
        pin_group_name: '조명계획',
        pin_group_color: '#F7825B',
        pin_group_color_light: '#FFE9E0',
      },
      is_active: true,
      unread_note_ids: [],
      is_visible: true,
      is_open_note: false,
      is_open_image: false,
      pinDetailNotes: [],
      pinDetailImages: [],
      isHighlighted: false,
      isContentsOpen: false,
      note_list: [
        {
          type: 'date-separator',
          date: '2025-02-18T17:47:03.368461',
        },
        {
          type: 'note',
          note_id: 178,
          note_writer: {
            user_id: 10,
            user_email: 'ciociolee97@gmail.com',
            profile_url:
              'https://lh3.googleusercontent.com/a/ACg8ocIVN1bcgn4f1ixaUdusFUE_osI1UUaXtCB3bxXz0KmSJQsZ_w=s96-c',
            signup_date: '2025-02-14T03:41:35.365995',
            role: 'ROLE_OWNER',
          },
          note_title: '화장실 조명 분위기',
          note_content:
            '조명 분위기가 따뜻하면서도 세련되면 좋겠어요! 자연광을 최대한 이용해보는 건 어떨까요',
          is_bookmark: false,
          created_at: '2025-02-18T17:47:03.368461',
          is_present_image: true,
          read_users: [
            {
              user_id: 10,
              user_email: 'ciociolee97@gmail.com',
              profile_url:
                'https://lh3.googleusercontent.com/a/ACg8ocIVN1bcgn4f1ixaUdusFUE_osI1UUaXtCB3bxXz0KmSJQsZ_w=s96-c',
              signup_date: '2025-02-14T03:41:35.365995',
              role: 'ROLE_OWNER',
            },
          ],
          preview_image_list: [
            {
              image_id: 90,
              image_origin:
                'https://i12a807.p.ssafy.io:8800/uploads/11/587b44f5-b9e0-4552-bca0-06c201909db4/7ed9bfda-6390-45da-8a20-4f3184562acf.jpeg',
              image_preview:
                'https://i12a807.p.ssafy.io:8800/uploads/11/587b44f5-b9e0-4552-bca0-06c201909db4/7ed9bfda-6390-45da-8a20-4f3184562acf_preview.webp',
              is_bookmark: false,
            },
            {
              image_id: 91,
              image_origin:
                'https://i12a807.p.ssafy.io:8800/uploads/11/b3d19303-42dd-4649-9fc1-cfb8dd0db3d6/d37187e3-d788-4210-873d-5ed58380911b.jpeg',
              image_preview:
                'https://i12a807.p.ssafy.io:8800/uploads/11/b3d19303-42dd-4649-9fc1-cfb8dd0db3d6/d37187e3-d788-4210-873d-5ed58380911b_preview.webp',
              is_bookmark: false,
            },
            {
              image_id: 92,
              image_origin:
                'https://i12a807.p.ssafy.io:8800/uploads/11/1ad240a8-d3a1-44f6-827b-2baba8959669/a465de82-30e5-4c93-a27a-40ac3bde2297.jpeg',
              image_preview:
                'https://i12a807.p.ssafy.io:8800/uploads/11/1ad240a8-d3a1-44f6-827b-2baba8959669/a465de82-30e5-4c93-a27a-40ac3bde2297_preview.webp',
              is_bookmark: false,
            },
            {
              image_id: 93,
              image_origin:
                'https://i12a807.p.ssafy.io:8800/uploads/11/6a1c3801-21e3-4022-a2ab-e0f9874fe636/bfdd787e-63d6-47ce-a176-27be310651e3.jpeg',
              image_preview:
                'https://i12a807.p.ssafy.io:8800/uploads/11/6a1c3801-21e3-4022-a2ab-e0f9874fe636/bfdd787e-63d6-47ce-a176-27be310651e3_preview.webp',
              is_bookmark: false,
            },
          ],
        },
      ],
      left: 20,
      right: 100,
      top: 400,
      bottom: 100,
    },
    {
      pin_id: 94,
      pin_name: '안방',
      pin_x: -147.925,
      pin_y: -134.982,
      preview_image_list: [
        {
          image_id: 94,
          image_origin:
            'https://i12a807.p.ssafy.io:8800/uploads/11/48f5d6f6-747b-4d0b-9974-44d5d88e4fb8/58e19d48-28e1-41e6-aa5e-0e9da7cf715f.jpeg',
          image_preview:
            'https://i12a807.p.ssafy.io:8800/uploads/11/48f5d6f6-747b-4d0b-9974-44d5d88e4fb8/58e19d48-28e1-41e6-aa5e-0e9da7cf715f_preview.webp',
          is_bookmark: false,
        },
        {
          image_id: 95,
          image_origin:
            'https://i12a807.p.ssafy.io:8800/uploads/11/556875eb-1466-4726-9f9a-e27175a70a33/5bd61683-63db-48c3-a6c1-ba19fc5049dc.jpeg',
          image_preview:
            'https://i12a807.p.ssafy.io:8800/uploads/11/556875eb-1466-4726-9f9a-e27175a70a33/5bd61683-63db-48c3-a6c1-ba19fc5049dc_preview.webp',
          is_bookmark: false,
        },
      ],
      preview_image_count: 2,
      pin_group: {
        pin_group_id: 387,
        pin_group_name: '공간구성',
        pin_group_color: '#647FE1',
        pin_group_color_light: '#E5EAFF',
      },
      is_active: true,
      unread_note_ids: [],
      is_visible: true,
      is_open_note: false,
      is_open_image: false,
      pinDetailNotes: [],
      pinDetailImages: [],
      isHighlighted: false,
      isContentsOpen: false,
      note_list: [
        {
          type: 'date-separator',
          date: '2025-02-18T17:55:43.541179',
        },
        {
          type: 'note',
          note_id: 180,
          note_writer: {
            user_id: 10,
            user_email: 'ciociolee97@gmail.com',
            profile_url:
              'https://lh3.googleusercontent.com/a/ACg8ocIVN1bcgn4f1ixaUdusFUE_osI1UUaXtCB3bxXz0KmSJQsZ_w=s96-c',
            signup_date: '2025-02-14T03:41:35.365995',
            role: 'ROLE_OWNER',
          },
          note_title: '침대와 가구 배치',
          note_content: '레퍼런스 이미지 첨부합니다',
          is_bookmark: false,
          created_at: '2025-02-18T17:55:43.541179',
          is_present_image: true,
          read_users: [
            {
              user_id: 10,
              user_email: 'ciociolee97@gmail.com',
              profile_url:
                'https://lh3.googleusercontent.com/a/ACg8ocIVN1bcgn4f1ixaUdusFUE_osI1UUaXtCB3bxXz0KmSJQsZ_w=s96-c',
              signup_date: '2025-02-14T03:41:35.365995',
              role: 'ROLE_OWNER',
            },
          ],
          preview_image_list: [
            {
              image_id: 94,
              image_origin:
                'https://i12a807.p.ssafy.io:8800/uploads/11/48f5d6f6-747b-4d0b-9974-44d5d88e4fb8/58e19d48-28e1-41e6-aa5e-0e9da7cf715f.jpeg',
              image_preview:
                'https://i12a807.p.ssafy.io:8800/uploads/11/48f5d6f6-747b-4d0b-9974-44d5d88e4fb8/58e19d48-28e1-41e6-aa5e-0e9da7cf715f_preview.webp',
              is_bookmark: false,
            },
            {
              image_id: 95,
              image_origin:
                'https://i12a807.p.ssafy.io:8800/uploads/11/556875eb-1466-4726-9f9a-e27175a70a33/5bd61683-63db-48c3-a6c1-ba19fc5049dc.jpeg',
              image_preview:
                'https://i12a807.p.ssafy.io:8800/uploads/11/556875eb-1466-4726-9f9a-e27175a70a33/5bd61683-63db-48c3-a6c1-ba19fc5049dc_preview.webp',
              is_bookmark: false,
            },
          ],
        },
      ],
      left: -220,
      right: 100,
      top: -20,
      bottom: 100,
    },
    {
      pin_id: 95,
      pin_name: '주방',
      pin_x: -267.498,
      pin_y: 226.203,
      preview_image_list: [],
      preview_image_count: 0,
      pin_group: {
        pin_group_id: 386,
        pin_group_name: '마감재',
        pin_group_color: '#87B5FA',
        pin_group_color_light: '#E5F0FF',
      },
      is_active: true,
      unread_note_ids: [],
      is_visible: true,
      is_open_note: false,
      is_open_image: false,
      pinDetailNotes: [],
      pinDetailImages: [],
      isHighlighted: false,
      isContentsOpen: false,
      note_list: [
        {
          type: 'date-separator',
          date: '2025-02-18T18:02:02.460802',
        },
        {
          type: 'note',
          note_id: 188,
          note_writer: {
            user_id: 10,
            user_email: 'ciociolee97@gmail.com',
            profile_url:
              'https://lh3.googleusercontent.com/a/ACg8ocIVN1bcgn4f1ixaUdusFUE_osI1UUaXtCB3bxXz0KmSJQsZ_w=s96-c',
            signup_date: '2025-02-14T03:41:35.365995',
            role: 'ROLE_OWNER',
          },
          note_title: '주방 분위기',
          note_content: '밝은 우드톤',
          is_bookmark: false,
          created_at: '2025-02-18T18:02:02.460802',
          is_present_image: false,
          read_users: [
            {
              user_id: 10,
              user_email: 'ciociolee97@gmail.com',
              profile_url:
                'https://lh3.googleusercontent.com/a/ACg8ocIVN1bcgn4f1ixaUdusFUE_osI1UUaXtCB3bxXz0KmSJQsZ_w=s96-c',
              signup_date: '2025-02-14T03:41:35.365995',
              role: 'ROLE_OWNER',
            },
          ],
        },
        {
          type: 'note',
          note_id: 189,
          note_writer: {
            user_id: 10,
            user_email: 'ciociolee97@gmail.com',
            profile_url:
              'https://lh3.googleusercontent.com/a/ACg8ocIVN1bcgn4f1ixaUdusFUE_osI1UUaXtCB3bxXz0KmSJQsZ_w=s96-c',
            signup_date: '2025-02-14T03:41:35.365995',
            role: 'ROLE_OWNER',
          },
          note_title: '마감재 고민',
          note_content:
            '마감재는 이런게 좋을 것 같다\n\nex\n* oo 카페 바닥재\n* xx 키즈카페 천정재\n',
          is_bookmark: false,
          created_at: '2025-02-18T18:06:26.129772',
          is_present_image: false,
          read_users: [
            {
              user_id: 10,
              user_email: 'ciociolee97@gmail.com',
              profile_url:
                'https://lh3.googleusercontent.com/a/ACg8ocIVN1bcgn4f1ixaUdusFUE_osI1UUaXtCB3bxXz0KmSJQsZ_w=s96-c',
              signup_date: '2025-02-14T03:41:35.365995',
              role: 'ROLE_OWNER',
            },
          ],
        },
      ],
      left: 0,
      right: 100,
      top: -220,
      bottom: 100,
    },
  ]);

  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(new Image());
  const draggableRef = useRef(null);

  const adjustImagePosition = () => {
    const canvas = canvasRef.current;
    const scaleX = canvas.width / A3_WIDTH;
    const scaleY = canvas.height / A3_HEIGHT;
    const minScale = Math.min(scaleX, scaleY);

    setScale(minScale);
    setPosition({ x: canvas.width / 2, y: canvas.height / 2 });
  };

  const drawImage = (ctx) => {
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (
      !imgRef.current.complete ||
      imgRef.current.naturalWidth === 0 ||
      imgRef.current.naturalHeight === 0
    ) {
      return;
    }

    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(scale, scale);

    // 이미지 원본 비율 계산
    const imgRatio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
    const a3Ratio = A3_WIDTH / A3_HEIGHT;

    let drawWidth = A3_WIDTH;
    let drawHeight = A3_HEIGHT;
    let offsetX = -A3_WIDTH / 2;
    let offsetY = -A3_HEIGHT / 2;

    if (imgRatio > a3Ratio) {
      // 이미지가 A3보다 더 가로로 긴 경우
      drawHeight = A3_WIDTH / imgRatio;
      offsetY = -(drawHeight / 2);
    } else {
      // 이미지가 A3보다 더 세로로 긴 경우
      drawWidth = A3_HEIGHT * imgRatio;
      offsetX = -(drawWidth / 2);
    }

    ctx.drawImage(imgRef.current, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  };

  const tabActions = [
    {
      name: '진행중',
      handler: () => {},
    },
    {
      name: '완료',
      handler: () => {},
    },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 캔버스 크기 설정
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    // 캔버스 준비 후 이미지 로드
    imgRef.current.src =
      'https://i12a807.p.ssafy.io:8800/uploads/11/45a1da38-913e-4a49-9974-bbf563323cd7/fc5de2cf-d28e-40cc-abb7-177e6e1805d1.png';

    imgRef.current.onload = () => {
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true; // 이미지 스무딩 활성화
      ctx.imageSmoothingQuality = 'high'; // 스무딩 품질 높게 설정

      if (!scale || scale === 1) {
        adjustImagePosition();
      }
      drawImage(ctx);
    };
  }, [canvasRef.current]);

  return (
    <BlueprintLayout>
      <div className="relative overflow-hidden">
        <div
          style={{
            position: 'fixed',
            top: `${tutorialSteps[currentStep].top}`,
            left: `${tutorialSteps[currentStep].left}`,
            bottom: `${tutorialSteps[currentStep].bottom}`,
            right: `${tutorialSteps[currentStep].right}`,
            transform: 'translate(-50%, -50%)',
            zIndex: 999,
            width: '400px',
          }}
          className="bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          <div className="relative p-6">
            <button
              onClick={() => setIsTutorial(false)}
              className="absolute top-4 right-4 cursor-pointer hover:bg-gray-100 p-1 rounded-md"
            >
              <Icon name="IconCgClose" width={20} height={20} />
            </button>
            <h2 className="text-xl font-bold mb-2">
              {tutorialSteps[currentStep].title}
            </h2>
            <p className="text-gray-600 mb-8">
              {tutorialSteps[currentStep].content}
            </p>
            <div className="flex justify-between items-center mt-8">
              <span className="text-sm text-gray-500">
                {currentStep + 1} / {tutorialSteps.length}
              </span>
              <div className="flex gap-2">
                {currentStep === 0 ? null : (
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="cursor-pointer hover:bg-gray-100 p-1 rounded-md"
                  >
                    <Icon name="IconGoChevronPrev" width={20} height={20} />
                  </button>
                )}
                {currentStep === tutorialSteps.length - 1 ? (
                  <button
                    onClick={() => setIsTutorial(false)}
                    className="px-4 py-2 bg-[#7BA8EC] text-white rounded-md hover:bg-[#7BA8EC] transition-colors cursor-pointer"
                  >
                    종료
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={currentStep === tutorialSteps.length - 1}
                    className="cursor-pointer hover:bg-gray-100 p-1 rounded-md"
                  >
                    <Icon name="IconGoChevronNext" width={20} height={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* themed 처리 */}
        <div className="absolute w-[100vw] h-[100vh] bg-black/70 z-55"></div>
        {4 <= currentStep ? (
          <div
            className={`fixed top-[48px] right-0 z-10 p-1 flex justify-between items-center border border-[#CBCBCB] rounded-md m-1.5 bg-white transition-all duration-300 ease-in-out w-[21.2rem] ${currentStep === 4 ? 'z-99' : ''}`}
          >
            <button
              onClick={() => {}}
              className="w-[2.4rem] h-[2.4rem] flex justify-center items-center rounded-md cursor-pointer hover:bg-[#F1F1F1]"
            >
              <Icon name="IconLuPanelRight" width={24} height={24} />
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => {}}
                className="w-[2.4rem] h-[2.4rem] flex justify-center items-center rounded-md cursor-pointer hover:bg-[#F1F1F1] pr-1"
              >
                <Icon name="IconTbPinStroke" width={28} height={28} />
              </button>
              <button
                onClick={() => {}}
                className="w-[2.4rem] h-[2.4rem] flex justify-center items-center rounded-md cursor-pointer hover:bg-[#F1F1F1]"
              >
                <Icon name="IconTbNote" width={26} height={26} />
              </button>
              <button
                onClick={() => {}}
                className="w-[2.4rem] h-[2.4rem] flex justify-center items-center rounded-md cursor-pointer hover:bg-[#F1F1F1]"
              >
                <Icon name="IconTbPhoto" width={24} height={24} />
              </button>
            </div>
          </div>
        ) : null}
        <div className={`w-full h-screen pt-[48px] relative`}>
          {currentStep === 3 ? (
            <div
              className={`border border-[#CBCBCB] rounded-sm absolute left-2 top-[58px] ${currentStep === 3 ? 'z-99' : 'z-90'} px-2 py-2 bg-[#ffffff]`}
            >
              <div className="flex items-center gap-1">
                <button
                  className={`w-[2.4rem] h-[2.4rem] flex justify-center items-center border border-[#CBCBCB] bg-[#F5F5F5] rounded-md`}
                >
                  <Icon name="IconGoChevronPrev" width={20} height={20} />
                </button>
                <SelectBox width={40} placeholder={`시안 1 도면`}></SelectBox>

                <button
                  className={`w-[2.4rem] h-[2.4rem] flex justify-center items-center border border-[#CBCBCB] bg-[#F5F5F5] rounded-md`}
                >
                  <Icon name="IconGoChevronNext" width={20} height={20} />
                </button>
              </div>
              <Slider defaultValue={[0.5]} max={1} step={0.01} />
            </div>
          ) : null}
          <div className="relative w-full h-full">
            {currentStep >= 0 || currentStep === 5 ? (
              <div
                style={{
                  position: 'absolute',
                  left: `${position.x + pins[1].pin_x * scale}px`,
                  top: `${position.y + pins[1].pin_y * scale}px`,
                  zIndex: `${currentStep === 0 || currentStep === 5 ? 99 : 1}`,
                  pointerEvents: 'auto',
                  visibility: pins[1].is_visible ? 'visible' : 'hidden',
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  transformOrigin: 'center center',
                  animation:
                    pins[1].isHighlighted === true
                      ? 'pulse 1s infinite'
                      : 'none',
                }}
              >
                <div
                  className={`relative ${
                    pins[1].isHighlighted
                      ? 'scale-125 transition-transform duration-200'
                      : 'transition-transform duration-200'
                  }`}
                >
                  <div
                    className="w-8 h-8 flex items-center justify-center"
                    onClick={() => {}}
                    style={{
                      position: 'relative',
                    }}
                  >
                    {/* 하이라이트 효과용 배경 */}
                    <div
                      className="absolute w-16 h-16 rounded-full transition-all duration-200"
                      style={{
                        background: pins[1].isHighlighted
                          ? `radial-gradient(circle, ${pins[1].pin_group?.pin_group_color || '#87B5FA'} 0%, transparent 70%)`
                          : 'radial-gradient(circle, #87B5FA 0%, transparent 70%)',
                        filter: pins[1].isHighlighted
                          ? 'blur(8px)'
                          : 'blur(10px)',
                        opacity: pins[1].isHighlighted ? 0.8 : 0.6,
                        transform: pins[1].isHighlighted
                          ? 'scale(1.2)'
                          : 'scale(1)',
                        zIndex: -1,
                        animation: pins[1].isHighlighted
                          ? 'pulse-highlight 1.5s infinite'
                          : 'none',
                      }}
                    />
                    <Icon
                      name="IconTbPin"
                      width={40}
                      height={40}
                      color={pins[1].pin_group?.pin_group_color || 'gray'}
                      className={
                        pins[1].isHighlighted ? 'animate-bounce-gentle' : ''
                      }
                    />
                  </div>
                </div>
              </div>
            ) : null}
            {currentStep >= 7
              ? pins.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      left: `${position.x + item.pin_x * scale}px`,
                      top: `${position.y + item.pin_y * scale}px`,
                      zIndex: `${currentStep === 7 ? 99 : 1}`,
                      pointerEvents: 'auto',
                      visibility: item.is_visible ? 'visible' : 'hidden',
                      transform: `translate(-50%, -50%) scale(${scale})`,
                      transformOrigin: 'center center',
                      animation:
                        item.isHighlighted === true
                          ? 'pulse 1s infinite'
                          : 'none',
                    }}
                  >
                    <div
                      className={`relative ${
                        item.isHighlighted
                          ? 'scale-125 transition-transform duration-200'
                          : 'transition-transform duration-200'
                      }`}
                    >
                      <div
                        className="w-8 h-8 flex items-center justify-center"
                        onClick={() => {}}
                        style={{
                          position: 'relative',
                        }}
                      >
                        {/* 하이라이트 효과용 배경 */}
                        {item.isHighlighted && (
                          <div
                            className="absolute w-16 h-16 rounded-full transition-all duration-200"
                            style={{
                              background: item.isHighlighted
                                ? `radial-gradient(circle, ${item.pin_group?.pin_group_color || '#87B5FA'} 0%, transparent 70%)`
                                : 'radial-gradient(circle, #87B5FA 0%, transparent 70%)',
                              filter: item.isHighlighted
                                ? 'blur(8px)'
                                : 'blur(10px)',
                              opacity: item.isHighlighted ? 0.8 : 0.6,
                              transform: item.isHighlighted
                                ? 'scale(1.2)'
                                : 'scale(1)',
                              zIndex: -1,
                              animation: item.isHighlighted
                                ? 'pulse-highlight 1.5s infinite'
                                : 'none',
                            }}
                          />
                        )}
                        <Icon
                          name="IconTbPin"
                          width={40}
                          height={40}
                          color={item.pin_group?.pin_group_color || 'gray'}
                          className={
                            item.isHighlighted ? 'animate-bounce-gentle' : ''
                          }
                        />
                      </div>
                      <Container
                        ref={draggableRef}
                        data-pin-contents="true"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        style={{
                          touchAction: 'none',
                          position: 'fixed', // absolute 대신 fixed 사용
                          left: `${item.pin_x + item.left}px`, // 핀의 x 좌표
                          top: `${item.pin_y + item.top}px`, // 핀의 y 좌표
                          transform: 'translate(-50%, -50%)', // 핀을 중심으로 컨텐츠 위치 조정
                          zIndex: 100, // 다른 요소들보다 위에 표시
                        }}
                      >
                        <Header
                          backgroundColor={item.pin_group.pin_group_color_light}
                        >
                          <TabContainer>
                            <TabIconButton
                              backgroundColor={item.pin_group.pin_group_color}
                            >
                              <Icon
                                name="IconTbNotes"
                                width={15}
                                height={15}
                                color={item.pin_group.pin_group_color_light}
                              />
                            </TabIconButton>
                            {true && (
                              <TabIconButton
                                backgroundColor={item.pin_group.pin_group_color}
                              >
                                <Icon
                                  name="IconTbPhoto"
                                  width={15}
                                  height={15}
                                  color={
                                    true
                                      ? item.pin_group.pin_group_color_light
                                      : '#666666'
                                  }
                                />
                              </TabIconButton>
                            )}
                          </TabContainer>
                          <div className="flex items-center justify-center flex-grow gap-2">
                            <div className="relative group flex items-center justify-center flex-1 gap-1">
                              <Icon
                                name="IconTbPinFill"
                                width={25}
                                height={25}
                                color={item.pin_group.pin_group_color}
                              />
                              <span
                                className={`${
                                  item.preview_image_list.length > 0
                                    ? 'max-w-[24rem]'
                                    : 'max-w-[8rem]'
                                } text-sm font-medium truncate text-center`}
                              >
                                {item.pin_name}
                              </span>
                              <div className="absolute hidden group-hover:block left-0 bottom-10 bg-black bg-opacity-75 text-white p-2 rounded-md text-sm whitespace-nowrap z-20">
                                {item.pin_name}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pr-2">
                            <button className="text-gray-500 hover:text-gray-700 transition-colors">
                              <Icon
                                name="IconLuPanelRight"
                                width={20}
                                height={20}
                              />
                            </button>
                            {true && (
                              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                                <Icon
                                  name="IconCgClose"
                                  width={20}
                                  height={20}
                                />
                              </button>
                            )}
                          </div>
                        </Header>

                        <ContentContainer
                          selectedCount={item.pin_name !== '안방' ? 1 : 2}
                        >
                          {(item.pin_name === '화장실' ? false : true) && (
                            <ContentSection>
                              <NotesContainer hasSelectedNote={false}>
                                <NoteListWrapper hasSelectedNote={false}>
                                  <div className="h-full overflow-hidden">
                                    {item.note_list.map((note, index) => {
                                      if (note.type === 'date-separator') {
                                        return (
                                          <DateSeparator key={index}>
                                            {note.date}
                                          </DateSeparator>
                                        );
                                      }

                                      return (
                                        <div
                                          key={note.note_id}
                                          className={`${note?.note_writer?.user_email ? 'items-end' : 'items-start'}`}
                                        >
                                          <div className="relative flex items-center gap-4 p-2 bg-transp">
                                            <img
                                              src={note.note_writer.profile_url}
                                              alt="프로필"
                                              className="w-8 h-8 rounded-full shrink-0"
                                            />
                                            <div className="flex flex-col justify-center flex-1">
                                              <TitleWrapper className="relative flex items-center justify-between w-full p-2 gap-2 bg-white border rounded-lg border-gray-300">
                                                <span className="text-sm font-bold truncate max-w-[10rem]">
                                                  {note.note_title}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                  <Icon
                                                    name="IconTbPhoto"
                                                    width={18}
                                                    height={18}
                                                  />
                                                </div>
                                                {true && (
                                                  <div
                                                    className="absolute top-0 right-0 w-4 h-4 clip-triangle"
                                                    style={{
                                                      backgroundColor:
                                                        '#87b5fa',
                                                    }}
                                                  ></div>
                                                )}
                                              </TitleWrapper>
                                              <div className="flex items-center text-xs text-gray-500">
                                                <span>
                                                  {
                                                    note.note_writer.user_email.split(
                                                      '@',
                                                    )[0]
                                                  }
                                                </span>
                                                <span className="mx-1">·</span>
                                                <span>{'2025-02-21'}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </NoteListWrapper>
                                {true && (
                                  <AddNoteButton>
                                    <Icon
                                      name="IconIoIosAddCircleOutline"
                                      width={28}
                                      height={28}
                                      color="#ffffff"
                                    />
                                  </AddNoteButton>
                                )}
                              </NotesContainer>
                            </ContentSection>
                          )}
                          {item.preview_image_list.length > 0 && (
                            <ContentSection>
                              <div className="p-4 h-full">
                                <div
                                  className={`w-full grid grid-cols-2 gap-2`}
                                >
                                  {item.preview_image_list
                                    .slice(0, 4)
                                    .map((image, index) => (
                                      <div
                                        key={image.image_id}
                                        className="relative aspect-square cursor-pointer hover:opacity-90"
                                      >
                                        <img
                                          src={image.image_preview}
                                          alt="reference"
                                          className="w-full h-full object-cover rounded-md"
                                        />
                                        {image.is_bookmark && (
                                          <div
                                            className="absolute top-0 right-0 w-4 h-4 clip-triangle"
                                            style={{
                                              backgroundColor: '#87b5fa',
                                            }}
                                          />
                                        )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </ContentSection>
                          )}
                        </ContentContainer>

                        {/* {false && (
                        <AddNoteWrapper>
                          <AddNote
                            setOpen={setAddOpen}
                            pinInfo={pinInfo}
                            projectId={useParams().projectId}
                            blueprintVersionId={useParams().blueprint_version_id}
                            setDetailPinImages={setDetailPinImages}
                            detailPinImages={detailPinImages}
                            setSelectedTabs={setSelectedTabs}
                          />
                        </AddNoteWrapper>
                      )} */}
                      </Container>
                    </div>
                  </div>
                ))
              : null}

            <canvas
              ref={canvasRef}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </div>
          <div
            className={`flex justify-between border w-[13.4rem] border-[#CBCBCB] absolute left-[45%] bottom-4 p-[0.2rem] bg-white rounded-md ${currentStep < 4 ? 'z-99' : ''}`}
          >
            <button
              className={`w-[2.4rem] h-[2.4rem] flex justify-center items-center cursor-pointer hover:bg-[#F1F1F1] rounded-md ${
                currentStep === 0 ? 'bg-[#B0CFFF]' : ''
              }`}
            >
              <Icon
                name="IconTbPinStroke"
                width={30}
                height={30}
                color={currentStep === 0 ? '#ffffff' : '#414141'}
              />
            </button>
            <button
              className={`w-[2.4rem] h-[2.4rem] flex justify-center items-center cursor-pointer hover:bg-[#F1F1F1] rounded-md ${
                currentStep === 1 ? 'bg-[#B0CFFF]' : ''
              }`}
            >
              <Icon
                name="IconBsCursor"
                width={25}
                height={25}
                color={currentStep === 1 ? '#ffffff' : '#414141'}
              />
            </button>
            <button
              className={`w-[2.4rem] h-[2.4rem] flex justify-center items-center cursor-pointer hover:bg-[#F1F1F1] rounded-md ${
                currentStep === 2 ? 'bg-[#B0CFFF]' : 'bg-[#ffffff]'
              }`}
            >
              <Icon
                name="IconBsLayers"
                width={25}
                height={25}
                color={currentStep === 2 ? '#ffffff' : '#414141'}
              />
            </button>
            <button
              className={`w-[2.4rem] h-[2.4rem] flex justify-center items-center cursor-pointer hover:bg-[#F1F1F1] rounded-md ${
                currentStep === 3 ? 'bg-[#B0CFFF]' : 'bg-[#ffffff]'
              }`}
            >
              {true ? (
                <Icon
                  name="IconTbEye"
                  color={currentStep === 3 ? '#ffffff' : '#414141'}
                />
              ) : (
                <Icon name="IconTbEyeClosed" />
              )}
            </button>
            <button
              className={`w-[2.4rem] h-[2.4rem] flex justify-center items-center cursor-pointer hover:bg-[#F1F1F1] rounded-md`}
            >
              <Icon name="IconTbSearch" width={25} height={25} />
            </button>
          </div>
        </div>
        {4 <= currentStep && currentStep < 8 ? (
          <>
            <div
              className={`absolute w-[22rem] top-0 right-0 ${4 < currentStep && currentStep < 7 ? 'z-99' : 'z-40'}`}
            >
              <div className="pt-[48px]" />
              <div className="mt-[60px] px-[0.3rem] grid grid-cols-1 grid-rows-1 h-[calc(100%-115px)]">
                <div
                  className={`h-full border border-[#CBCBCB] rounded-lg shadow-md bg-white`}
                >
                  <div className="text-center p-2 border-b border-[#CBCBCB] rounded-t-lg bg-[#F5F5F5]">
                    전체 핀
                  </div>
                  <div className="p-2 h-[calc(100vh-170px)]">
                    <PinTabs actions={tabActions} isViewFolder={true} />
                    <div className="py-2 flex justify-end items-center gap-2"></div>
                    <div className="relative w-full h-full">
                      <div
                        className={`absolute w-full left-0 top-0 grid grid-cols-2 gap-2 overflow-y-auto max-h-[calc(100vh-280px)] ${
                          true ? 'visible' : 'invisible'
                        }`}
                      >
                        {pins.map((pin, index) => {
                          return (
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
                                    backgroundColor:
                                      pin.pin_group?.pin_group_color,
                                    opacity: 0.15,
                                  }}
                                />
                                <div className="flex items-center gap-1 z-10">
                                  <button
                                    className={`w-7 h-7 flex items-center justify-center ${true ? 'hover:bg-white/50 cursor-pointer rounded-full' : 'cursor-default'}`}
                                  >
                                    {true ? null : pin.is_visible ? (
                                      <Icon
                                        name="IconTbPinFill"
                                        width={23}
                                        color={pin.pin_group?.pin_group_color}
                                      />
                                    ) : (
                                      <Icon
                                        name="IconBiBlock"
                                        width={20}
                                        color="#414141"
                                      />
                                    )}
                                  </button>
                                  <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                      <TooltipTrigger className="w-23 truncate font-medium">
                                        {pin.pin_name}
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{pin.pin_name}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <EditOption actions={[]} />
                              </div>

                              {!pin.preview_image_list.length ? (
                                <div className="grid grid-cols-1 grid-rows-1 gap-rows-1 place-items-center p-2">
                                  <div className="w-full h-[8rem] flex items-center justify-center text-gray-400 bg-gray-100 rounded-md">
                                    No image
                                  </div>
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 grid-row-2 gap-1 place-items-center p-2">
                                  {pin.preview_image_list.map((item, idx) => {
                                    return (
                                      <div
                                        key={item.image_id}
                                        className="relative"
                                        onClick={() =>
                                          onClickPinImage(
                                            pin.preview_image_list,
                                          )
                                        }
                                      >
                                        <img
                                          src={item.image_preview}
                                          alt="reference"
                                          className="w-[4rem] h-[4rem] object-cover rounded-md shadow-2xs"
                                        />
                                        {item.image_id && item.is_bookmark && (
                                          <div className="absolute top-0 right-0 w-4 h-4 bg-[#87B5FA] clip-triangle"></div>
                                        )}
                                        {idx === 3 &&
                                          pin.preview_image_list.length > 4 && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm font-semibold rounded-md">
                                              +
                                              {pin.preview_image_list.length -
                                                4}
                                            </div>
                                          )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`absolute top-0 right-0 transition-all duration-300 ease-in-out transform ${
                true ? 'translate-x-0 w-[22rem]' : 'translate-x-full w-0'
              } h-screen border-l border-[#CBCBCB] z-4 bg-white flex flex-col overflow-hidden`}
            ></div>
          </>
        ) : null}
        {currentStep >= 8 ? (
          <div
            className={`absolute bottom-0 right-0 w-[22rem] h-[850px] bg-white ${currentStep >= 8 ? 'z-99' : ''}`}
          >
            <div className="px-[0.3rem] grid grid-cols-1 grid-rows[2fr_1fr_2fr] gap-2 overflow-hidden p-1">
              <div className="flex justify-between items-center rounded-md">
                <div className="flex items-center">
                  <button className="w-[2.4rem] h-[2.4rem] flex justify-center items-center rounded-sm cursor-pointer hover:bg-[#F1F1F1]">
                    <Icon name="IconGoChevronPrev" width={24} />
                  </button>
                  <Icon
                    name="IconTbPinFill"
                    width={24}
                    height={24}
                    color={pins[0]?.pin_group?.pin_group_color || 'gray'}
                  />
                  <p className="truncate break-words pl-2">
                    {pins[0].pin_name}
                  </p>
                </div>
              </div>
              <div className="w-full border border-[#CBCBCB] rounded-lg shadow-md bg-white">
                <h2
                  className="text-center p-2 border-b border-[#CBCBCB] rounded-t-lg bg-[#F5F5F5]"
                  style={{
                    backgroundColor: pins[0]?.pin_group.pin_group_color_light,
                  }}
                >
                  중요한 노트
                </h2>
                <div className="h-40 overflow-hidden">
                  <div className="text-sm text-center text-gray-500 p-4">
                    중요한 노트가 없습니다.
                  </div>
                </div>
              </div>
              <PinNoteContainer>
                <>
                  <PinNoteHeader
                    style={{
                      backgroundColor: pins[0]?.pin_group.pin_group_color_light,
                    }}
                  >
                    <div className="flex items-center justify-center flex-grow gap-2 py-[6px]">
                      <div>노트</div>
                    </div>
                    <button className="pr-2">
                      <Icon name="IconTbSearch" width={20} height={20} />
                    </button>
                  </PinNoteHeader>
                  <PinNotesContainer>
                    {pins[0].note_list.length === 0 ? (
                      <NoData>등록된 노트가 없습니다.</NoData>
                    ) : (
                      pins[0].note_list.map((note, index) =>
                        note.type === 'date-separator' ? (
                          <PinNoteDateSeparator key={index}>
                            {note.date}
                          </PinNoteDateSeparator>
                        ) : (
                          <div
                            key={note.note_id}
                            className={`p-2 ${true ? 'items-end' : 'items-start'}`}
                          >
                            <NoteButton note={note} onClick={() => {}} />
                          </div>
                        ),
                      )
                    )}
                  </PinNotesContainer>
                </>
              </PinNoteContainer>
              <div className="relative border border-[#CBCBCB] rounded-lg shadow-md bg-white h-[250px]">
                <div
                  className="sticky text-center p-2 border-b border-[#CBCBCB] top-0 w-full rounded-t-lg bg-[#F5F5F5]"
                  style={{
                    backgroundColor: pins[0]?.pin_group.pin_group_color_light,
                  }}
                >
                  레퍼런스
                </div>
                <div className="h-50 overflow-y-auto p-2">
                  {/* todo */}
                  {pins[0].note_list.slice(1).map((pin) => {
                    const images = pin.preview_image_list.slice(0, 3);
                    console.log('shhshsh', pin); // 최대 3개 표시
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
                              onClick={() => {}}
                            >
                              <img
                                src={item.image_preview}
                                alt="reference"
                                className="w-full h-full object-cover rounded-md"
                              />
                              {item.is_bookmark && (
                                <div
                                  className="absolute top-0 right-0 w-4 h-4 clip-triangle"
                                  style={{ backgroundColor: '#87b5fa' }}
                                ></div>
                              )}
                              {idx === 2 &&
                                pin.preview_image_list.length > 3 && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm font-semibold rounded-md">
                                    +{pin.preview_image_list.length - 3}
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
            </div>
          </div>
        ) : null}
        {currentStep >= 8 ? (
          <div
            className={`absolute top-0 right-0 transition-all duration-50 ease-in-out transform ${true ? 'translate-x-0 w-[22rem]' : 'translate-x-full w-0'} h-screen border-l border-[#CBCBCB] z-[4] bg-white flex flex-col overflow-hidden`}
          ></div>
        ) : null}
      </div>
      {currentStep === 2 && (
        <div className="h-[40rem] w-[60rem] bg-white absolute rounded-sm border border-[#CBCBCB] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-99">
          <div className="flex justify-between pt-3 px-3 pb-3 mb-4 border-b border-[#CBCBCB]">
            <div className="flex">
              <h2 className="text-left">
                {blueprints[blueprints.length - 1].blueprint_version_name}
              </h2>
            </div>
            <button>
              <Icon name="IconCgClose" width={24} height={24} />
            </button>
          </div>

          <div className="h-[calc(100%-75px)] overflow-y-auto px-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex relative border border-[#CBCBCB] rounded-sm cursor-pointer hover:bg-[#F5F5F5]">
                <div className="aspect-[4/3]">
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Icon
                      color="#7BA8EC"
                      name="IconIoIosAddCircleOutline"
                      width={50}
                      height={50}
                    />
                  </div>
                </div>
                <div className="absolute bottom-18 left-20 text-[#414141] text-sm">
                  새 블루프린트 업로드
                </div>
              </div>

              {blueprints.map((version) => (
                <div
                  key={version.blueprint_version_id}
                  className="p-2 border border-[#CBCBCB] rounded-sm cursor-pointer hover:bg-[#F5F5F5]"
                >
                  <div className="flex flex-col">
                    <img
                      src={version.preview_image}
                      alt={version.blueprint_version_name}
                      className="mb-2 aspect-[4/3] rounded-sm"
                      onLoad={() => setImageLoaded(true)}
                    />
                    <div className="flex justify-between items-center">
                      <div className="w-[200px] truncate">
                        {version.blueprint_version_name}
                      </div>
                      <div className="text-[#898989] text-sm">
                        {new Date(version.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </BlueprintLayout>
  );
};

export default Tutorial;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border: 0.0625rem solid #cbcbcb;
  background-color: #f5f5f5;
  height: 350px;
  width: auto;
  min-width: 320px;
  z-index: 99;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  overflow: visible;
  transition: width 0.3s ease;
  animation: scaleUp 0.2s ease-out;
  transform-origin: 0 0;

  @keyframes scaleUp {
    from {
      transform: scale(0);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 2.5px;
  height: 40px;
  border-bottom: 1px solid #cbcbcb;
  background-color: ${(props) => props.backgroundColor || '#ffffff'};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  padding-left: 8px;
`;

const NotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
  gap: 0.75rem;
  height: 100%;
  position: relative;
  ${(props) =>
    props.hasSelectedNote &&
    `
    overflow: hidden;
    padding: 0;
  `}
`;

const DateSeparator = styled.div`
  font-size: 0.875rem;
  font-weight: bold;
  color: #555;
  padding: 0.5rem 0;
  border-top: 1px solid #ddd;
`;

const NoteListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  ${(props) =>
    props.hasSelectedNote &&
    `
    overflow: hidden;
    height: 100%;
  `}
`;

const AddNoteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px;
  width: 40px;
  height: 40px;
  background-color: #87b5fa;
  border: 1px solid #cbcbcb;
  border-radius: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
  position: absolute;
  bottom: 5px;
  left: 5px;

  &:hover {
    background-color: #f0f0f0;
  }

  span {
    font-size: 14px;
    color: #414141;
  }
`;

const AddNoteWrapper = styled.div`
  position: absolute;
  top: 0;
  left: -310px;
  width: 300px;
  height: 350px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #cbcbcb;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  z-index: 999;
`;

const ContentContainer = styled.div`
  display: flex;
  width: ${(props) => (props.selectedCount > 1 ? '640px' : '320px')};
  transition: width 0.3s ease;
  height: 100%;
  overflow: hidden;
`;

const ContentSection = styled.div`
  flex: 0 0 320px;
  width: 320px;
  border-right: 1px solid #cbcbcb;
  overflow-y: auto;
  height: 100%;

  &:last-child {
    border-right: none;
  }
`;

const TabIconButton = styled.button`
  padding: 8px;
  border-radius: 4px;
  background-color: ${(props) =>
    props.active ? props.backgroundColor : 'transparent'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f0f0f0;
  }
`;
const TitleWrapper = styled.button`
  position: relative;
  border-radius: 0.5rem;
  padding: 0.5rem;
  border: 0.0625rem solid #ccc;
  background-color: white;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;

  &:hover {
    background-color: #cbcbcb; 
`;

const PinNoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 0.0625rem solid #cbcbcb;
  background-color: #ffffff;
  height: 20.5rem;
  width: 100%;
  z-index: 20;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  position: relative;
`;

const PinNoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2.5px;
  border-bottom: 1px solid #cbcbcb;
  background-color: #f5f5f5;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const PinNotesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.75rem;
  max-height: calc(100% - 3rem);
  box-sizing: border-box;
`;

const PinNoteDateSeparator = styled.div`
  font-size: 0.875rem;
  font-weight: bold;
  color: #555;
  padding: 0.5rem 0;
  border-top: 1px solid #ddd;
`;

const NoData = styled.div`
  font-size: 0.875rem;
  color: oklch(0.551 0.027 264.364);
  text-align: center;
`;
