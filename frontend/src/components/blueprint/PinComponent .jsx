import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ButtonList from './ButtonList';
import { get } from '../../api';

// 아이콘 맵핑
const groupIcons = {
  1: require('../../assets/icons/Pin_Red.svg').default,
  2: require('../../assets/icons/Pin_Orange.svg').default,
  3: require('../../assets/icons/Pin_Yellow.svg').default,
  4: require('../../assets/icons/Pin_LightGreen.svg').default,
  5: require('../../assets/icons/Pin_Green.svg').default,
  6: require('../../assets/icons/Pin_LightBlue.svg').default,
  7: require('../../assets/icons/Pin_Blue.svg').default,
  8: require('../../assets/icons/Pin_Purple.svg').default,
  9: require('../../assets/icons/Pin_Pink.svg').default,
  10: require('../../assets/icons/Pin_Gray.svg').default,
  outline: require('../../assets/icons/Pin_Outline.svg').default,
};

const PinComponent = ({
  pinId,
  pinName,
  groupNumber,
  recentNoteTitle,
  recentNoteContent,
  unreadNotes, // 안 읽은 노트 개수
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [pinData, setPinData] = useState(null);
  const pinRef = useRef(null);

  // API 데이터 가져오기
  useEffect(() => {
    const fetchPinData = async () => {
      try {
        const response = await get(`/pins/${pinId}/notes`); // API 호출
        setPinData(response.data);
      } catch (error) {
        // 테스트용 코드드
        console.error('핀 데이터를 불러오는 중 에러 발생:', error);
        setPinData({
          pinName: pinName || '테스트 핀',
          groupNumber: groupNumber || 7,
          recentNoteTitle: recentNoteTitle || '테스트 노트 제목',
          recentNoteContent: recentNoteContent || '테스트 노트 내용',
        });
      }
    };

    fetchPinData();
  }, [pinId]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    adjustPopupPosition();
  };

  const handleMouseLeave = () => setIsHovered(false);

  const handlePinClick = () => {
    setIsClicked((prev) => !prev);
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

  useEffect(() => {
    window.addEventListener('resize', adjustPopupPosition);
    return () => window.removeEventListener('resize', adjustPopupPosition);
  }, []);

  if (!pinData) return <div>Loading...</div>;

  return (
    <Container>
      <PinContainer>
        {/* Outline Icon for Highlight */}
        {isClicked && (
          <OutlineIcon
            src={groupIcons.outline}
            alt="Outline"
            onClick={handlePinClick} // 클릭 이벤트 유지
          />
        )}
        <Pin
          ref={pinRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handlePinClick}
        >
          <Icon src={groupIcons[pinData.groupNumber]} alt="Pin Icon" />
          {unreadNotes > 0 && <UnreadDot />} {/* 안 읽은 핀 표시 */}
        </Pin>
      </PinContainer>

      {isHovered && !isClicked && (
        <Popup
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
          }}
        >
          <PopupTitle>{pinData.pinName}</PopupTitle>
          <PopupDivider />
          <PopupContent>
            <PopupNoteTitle>{pinData.recentNoteTitle}</PopupNoteTitle>
            <PopupNoteContent>{pinData.recentNoteContent}</PopupNoteContent>
          </PopupContent>
        </Popup>
      )}

      {isClicked && (
        <ButtonGroupContainer>
          <ButtonList />
        </ButtonGroupContainer>
      )}
    </Container>
  );
};

export default PinComponent;

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const PinContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const OutlineIcon = styled.img`
  width: 32px;
  height: 31.5px;
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
`;

const Icon = styled.img`
  width: 18px;
  height: 18px;
  position: relative;
  z-index: 1;
`;

const Pin = styled.div`
  position: relative;
  width: 27px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const UnreadDot = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 6px;
  height: 6px;
  background-color: red;
  border-radius: 50%;
  z-index: 2;
`;

const Popup = styled.div`
  position: fixed;
  width: 160px;
  background: rgba(0, 0, 0, 0.52);
  color: #ffffff;
  padding: 6px;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const PopupTitle = styled.div`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #ffffff;
`;

const PopupDivider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
`;

const PopupContent = styled.div`
  font-size: 10px;
  color: #ffffff;
`;

const PopupNoteTitle = styled.div`
  margin-bottom: 4px;
  font-weight: bold;
  color: #ffffff;
`;

const PopupNoteContent = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
`;

const ButtonGroupContainer = styled.div`
  position: absolute;
  top: 25px;
  left: 20px;
  z-index: 15;
`;
