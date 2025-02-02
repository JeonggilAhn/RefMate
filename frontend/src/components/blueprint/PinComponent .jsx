import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ButtonList from './ButtonList';
import { get, post } from '../../api';

const pinIcon = require('../../assets/icons/Pin_Blue.svg').default;

const PinComponent = ({ blueprintId, blueprintVersion }) => {
  const [selectedPin, setSelectedPin] = useState(null);
  const [hoveredPin, setHoveredPin] = useState(null);
  const [recentNotes, setRecentNotes] = useState(null);
  const [unreadNotes, setUnreadNotes] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const pinRef = useRef(null);

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
    if (!blueprintId || !blueprintVersion) return;

    const fetchSelectedPin = async () => {
      try {
        const response = await get(
          `blueprints/${blueprintId}/${blueprintVersion}/pins`,
        );
        const pinList = response.data?.content || [];

        if (pinList.length > 0) {
          setSelectedPin(pinList[0]); // 첫 번째 핀 선택
        }
      } catch (error) {
        console.error('블루프린트 핀 조회 실패:', error);
      }
    };

    fetchSelectedPin();
  }, [blueprintId, blueprintVersion]);

  useEffect(() => {
    if (!selectedPin) return;

    const fetchRecentNote = async () => {
      try {
        const response = await get(`pins/${selectedPin.pin_id}/notes/recent`);
        setRecentNotes(response.data?.content || null);
        setUnreadNotes(selectedPin.has_unread_note || false);
      } catch (error) {
        console.error(`핀 ${selectedPin.pin_id}의 최근 노트 조회 실패:`, error);
      }
    };

    fetchRecentNote();
  }, [selectedPin]);

  const markNotesAsRead = async () => {
    if (!selectedPin || !unreadNotes) return;

    try {
      await post(`blueprints/${blueprintId}/${blueprintVersion}/task/read`, {
        pin_id: selectedPin.pin_id,
      });
      setUnreadNotes(false);
    } catch (error) {
      console.error('노트 읽음 처리 실패:', error);
    }
  };

  const adjustPopupPosition = () => {
    if (!pinRef.current) return;

    const pinRect = pinRef.current.getBoundingClientRect();
    const popupHeight = 80;
    const popupWidth = 160;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = pinRect.top - popupHeight - 8;
    let left = pinRect.left + pinRect.width / 2 - popupWidth / 2;

    if (top < 0) top = pinRect.bottom + 8;
    if (left < 0) left = 8;
    if (left + popupWidth > viewportWidth)
      left = viewportWidth - popupWidth - 8;
    if (top + popupHeight > viewportHeight)
      top = viewportHeight - popupHeight - 8;

    setPopupPosition({ top, left });
  };

  if (!selectedPin) return null;

  return (
    <PinContainer>
      <Pin
        ref={pinRef}
        onMouseEnter={() => {
          if (!isClicked) {
            setHoveredPin(selectedPin);
            adjustPopupPosition();
            markNotesAsRead();
          }
        }}
        onMouseLeave={() => setHoveredPin(null)}
        onClick={() => setIsClicked((prev) => !prev)}
      >
        <Icon src={pinIcon} alt="Pin Icon" />
        {unreadNotes && <UnreadDot />}
      </Pin>

      {!isClicked && hoveredPin && (
        <Popup
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
          }}
        >
          <PopupTitle>{recentNotes?.note_title || ''}</PopupTitle>
          <PopupDivider />
          <PopupContent>{recentNotes?.note_content || ''}</PopupContent>
        </Popup>
      )}

      {isClicked && (
        <ButtonGroupContainer>
          <ButtonList />
        </ButtonGroupContainer>
      )}
    </PinContainer>
  );
};

export default PinComponent;

const PinContainer = styled.div`
  position: relative;
  display: inline-block;
  margin: 0.5rem;
`;

const Icon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  position: relative;
  z-index: 1;
`;

const Pin = styled.div`
  position: relative;
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const UnreadDot = styled.div`
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  width: 0.5rem;
  height: 0.5rem;
  background-color: red;
  border-radius: 50%;
  z-index: 2;
`;

const Popup = styled.div`
  position: fixed;
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

const ButtonGroupContainer = styled.div`
  position: absolute;
  top: 2.5rem;
  left: 1.5rem;
  z-index: 15;
`;
