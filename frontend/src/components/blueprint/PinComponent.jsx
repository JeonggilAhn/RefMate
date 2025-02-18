import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import ButtonList from './ButtonList';
import { get } from '../../api';
import Icon from '../common/Icon';
import PinContents from './PinContents';
import { useRecoilState } from 'recoil';
import { pinState } from '../../recoil/blueprint';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';

const PinComponent = ({
  blueprintId,
  blueprintVersionId,
  projectId,
  pin,
  onClickPin,
  isHighlighted,
  scale = 1,
}) => {
  const [pins, setPins] = useRecoilState(pinState);

  const [pinInfo, setPinInfo] = useState(pin);
  const [hoveredPin, setHoveredPin] = useState(null);
  const [recentNotes, setRecentNotes] = useState(null);
  // const [unreadNotes, setUnreadNotes] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const pinRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

  // isClicked 제거하고 컨텐츠가 열려있는지 확인
  const isContentsOpen = pin.is_open_note || pin.is_open_image;

  // 핀 활성화 여부 (노트/이미지 창 열림 시)
  const isActive = isContentsOpen;

  const handleNoteClick = async () => {
    const pinNotRes = await get(`pins/${pin.pin_id}/notes`, {
      project_id: projectId,
    });

    if (pinNotRes.status === 200) {
      setPins((prev) => {
        return prev.map((item) => {
          if (item.pin_id === pin.pin_id) {
            return {
              ...item,
              is_open_note: !item.is_open_note,
              pinDetailNotes: pinNotRes.data.content.note_list,
            };
          }

          return item;
        });
      });
    }
  };

  const handleImgClick = async () => {
    const pinImgRes = await get(`pins/${pin.pin_id}/images`);

    if (pinImgRes.status === 200) {
      setPins((prev) => {
        return prev.map((item) => {
          if (item.pin_id === pin.pin_id) {
            return {
              ...item,
              is_open_image: !item.is_open_image,
              pinDetailImages: pinImgRes.data.content,
            };
          }

          return item;
        });
      });
    }
  };

  const handleInfoClick = () => {
    onClickPin(pinInfo);
  };

  // SSE를 통한 실시간 읽음 상태 업데이트
  /*useEffect(() => {
    if (!API_BASE_URL || !blueprintId) return; // 백엔드 미연결 방지

    const accessToken = sessionStorage.getItem('access_token');

    const EventSource = EventSourcePolyfill || NativeEventSource;

    const eventSource = new EventSource(
      `${API_BASE_URL}/api/blueprints/${blueprintId}/task/read`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('data', data);
        if (data.pin_id === pinInfo.pin_id) {
          setUnreadNotes(false);
        }
      } catch (error) {
        console.error('SSE 데이터 파싱 오류:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE 연결 오류:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close(); // 언마운트 시 SSE 연결 종료
    };
  }, [API_BASE_URL, blueprintId, pinInfo.pin_id]);*/

  // 최근 노트 데이터를 가져오기
  const fetchRecentNote = useCallback(async () => {
    try {
      const response = await get(`pins/${pinInfo.pin_id}/notes/recent`);
      const note = response.data?.content.note;
      console.log('note', note);

      if (note) {
        setRecentNotes({
          title: note.note_title,
          content: note.note_content,
        });
      } else {
        setRecentNotes(null);
      }
    } catch (error) {
      console.error(`핀 ${pinInfo.pin_id}의 최근 노트 조회 실패:`, error);
    }
  }, [pinInfo]);

  // 호버 상태 관리를 위한 타이머 ref
  const hoverTimeoutRef = useRef(null);

  const handleMouseLeave = () => {
    if (!isHoveringButton) {
      setHoveredPin(null);
    }
  };

  const handleButtonMouseEnter = () => {
    setIsHoveringButton(true);
  };

  const handleButtonMouseLeave = () => {
    setIsHoveringButton(false);
    // 버튼에서 마우스가 벗어난 후 팝업 영역을 벗어났는지 확인
    if (!hoveredPin) {
      setHoveredPin(null);
    }
  };

  useEffect(() => {
    if (!pin) return;

    setPinInfo(pin);
    fetchRecentNote();
  }, [pin, fetchRecentNote]);

  const handlePinClick = () => {
    setPins((prev) => {
      return prev.map((item) => {
        if (item.pin_id === pin.pin_id) {
          return {
            ...item,
            is_open_note: !item.is_open_note,
          };
        }
        return item;
      });
    });
  };

  if (!pin) return null;

  return (
    <div
      className={`relative ${
        isHighlighted
          ? 'scale-125 transition-transform duration-200'
          : 'transition-transform duration-200'
      }`}
    >
      {/* 핀 아이콘 (활성화 상태일 때 테두리 추가) */}
      <div
        ref={pinRef}
        className="absolute w-8 h-8 flex items-center justify-center"
        onMouseEnter={() => !isContentsOpen && setHoveredPin(pinInfo)}
        onMouseLeave={handleMouseLeave}
        onClick={handlePinClick}
        style={{
          position: 'relative',
        }}
      >
        {/* 하이라이트 효과용 배경 */}
        {(isActive || isHighlighted) && (
          <div
            className="absolute w-16 h-16 rounded-full transition-all duration-200"
            style={{
              background: isHighlighted
                ? `radial-gradient(circle, ${pinInfo.pin_group?.pin_group_color || '#87B5FA'} 0%, transparent 70%)`
                : `radial-gradient(circle, ${pinInfo.pin_group?.pin_group_color || '#87B5FA'} 0%, transparent 70%)`,
              filter: isHighlighted ? 'blur(8px)' : 'blur(10px)',
              opacity: isHighlighted ? 0.8 : 0.6,
              transform: isHighlighted ? 'scale(1.2)' : 'scale(1)',
              zIndex: -1,
              animation: isHighlighted
                ? 'pulse-highlight 1.5s infinite'
                : 'none',
            }}
          />
        )}

        {/* 아이콘 */}
        <Icon
          name="IconTbPin"
          width={40}
          height={40}
          color={pinInfo.pin_group?.pin_group_color || 'gray'}
          className={isHighlighted ? 'animate-bounce-gentle' : ''}
        />

        {/* 읽지 않은 경우 빨간 점 표시 */}
        {/*unreadNotes && (
          <div className="absolute top-[-4px] right-[-4px] w-2 h-2 bg-red-500 rounded-full" />
        )*/}
      </div>

      {/* 호버 시 최신 노트와 사이드바 버튼 표시 */}
      {!isContentsOpen && hoveredPin && (
        <div className="relative">
          <Popup
            onMouseEnter={() => setHoveredPin(pinInfo)}
            onMouseLeave={handleMouseLeave}
          >
            {/* 사이드바 버튼을 Popup 내부로 이동 */}
            <div
              className="absolute right-2 top-2 p-1 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onClickPin(pinInfo);
              }}
              onMouseEnter={handleButtonMouseEnter}
              onMouseLeave={handleButtonMouseLeave}
            >
              <Icon name="IconGoInfo" width={16} height={16} color="white" />
            </div>
            <PopupTitle>{recentNotes?.title || '제목 없음'}</PopupTitle>
            <PopupDivider />
            <PopupContent>{recentNotes?.content || '내용 없음'}</PopupContent>
          </Popup>
        </div>
      )}

      {/* 클릭 시 PinContents 직접 표시 */}
      <div className="absolute top-10 left-5">
        {isContentsOpen && (
          <PinContents
            pinInfo={pinInfo}
            pinId={pinInfo.pin_id}
            activeTab={pin.is_open_image ? 'image' : 'note'}
            scale={scale}
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
  );
};

export default PinComponent;

/* 스타일 유지 */
const Popup = styled.div`
  position: absolute;
  margin-left: 2rem;
  width: 12rem;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 0.75rem;
  padding-top: 2rem; /* 버튼을 위한 상단 여백 추가 */
  border-radius: 0.5rem;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const PopupTitle = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
`;

const PopupDivider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.3rem;
`;

const PopupContent = styled.div`
  font-size: 0.8rem;
`;
