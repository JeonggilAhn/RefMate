import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import ButtonList from './ButtonList';
import { get, post } from '../../api';

import pinIcon from '../../assets/icons/Pin_Blue.svg';

const PinComponent = ({ blueprintId, blueprintVersion, pin }) => {
  const [pinInfo, setPinInfo] = useState(pin);
  const [hoveredPin, setHoveredPin] = useState(null);
  const [recentNotes, setRecentNotes] = useState(null);
  const [unreadNotes, setUnreadNotes] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const pinRef = useRef(null);

  const fetchRecentNote = useCallback(async () => {
    try {
      const response = await get(`pins/${pinInfo.pin_id}/notes/recent`);
      setRecentNotes(response.data?.content || null);
      setUnreadNotes(pinInfo.has_unread_note || false);
    } catch (error) {
      console.error(`핀 ${pinInfo.pin_id}의 최근 노트 조회 실패:`, error);
    }
  }, [pinInfo]);

  const markNotesAsRead = async () => {
    if (!pinInfo || !unreadNotes) return;

    try {
      await post(`blueprints/${blueprintId}/${blueprintVersion}/task/read`, {
        pin_id: pinInfo.pin_id,
      });
      setUnreadNotes(false);
    } catch (error) {
      console.error('노트 읽음 처리 실패:', error);
    }
  };

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
    console.log('pin', pin);
    fetchRecentNote();
  }, [pin, fetchRecentNote]);

  if (!pin) return null;

  return (
    <PinContainer>
      <Pin
        ref={pinRef}
        onMouseEnter={() => {
          if (!isClicked) {
            setHoveredPin(pinInfo);
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
        <Popup>
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
`;

const Icon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  position: relative;
`;

const Pin = styled.div`
  position: absolute;
  width: 2rem;
  height: 2rem;
`;

const UnreadDot = styled.div`
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  width: 0.5rem;
  height: 0.5rem;
  background-color: red;
  border-radius: 50%;
`;

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

const ButtonGroupContainer = styled.div`
  position: absolute;
  top: 1rem;
  left: 1.5rem;
  z-index: 2;
`;
