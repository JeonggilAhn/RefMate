import { useCallback, useEffect, useState, useRef } from 'react';
import { get, patch } from '../api/index';
import { useRecoilState } from 'recoil';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import BlueprintLayout from '../layouts/BlueprintLayout';
import BlueprintCanvas from '../components/blueprint/BlueprintCanvas';
import ImportantNoteSection from '../components/blueprint/ImportantNoteSection';
import NoteHistory from '../components/blueprint/NoteHistory';
import { SelectItem } from '@/components/ui/select';
import BlueprintVersions from '../components/blueprint/BlueprintVersions';

import Icon from '../components/common/Icon';

import SelectBox from '../components/common/SelectBox';
import { pinState, noteState } from '../recoil/blueprint';
import PinTabs from '../components/blueprint/PinTabs';
import { modalState } from '../recoil/common/modal';
import ImageCarouselPopup from '../components/blueprint/ImageCarouselPopup';
import ColorInitializer from '../components/common/ColorInitializer';
import { colorState } from '../recoil/common/color';
import { useParams } from 'react-router-dom';
import AllPinFolder from '../components/blueprint/AllPinFolder';
import AllPinList from '../components/blueprint/AllPinList';
import { useToast } from '@/hooks/use-toast';
import PinImageSection from '../components/blueprint/PinImageSection';
import EditOption from '../components/project/EditOption';
import UpdateProjectName from '../components/project/UpdateProjectName';
import PinPopup from '../components/blueprint/PinPopup';
import PinNoteSection from '../components/blueprint/PinNoteSection';
import Toolbar from '../components/blueprint/Toolbar';
import ToolbarSide from '../components/blueprint/ToolbarSide';
import ToolbarOpacity from '../components/blueprint/ToolbarOpacity';
import { websocketState } from '../recoil/common/websocket';

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const Blueprint = () => {
  const { blueprint_id, blueprint_version_id, projectId } = useParams();

  // common
  const [colors, setColors] = useRecoilState(colorState);
  const [pinColors, setPinColors] = useState([]);
  const { toast } = useToast(20);

  // pins
  const [pins, setPins] = useRecoilState(pinState);
  const [donePins, setDonePins] = useState([]);
  const [isViewFolder, setIsViewFolder] = useState(true);
  const [isActiveTab, setIsActiveTab] = useState(true);

  // notes
  const [notes, setNotes] = useRecoilState(noteState);
  const [detailNote, setDetailNote] = useState(null);

  // cursor ID (페이지네이션을 위한 마지막 note_id)
  const cursorIdRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  // current blueprint
  const [blueprint, setBlueprint] = useState({});
  const [blueprintTitle, setBlueprintTitle] = useState('');

  // overlay blueprint
  const [overlayBlueprint, setOverlayBlueprint] = useState({});

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDetailSidebarOpen, setIsDetailSidebarOpen] = useState(false);

  // sidebar tool bar
  const [isPinButtonEnaled, setIsPinButtonEnaled] = useState(false);

  // version tool bar
  const [blueprints, setBlueprints] = useState([]);
  const [selectedBlueprintIndex, setSelectedBlueprintIndex] = useState(0);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [isNoteHistoryOpen, setIsNoteHistoryOpen] = useState(false); // 노트 히스토리 팝업 관리리

  // sidebar detail
  const [detailPin, setDetailPin] = useState({
    pinDetailNotes: [],
    pinDetailImages: [],
  });
  const [selectedColor, setSelectedColor] = useState(null);

  const [modal, setModal] = useRecoilState(modalState);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [detailPopupImages, setDetailPopupImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ws state를 recoil state로 변경
  const [ws, setWs] = useRecoilState(websocketState);

  // 하이라이트할 핀 ID를 저장하는 state 추가
  const [highlightedPinId, setHighlightedPinId] = useState(null);

  // 노트 표시 상태를 저장하는 state 추가
  const [isNotesVisible, setIsNotesVisible] = useState(true);
  // 노트 표시 이전 상태를 저장하는 state 추가
  const [prevNotesState, setPrevNotesState] = useState({});

  const pinGroupColorLight = detailPin?.pin_group?.pin_group_color_light;

  const filterNoImageList = (data) => {
    return data.filter((item) => {
      return item.image_list.length !== 0;
    });
  };

  const onClickPinHighlightIcon = (pin_id) => {
    setHighlightedPinId(pin_id);
  };

  // 화면 클릭 시 강조 해제
  useEffect(() => {
    if (!highlightedPinId) return;

    const handleClickOutside = (event) => {
      if (!event.target.closest('.tooltip-trigger')) {
        setHighlightedPinId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [highlightedPinId]);

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

  const openNoteHistory = () => {
    if (!isNoteHistoryOpen) {
      fetchNoteHistory(); // 한 번만 호출
    }
    setIsNoteHistoryOpen(true);
  };

  // 블루프린트별 노트 데이터 가져오기
  const fetchNoteHistory = useCallback(async () => {
    if (isFetching) return; // 중복 요청 방지
    setIsFetching(true);

    try {
      const apiUrl = `blueprints/${blueprint_id}/${blueprint_version_id}/notes`;
      const params = {
        project_id: projectId,
        cursor_id: cursorIdRef.current,
        size: 5,
      };
      const response = await get(apiUrl, params);

      console.log('API :', response.data.content.note_list); // 받아온 notes 데이터 확인

      if (response.status === 200 && response.data?.content?.note_list) {
        setNotes((prevNotes) => {
          const updatedNotes = [
            ...prevNotes,
            ...response.data.content.note_list,
          ];
          console.log('Fetched Notes:', updatedNotes); // 받아온 notes 데이터 확인
          return updatedNotes;
        });

        // 새로운 커서 ID 설정 (다음 요청을 위해)
        if (response.data.content.note_list.length > 0) {
          cursorIdRef.current = response.data.content.note_list.at(-1).note_id;
        }
      }
    } catch (error) {
      console.error('전체 노트 히스토리 로딩 실패:', error);
    } finally {
      setIsFetching(false);
    }
  }, [blueprint_id, blueprint_version_id, projectId, setNotes, isFetching]);

  // 컴포넌트 마운트 시 첫 노트 데이터 가져오기
  useEffect(() => {
    fetchNoteHistory();
  }, [blueprint_id, blueprint_version_id]);

  const toggleOverlayVisible = () => {
    setIsOverlayVisible((prev) => {
      if (prev === false) {
        setOverlayOpacity(0.5);
      } else {
        setOverlayOpacity(0);
      }

      return !prev;
    });

    setOverlayBlueprint((prev) => {
      return { ...prev };
    });
  };

  const closeAllNotePopup = () => {
    setPins((prev) => {
      // 현재 상태 저장
      const newPrevState = {};
      prev.forEach((pin) => {
        if (pin.is_open_note) {
          newPrevState[pin.pin_id] = true;
        }
      });

      if (isNotesVisible) {
        // 노트가 보이는 상태면 닫고 상태 저장
        setPrevNotesState(newPrevState);
        setIsNotesVisible(false);
        return prev.map((pin) => ({
          ...pin,
          is_open_note: false,
        }));
      } else {
        // 노트가 닫힌 상태면 이전 상태로 복원
        setIsNotesVisible(true);
        return prev.map((pin) => ({
          ...pin,
          is_open_note: prevNotesState[pin.pin_id] || false,
        }));
      }
    });
  };

  const closeAllImagePopup = () => {
    setPins((prev) => {
      return prev.map((pin) => {
        return { ...pin, is_open_image: false };
      });
    });
  };

  const openBlueprintVersion = () => setIsVersionOpen(true);
  const closeBlueprintVersion = () => setIsVersionOpen(false);

  const onClickPin = async (pin) => {
    // 01 핀 상세 이미지 조회 (here)
    // 02 핀 상세 중요 노트 조회 (컴포넌트 내부에서 조회해도될 것 같음)
    // 03 핀 상세 모든 노트 조회 (here)

    const pinImgRes = await get(`pins/${pin.pin_id}/images`);
    const pinNotRes = await get(`pins/${pin.pin_id}/notes`, {
      project_id: projectId,
    });

    if (pinImgRes.status === 200) {
      setPins((prev) => {
        return prev.map((item) => {
          if (item.pin_id === pin.pin_id) {
            const newItem = {
              ...item,
              pinDetailImages: filterNoImageList(pinImgRes.data.content),
            };
            setDetailPin(newItem);
            return newItem;
          }

          return item;
        });
      });
    }

    if (pinNotRes.status === 200) {
      setPins((prev) => {
        return prev.map((item) => {
          if (item.pin_id === pin.pin_id) {
            const newItem = {
              ...item,
              pinDetailNotes: pinNotRes.data.content.note_list,
            };
            setDetailPin(newItem);
            return newItem;
          }

          return item;
        });
      });
    }

    setIsDetailSidebarOpen(true);
  };

  const onClickSidebarBackButton = () => {
    setIsDetailSidebarOpen(false);
  };

  const init = async () => {
    const [bpRes, psRes, dpsRes, bpsRes] = await Promise.all([
      get(`blueprints/${blueprint_id}/${blueprint_version_id}`),
      get(`blueprints/${blueprint_id}/${blueprint_version_id}/pins`, {
        is_active: true,
        pin_group_id: null,
      }),
      get(`blueprints/${blueprint_id}/${blueprint_version_id}/pins`, {
        is_active: false,
        pin_group_id: null,
      }),
      get(`blueprints/${blueprint_id}`),
    ]);

    // blueprints 상태 업데이트가 느려서 만든 임시 배열
    let tmpBlueprints = [];

    // (진행중인) 모든 핀 데이터
    if (psRes.status === 200) {
      const data = await Promise.all(
        psRes.data.content.map(async (pin) => {
          const [pinNotRes, pinImgRes] = await Promise.all([
            get(`pins/${pin.pin_id}/notes`, {
              project_id: projectId,
            }),
            get(`pins/${pin.pin_id}/images`),
          ]);

          return {
            ...pin,
            is_visible: true,
            is_open_note: false,
            is_open_image: false,
            pinDetailNotes:
              pinNotRes.status === 200 ? pinNotRes.data.content.note_list : [],
            pinDetailImages:
              pinImgRes.status === 200
                ? filterNoImageList(pinImgRes.data.content)
                : [],
          };
        }),
      );
      setPins(data);
    }

    // (완료된된) 모든 핀 데이터터 조회
    if (dpsRes.status === 200) {
      setDonePins(
        dpsRes.data.content.map((pin) => ({
          ...pin,
          is_visible: true,
          is_open_note: false,
          is_open_image: false,
        })),
      );
    }

    // 모든 블루프린트 버전 리스트 조회
    if (bpsRes.status === 200) {
      const newContent = bpsRes.data.content.map((item, index) => {
        return { ...item, index };
      });

      tmpBlueprints = newContent;
      setBlueprints(newContent);
    }

    // 개별 블루프린트 조회
    // 첫 조회 블루프린트가 곧 첫 오버레이 블루프린트
    if (bpRes.status === 200) {
      setBlueprint(bpRes.data.content);
      setBlueprintTitle(bpRes.data.content.blueprint_version_title);
      setOverlayBlueprint(bpRes.data.content);

      const index = tmpBlueprints.findIndex(
        (item) =>
          item.blueprint_version_id === bpRes.data.content.blueprint_version_id,
      );

      setSelectedBlueprintIndex(index || 0);
    }
  };

  useEffect(() => {
    init();
  }, [blueprint_id, blueprint_version_id]);

  const onClickEditPinComplete = (editedPin) => {
    setModal(null);
    setPins((prev) => {
      return prev.map((pin) => {
        if (pin.pin_id === editedPin.pin_id) {
          return { ...pin, ...editedPin };
        }

        return { ...pin };
      });
    });
  };

  useEffect(() => {
    const def = {
      color: 'white',
      id: 0,
      name: '전체',
    };

    const data = [def, ...colors];

    setSelectedColor(def);
    setPinColors(data);
  }, [colors]);

  const tabActions = [
    {
      name: '진행중',
      handler: async () => {
        const psRes = await get(
          `blueprints/${blueprint_id}/${blueprint_version_id}/pins`,
          {
            is_active: true,
            pin_group_id:
              selectedColor.id && selectedColor.id !== 0
                ? selectedColor.id
                : null,
          },
        );

        // (진행중인) 모든 핀 데이터터 조회
        if (psRes.status === 200) {
          const data = psRes.data.content.map((item) => {
            return {
              is_visible: true,
              is_open_note: false,
              is_open_image: false,
              ...item,
            };
          });
          setPins(data);
        }
        setIsActiveTab(true);
      },
    },
    {
      name: '완료',
      handler: async () => {
        const dpsRes = await get(
          `blueprints/${blueprint_id}/${blueprint_version_id}/pins`,
          {
            is_active: false,
            pin_group_id:
              selectedColor.id && selectedColor.id !== 0
                ? selectedColor.id
                : null,
          },
        );

        // (완료된된) 모든 핀 데이터터 조회
        if (dpsRes.status === 200) {
          const data = dpsRes.data.content.map((item) => {
            return {
              is_visible: true,
              is_open_note: false,
              is_open_image: false,
              ...item,
            };
          });
          setDonePins(data);
        }
        setIsActiveTab(false);
      },
    },
  ];

  const pinActiveActions = (pin) => {
    const pinId = pin.pin_id;
    return [
      {
        name: '수정',
        handler: () => {
          setModal({
            type: 'modal',
            title: '핀 수정',
            content: (
              <PinPopup
                isCreate={false}
                blueprintId={blueprint_id}
                blueprintVersion={blueprint_version_id}
                initialPin={pin}
                onConfirm={onClickEditPinComplete}
              />
            ),
          });
        },
      },
      {
        name: '완료',
        handler: () => {
          // 완료 요청
          patch(`pins/${pinId}/${blueprint_version_id}/status`).then((res) => {
            const {
              status,
              data: { content },
            } = res;

            if (status === 200) {
              setPins((prev) => {
                return prev.filter((item) => {
                  if (item.pin_id === pinId) {
                    return false;
                  }

                  return true;
                });
              });

              ws.send(
                `/api/blueprints/${blueprint_id}/${blueprint_version_id}/pins`,
                {},
                pinId,
              );

              toast({
                title: '해당 핀의 상태가 완료로 변경되었습니다.',
                description: String(new Date()),
              });
            }
          });
        },
      },
    ];
  };

  const pinInactiveActions = (pin) => {
    const pinId = pin.pin_id;
    return [
      {
        name: '수정',
        handler: () => {
          setModal({
            type: 'modal',
            title: '핀 수정',
            content: (
              <PinPopup
                isCreate={false}
                blueprintId={blueprint_id}
                blueprintVersion={blueprint_version_id}
                initialPin={pin}
                onConfirm={onClickEditPinComplete}
              />
            ),
          });
        },
      },
      {
        name: '미완료',
        handler: () => {
          // 미완료 요청
          patch(`pins/${pinId}/${blueprint_version_id}/status`).then((res) => {
            const {
              status,
              data: { content },
            } = res;

            if (status === 200) {
              setDonePins((prev) => {
                return prev.filter((item) => {
                  if (item.pin_id === pinId) {
                    return false;
                  }

                  return true;
                });
              });

              toast({
                title: '해당 핀의 상태가 진행중으로 변경되었습니다.',
                description: String(new Date()),
              });
            }
          });
        },
      },
    ];
  };

  const onClickViewOptionButton = () => {
    setIsViewFolder((prev) => !prev);
  };

  const onChangeSlider = (value) => {
    setOverlayOpacity(value[0]);
  };

  const onClickPrevBlueprintButton = () => {
    setSelectedBlueprintIndex((prev) => {
      if (prev > 0) {
        const blueprint = blueprints.find((item, idx) => idx === prev - 1);

        if (!blueprint) {
          console.log('index와 일치하는 도면이 없습니다');
        }

        get(
          `blueprints/${blueprint_id}/${blueprint.blueprint_version_id}`,
        ).then((res) => {
          const {
            status,
            data: { content },
          } = res;

          if (status === 200) {
            setOverlayBlueprint({ ...content });
          }
        });

        return prev - 1;
      }

      return prev;
    });
  };

  const onClickNextBlueprintButton = () => {
    setSelectedBlueprintIndex((prev) => {
      if (prev < blueprints.length - 1) {
        const blueprint = blueprints.find((item, idx) => idx === prev + 1);

        if (!blueprint) {
          console.log('index와 일치하는 도면이 없습니다');
        }

        get(
          `blueprints/${blueprint_id}/${blueprint.blueprint_version_id}`,
        ).then((res) => {
          const {
            status,
            data: { content },
          } = res;

          if (status === 200) {
            setOverlayBlueprint({ ...content });
          }
        });

        return prev + 1;
      }

      return prev;
    });
  };

  const onSelectBlueprintVersion = (index) => {
    // 개별 블루프린트 조회
    setSelectedBlueprintIndex(index);

    const blueprint = blueprints.find((item, idx) => idx === index);

    if (!blueprint) {
      console.log('index와 일치하는 도면이 없습니다');
    }

    get(`blueprints/${blueprint_id}/${blueprint.blueprint_version_id}`).then(
      (res) => {
        const {
          status,
          data: { content },
        } = res;

        if (status === 200) {
          setOverlayBlueprint({ ...content });
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

  const onClickPinImage = (imageList) => {
    // 여긴 imageIndex 없어도 됌
    setDetailPopupImages(imageList);
    setCurrentImageIndex(0);
    setIsDetailPopupOpen(true);
  };

  const onSelectColor = async (value) => {
    setSelectedColor(value);
    const psRes = await get(
      `blueprints/${blueprint_id}/${blueprint_version_id}/pins`,
      {
        is_active: isActiveTab,
        pin_group_id: value.id === 0 ? null : value.id,
      },
    );

    // (진행중인) 모든 핀 데이터
    if (psRes.status === 200) {
      const data = psRes.data.content.map((orig) => ({
        ...JSON.parse(JSON.stringify(orig)),
        is_visible: true,
        is_open_note: false,
        is_open_image: false,
        pinDetailNotes: [],
        pinDetailImages: [],
      }));

      for (let i = 0; i < data.length; i++) {
        const item = data[i];

        // 핀 노트 요청
        const pinNotRes = await get(`pins/${item.pin_id}/notes`, {
          project_id: projectId,
        });
        if (pinNotRes.status === 200) {
          item.pinDetailNotes = [
            ...item.pinDetailNotes,
            ...pinNotRes.data.content.note_list,
          ];
        }

        // 핀 이미지 요청
        const pinImgRes = await get(`pins/${item.pin_id}/images`);
        if (pinImgRes.status === 200) {
          item.pinDetailImages = [
            ...item.pinDetailImages,
            ...filterNoImageList(pinImgRes.data.content),
          ];
        }
      }

      setPins(data);
    }
  };

  const projectActions = [
    {
      name: '수정',
      handler: () => {
        setModal({
          type: 'modal',
          title: '프로젝트 수정',
          content: (
            <UpdateProjectName
              projectId={projectId}
              projectTitle={blueprintTitle}
              setProjectName={setBlueprintTitle}
            />
          ),
        });
      },
    },
  ];

  // 웹소켓 연결 함수
  const connectWebSocket = () => {
    // 기존 연결이 있다면 닫기
    if (ws) {
      ws.close();
    }

    // 새로운 웹소켓 연결 생성
    const socket = new SockJS(`${API_BASE_URL}/api/websocket`);

    const stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
      console.log('웹소켓 연결됨');

      stompClient.subscribe(
        `/api/topic/${blueprint_id}/${blueprint_version_id}`,
        (pinItem) => {
          console.log('웹소켓 메시지 수신:', pinItem);
        },
      );
    });

    setWs(stompClient);
  };

  // 컴포넌트 마운트 시 웹소켓 연결
  useEffect(() => {
    connectWebSocket();

    // 컴포넌트 언마운트 시 웹소켓 연결 종료
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [blueprint_id]);

  return (
    <BlueprintLayout>
      <ColorInitializer blueprintId={blueprint_id} />
      <div className="relative overflow-hidden">
        <ToolbarSide
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          toggleAllPinVisible={toggleAllPinVisible}
          closeAllNotePopup={closeAllNotePopup}
          closeAllImagePopup={closeAllImagePopup}
          isNotesVisible={isNotesVisible}
        />
        {/* todo : canvas resize 기능 develop */}
        <div className={`w-full h-screen pt-[48px] relative`}>
          {isOverlayVisible ? (
            <ToolbarOpacity
              blueprints={blueprints}
              overlayOpacity={overlayOpacity}
              isOverlayVisible={isOverlayVisible}
              selectedBlueprintIndex={selectedBlueprintIndex}
              onChangeSlider={onChangeSlider}
              onClickPrevBlueprintButton={onClickPrevBlueprintButton}
              onSelectBlueprintVersion={onSelectBlueprintVersion}
              onClickNextBlueprintButton={onClickNextBlueprintButton}
            />
          ) : null}
          <BlueprintCanvas
            blueprintId={blueprint_id}
            blueprintVersionId={blueprint_version_id}
            projectId={projectId}
            imageUrl={blueprint.blueprint_image}
            overlayImageUrl={overlayBlueprint.blueprint_image}
            overlayOpacity={overlayOpacity}
            isOverlayVisible={isOverlayVisible}
            isPinButtonEnaled={isPinButtonEnaled}
            setIsPinButtonEnaled={setIsPinButtonEnaled}
            onClickPin={onClickPin}
            highlightedPinId={highlightedPinId}
          />
          <Toolbar
            isSidebarOpen={isSidebarOpen}
            isDetailSidebarOpen={isDetailSidebarOpen}
            isOverlayVisible={isOverlayVisible}
            isPinButtonEnaled={isPinButtonEnaled}
            onClickPinButton={onClickPinButton}
            onClickMouseButon={onClickMouseButon}
            toggleOverlayVisible={toggleOverlayVisible}
            openBlueprintVersion={openBlueprintVersion}
            openNoteHistory={openNoteHistory} // NoteHistory 팝업용 토글 함수
          />
        </div>
        {/* sidebar */}
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
                <PinTabs
                  actions={tabActions}
                  isViewFolder={isViewFolder}
                  onClickButton={onClickViewOptionButton}
                />
                <div className="py-2 flex justify-end items-center gap-2">
                  <SelectBox
                    width={40}
                    value={selectedColor}
                    onValueChange={onSelectColor}
                  >
                    {pinColors.map((item, index) => {
                      return (
                        <SelectItem key={item.id} value={item}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <div>{item.name}</div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectBox>
                </div>
                {!pins.length && !donePins.length ? (
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
                      className={`absolute w-full left-0 top-0 grid grid-cols-2 gap-2 overflow-y-auto max-h-[calc(100vh-280px)] ${
                        isViewFolder ? 'visible' : 'invisible'
                      }`}
                    >
                      <AllPinFolder
                        data={isActiveTab ? pins : donePins}
                        isActiveTab={isActiveTab}
                        togglePinVisible={togglePinVisible}
                        pinActiveActions={pinActiveActions}
                        pinInactiveActions={pinInactiveActions}
                        onClickPinImage={onClickPinImage}
                        onClickPinHighlightIcon={onClickPinHighlightIcon}
                      />
                    </div>
                    <div
                      className={`absolute w-full left-0 top-0 grid grid-cols-1 grid-rows-18 gap-2 overflow-y-auto max-h-[calc(100vh-280px)] ${
                        isViewFolder ? 'invisible' : 'visible'
                      }`}
                    >
                      <AllPinList
                        data={isActiveTab ? pins : donePins}
                        isActiveTab={isActiveTab}
                        togglePinVisible={togglePinVisible}
                        pinActiveActions={pinActiveActions}
                        pinInactiveActions={pinInactiveActions}
                        onClickPin={onClickPin}
                        onClickPinHighlightIcon={onClickPinHighlightIcon}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* 상세 */}
        <div
          className={`absolute top-0 right-0 transition-all duration-50 ease-in-out transform ${isDetailSidebarOpen ? 'translate-x-0 w-[22rem]' : 'translate-x-full w-0'} h-screen border-l border-[#CBCBCB] z-[4] bg-white flex flex-col overflow-hidden`}
        >
          <div className="pt-[46px]" />
          <div className="mt-[60px] px-[0.3rem] grid grid-cols-1 grid-rows[2fr_1fr_2fr] gap-2 overflow-hidden p-1">
            <div
              className="flex justify-between items-center rounded-md"
              // style={{
              //   backgroundColor: detailPin?.pin_group?.pin_group_color,
              // }}
            >
              <div className="flex items-center">
                <button className="w-[2.4rem] h-[2.4rem] flex justify-center items-center rounded-sm cursor-pointer hover:bg-[#F1F1F1]">
                  <Icon
                    name="IconGoChevronPrev"
                    width={24}
                    onClick={onClickSidebarBackButton}
                  />
                </button>
                <Icon
                  name="IconTbPinFill"
                  width={24}
                  height={24}
                  color={detailPin?.pin_group?.pin_group_color || 'gray'}
                />
                <p className="truncate break-words pl-2">
                  {detailPin.pin_name}
                </p>
              </div>
              {/* <div>
                <EditOption actions={projectActions} />
              </div> */}
            </div>
            <ImportantNoteSection
              detailPin={detailPin}
              setDetailNote={setDetailNote}
              projectId={projectId}
              pinGroupColorLight={pinGroupColorLight} // 추가
            />
            <PinNoteSection
              projectId={projectId}
              blueprintVersionId={blueprint_version_id}
              pinInfo={detailPin}
              isSidebar={true}
              pinId={detailPin.pin_id}
              detailNote={detailNote}
              setDetailNote={setDetailNote}
              isDetailSidebarOpen={isDetailSidebarOpen}
              pinGroupColorLight={pinGroupColorLight} // 추가
            />
            <PinImageSection
              pinId={detailPin.pin_id}
              onClickImage={onClickImage}
              pinGroupColorLight={pinGroupColorLight} // 추가
            />
          </div>
        </div>
      </div>
      {isNoteHistoryOpen && (
        <div className="absolute top-40 left-40 z-10">
          <NoteHistory setIsNoteHistoryOpen={setIsNoteHistoryOpen} />
        </div>
      )}

      {isVersionOpen && (
        <BlueprintVersions
          projectId={projectId}
          blueprint_id={blueprint_id}
          blueprints={blueprints}
          setBlueprints={setBlueprints}
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
