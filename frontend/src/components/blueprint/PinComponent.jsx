import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import ButtonList from './ButtonList';
import { get } from '../../api';
import Icon from '../common/Icon';
import PinNotes from './PinNotes';
import NoteImageDetail from './NoteImageDetail';
import { processNotes } from '../../utils/temp';
import { useRecoilState } from 'recoil';
import { pinState } from '../../recoil/blueprint';

const TEST_USER_ID = 6569173793051701; // 테스트용 user_id 고정

const PinComponent = ({
  blueprintId,
  blueprintVersion,
  projectId,
  pin,
  onClickPin,
}) => {
  const [pins, setPins] = useRecoilState(pinState);

  const [pinInfo, setPinInfo] = useState(pin);
  const [hoveredPin, setHoveredPin] = useState(null);
  const [recentNotes, setRecentNotes] = useState(null);
  const [unreadNotes, setUnreadNotes] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const pinRef = useRef(null);
  const [showPinNotes, setShowPinNotes] = useState(false);
  const [showImages, setShowImages] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

  // 핀 활성화 여부 (핀 클릭, 노트/이미지 창 열림 시)
  const isActive = isClicked || showPinNotes || showImages;
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
              pinDetailNotes: processNotes(pinNotRes.data.content.note_list),
            };
          }

          return item;
        });
      });
    }

    setShowPinNotes((prevState) => !prevState);
  };

  const handleImgClick = async () => {
    const pinImgRes = await get(`pins/${pin.pin_id}/images`);

    if (pinImgRes.status === 200) {
      setPins((prev) => {
        return prev.map((item) => {
          if (item.pin_id === pin.pin_id) {
            return { ...item, pinDetailImages: pinImgRes.data.content };
          }

          return item;
        });
      });
    }

    setShowImages((prevState) => !prevState);
  };

  // SSE를 통한 실시간 읽음 상태 업데이트
  useEffect(() => {
    if (!API_BASE_URL || !blueprintId) return; // 백엔드 미연결 방지

    const eventSource = new EventSource(
      `${API_BASE_URL}/api/blueprints/${blueprintId}/task/read`,
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // 읽음 이벤트 발생 시 unreadNotes 상태 업데이트
        if (data.pin_id === pinInfo.pin_id && data.user_id === TEST_USER_ID) {
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
  }, [API_BASE_URL, blueprintId, pinInfo.pin_id]);

  // 읽음 여부 판단
  const fetchUnreadStatus = useCallback(async () => {
    try {
      const response = await get(`pins/${pinInfo.pin_id}/notes`, {
        project_id: projectId,
      });
      const notes = response.data?.content?.note_list || [];

      // 내 user_id(TEST_USER_ID)가 read_users에 없으면 unreadNotes = true
      const isUnread = notes.some((note) =>
        note.read_users.every((user) => user.user_id !== TEST_USER_ID),
      );

      setUnreadNotes(isUnread);
    } catch (error) {
      console.error(`핀 ${pinInfo.pin_id}의 읽음 여부 조회 실패:`, error);
    }
  }, [pinInfo]);

  // 최근 노트 데이터를 가져오기
  const fetchRecentNote = useCallback(async () => {
    try {
      const response = await get(`pins/${pinInfo.pin_id}/notes/recent`);
      const note = response.data?.content;

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

  useEffect(() => {
    if (!pin) return;

    setPinInfo(pin);
    fetchUnreadStatus();
    fetchRecentNote();
  }, [pin, fetchUnreadStatus, fetchRecentNote]);

  if (!pin) return null;

  return (
    <div className="relative inline-block">
      {/* 핀 아이콘 (활성화 상태일 때 테두리 추가) */}
      <div
        ref={pinRef}
        className="absolute w-8 h-8 flex items-center justify-center"
        onMouseEnter={() => !isClicked && setHoveredPin(pinInfo)}
        onMouseLeave={() => setHoveredPin(null)}
        onClick={() => {
          setIsClicked((prev) => !prev);
          onClickPin();
        }}
        style={{
          position: 'relative',
        }}
      >
        {/* 아이콘 뒤 원형 배경 추가 */}
        {isActive && (
          <div
            className="absolute w-16 h-16 rounded-full"
            style={{
              background: 'radial-gradient(circle, #87B5FA  0%, white 70%)',
              filter: 'blur(10px)', // 흐림 효과 추가
              zIndex: -1, // 핀보다 아래로 배치
            }}
          />
        )}

        {/* 아이콘 */}
        <Icon
          name="IconTbPinFill"
          width={40}
          height={40}
          color={pinInfo.pin_group?.pin_group_color || 'gray'}
        />

        {/* 읽지 않은 경우 빨간 점 표시 */}
        {unreadNotes && (
          <div className="absolute top-[-4px] right-[-4px] w-2 h-2 bg-red-500 rounded-full" />
        )}
      </div>

      {/* 호버 시 최근 노트 표시 (기능 유지) */}
      {!isClicked && hoveredPin && recentNotes && (
        <Popup>
          <PopupTitle>{recentNotes.title || '제목 없음'}</PopupTitle>
          <PopupDivider />
          <PopupContent>{recentNotes.content || '내용 없음'}</PopupContent>
        </Popup>
      )}

      {/* 클릭 시 버튼 목록 표시 (버튼 리스트 유지) */}
      {isClicked && (
        <div className="absolute top-6 left-8 z-10">
          <ButtonList
            onNoteClick={handleNoteClick}
            onImgClick={handleImgClick}
          />
        </div>
      )}

      <div className="absolute min-w-fit top-20 flex justify-center gap-4">
        {/* 노트 상세 보기 유지 */}
        {showPinNotes && (
          <div>
            <PinNotes
              pinInfo={pinInfo}
              isSidebar={false}
              pinId={pinInfo.pin_id}
              onClose={() => setShowPinNotes(false)}
            />
          </div>
        )}
        {/* 이미지들 상세 보기 유지 */}
        {showImages && (
          <div>
            <NoteImageDetail
              onClose={() => setShowImages(false)}
              pinInfo={pinInfo}
            />
          </div>
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
  width: 10rem;
  background: rgba(0, 0, 0, 0.52);
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  z-index: 10;
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
