import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import ButtonList from './ButtonList';
import { get } from '../../api';
import Icon from '../common/Icon';
import PinNotes from './PinNotes';

const TEST_USER_ID = 6569173793051701; // 테스트용 user_id 고정

const PinComponent = ({ blueprintId, blueprintVersion, pin }) => {
  const [pinInfo, setPinInfo] = useState(pin);
  const [hoveredPin, setHoveredPin] = useState(null);
  const [recentNotes, setRecentNotes] = useState(null);
  const [unreadNotes, setUnreadNotes] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const pinRef = useRef(null);
  const [showPinNotes, setShowPinNotes] = useState(false);

  const handleNoteClick = () => {
    setShowPinNotes((prevState) => !prevState);
  };

  // 읽음 여부 판단
  const fetchUnreadStatus = useCallback(async () => {
    try {
      const response = await get(`pins/${pinInfo.pin_id}/notes`);
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

  // 노트 데이터를 가져오기
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
    const handleClickOutside = (event) => {
      if (pinRef.current && !pinRef.current.contains(event.target)) {
        setIsClicked(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!pin) {
      return;
    }

    setPinInfo(pin);
    fetchUnreadStatus();
    fetchRecentNote();
  }, [pin, fetchUnreadStatus, fetchRecentNote]);

  if (!pin) return null;

  return (
    <div className="relative inline-block">
      {/* 핀 아이콘 */}
      <div
        ref={pinRef}
        className="absolute w-8 h-8"
        onMouseEnter={() => {
          if (!isClicked) {
            setHoveredPin(pinInfo);
          }
        }}
        onMouseLeave={() => setHoveredPin(null)}
        onClick={() => setIsClicked((prev) => !prev)}
      >
        {/* `group_color`을 받아 아이콘 색상 변경 */}
        <Icon
          name="IconTbPinFill"
          width={24}
          height={24}
          style={{ color: pinInfo.pin_group?.pin_group_color || 'gray' }}
        />
        {/* 읽지 않은 경우 빨간 점 표시 */}
        {unreadNotes && (
          <div className="absolute top-[-4px] right-[-4px] w-2 h-2 bg-red-500 rounded-full" />
        )}
      </div>

      {/* 호버 시 최근 노트 표시 */}
      {!isClicked && hoveredPin && recentNotes && (
        <Popup>
          <PopupTitle>{recentNotes.title || '제목 없음'}</PopupTitle>
          <PopupDivider />
          <PopupContent>{recentNotes.content || '내용 없음'}</PopupContent>
        </Popup>
      )}

      {/* 클릭 시 버튼 목록 표시 */}
      {isClicked && (
        <div className="absolute top-4 left-6 z-10">
          <ButtonList onNoteClick={handleNoteClick} />
        </div>
      )}

      {/* 노트 상세 보기 */}
      {showPinNotes && (
        <div className="absolute left-full top-0 z-10 w-60">
          <PinNotes onClose={() => setShowPinNotes(false)} />
        </div>
      )}
    </div>
  );
};

export default PinComponent;

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
