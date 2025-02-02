import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ButtonList from './ButtonList';
import { get, post } from '../../api';

// 기본 핀 아이콘 (임시 블루)
const pinIcon = require('../../assets/icons/Pin_Blue.svg').default;
const outlineIcon = require('../../assets/icons/Pin_Outline.svg').default;

const PinComponent = ({ blueprintId, blueprintVersion }) => {
  const [pins, setPins] = useState([]); // 핀 리스트
  const [selectedPin, setSelectedPin] = useState(null); // 클릭한 핀
  const [hoveredPin, setHoveredPin] = useState(null); // 호버 중인 핀
  const [recentNotes, setRecentNotes] = useState({}); // 핀별 최신 노트 저장
  const [unreadNotes, setUnreadNotes] = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const pinRef = useRef(null);

  // 블루프린트에서 핀 리스트 가져오기
  useEffect(() => {
    if (!blueprintId || !blueprintVersion) return;

    const fetchPins = async () => {
      try {
        const response = await get(
          `blueprints/${blueprintId}/${blueprintVersion}/pins`,
        );
        const pinList = response.data?.content || [];

        if (pinList.length > 0) {
          setPins(pinList);
          setSelectedPin(pinList[0]); // 첫 번째 핀 선택 (클릭 시 사용)
        }
      } catch (error) {
        console.error('블루프린트 핀 조회 실패:', error);
      }
    };

    fetchPins();
  }, [blueprintId, blueprintVersion]);

  // 핀을 호버할 때 해당 핀의 최신 노트 가져오기
  const handleMouseEnter = async (pin) => {
    setHoveredPin(pin); // 현재 호버 중인 핀 설정
    adjustPopupPosition();

    // 핀별 최신 노트가 이미 저장되어 있다면 API 호출 생략
    if (recentNotes[pin.pin_id]) return;

    try {
      const response = await get(`pins/${pin.pin_id}/notes/recent`);
      setRecentNotes((prevNotes) => ({
        ...prevNotes,
        [pin.pin_id]: {
          title: response.data?.content?.note_title || '최근 노트 없음',
          content: response.data?.content?.note_content || '',
        },
      }));
      setUnreadNotes((prevUnread) => ({
        ...prevUnread,
        [pin.pin_id]: pin.has_unread_note || false,
      }));
    } catch (error) {
      console.error(`핀 ${pin.pin_id}의 최근 노트 조회 실패:`, error);
    }
  };

  // 노트 읽음 처리 (호버 시 자동 호출)
  const markNotesAsRead = async (pin) => {
    if (!pin || !unreadNotes[pin.pin_id]) return;

    try {
      await post(`blueprints/${blueprintId}/${blueprintVersion}/task/read`, {
        pin_id: pin.pin_id,
      });
      setUnreadNotes((prevUnread) => ({
        ...prevUnread,
        [pin.pin_id]: false,
      }));
    } catch (error) {
      console.error('⚠️ 노트 읽음 처리 실패:', error);
    }
  };

  const handleMouseLeave = () => setHoveredPin(null);
  const handlePinClick = (pin) => {
    setSelectedPin(pin);
    setIsClicked((prev) => !prev);
  };

  // 팝업 위치 조정
  const adjustPopupPosition = () => {
    if (!pinRef.current) return;

    const pinRect = pinRef.current.getBoundingClientRect();
    const popupHeight = 80; // px
    const popupWidth = 160; // px
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

  return (
    <Container>
      {pins.map((pin) => (
        <PinContainer key={pin.pin_id}>
          {isClicked && selectedPin?.pin_id === pin.pin_id && (
            <OutlineIcon
              src={outlineIcon}
              alt="Outline"
              onClick={() => handlePinClick(pin)}
            />
          )}
          <Pin
            ref={pinRef}
            onMouseEnter={() => {
              handleMouseEnter(pin);
              markNotesAsRead(pin);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => handlePinClick(pin)}
          >
            <Icon src={pinIcon} alt="Pin Icon" />
            {unreadNotes[pin.pin_id] && <UnreadDot />}
          </Pin>

          {hoveredPin?.pin_id === pin.pin_id && !isClicked && (
            <Popup
              style={{
                top: `${popupPosition.top}px`,
                left: `${popupPosition.left}px`,
              }}
            >
              <PopupTitle>
                {recentNotes[pin.pin_id]?.title || '로딩 중...'}
              </PopupTitle>
              <PopupDivider />
              <PopupContent>
                {recentNotes[pin.pin_id]?.content || ''}
              </PopupContent>
            </Popup>
          )}

          {isClicked && selectedPin?.pin_id === pin.pin_id && (
            <ButtonGroupContainer>
              <ButtonList />
            </ButtonGroupContainer>
          )}
        </PinContainer>
      ))}
    </Container>
  );
};

export default PinComponent;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
`;

const PinContainer = styled.div`
  position: relative;
  display: inline-block;
  margin: 0.5rem;
`;

const OutlineIcon = styled.img`
  width: 2rem;
  height: 2rem;
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
`;

const Icon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  position: relative;
  z-index: 1;
`;

const Pin = styled.div`
  position: absolute;
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
  top: 2.5rem;
  left: 1.5rem;
  z-index: 15;
`;
