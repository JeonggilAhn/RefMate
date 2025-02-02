import React, { useState, useEffect } from 'react';
import { get, post, patch } from '../../api';

const PinPopup = ({ blueprintId, blueprintVersion }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pinId, setPinId] = useState(null); // 수정할 핀 ID
  const [pinName, setPinName] = useState('');
  const [pinGroup, setPinGroup] = useState('');
  const [groupOptions, setGroupOptions] = useState([]);

  // 블루프린트 ID와 버전 확인
  useEffect(() => {
    console.log('📍 blueprintId:', blueprintId);
    console.log('📍 blueprintVersion:', blueprintVersion);
  }, [blueprintId, blueprintVersion]);

  // 핀 그룹 조회 (API 호출)
  useEffect(() => {
    const fetchGroups = async () => {
      if (!blueprintId) return;
      try {
        const response = await get(`blueprints/${blueprintId}/pin-groups`);
        if (response.data?.content && Array.isArray(response.data.content)) {
          setGroupOptions(response.data.content);
        }
      } catch (error) {}
    };

    fetchGroups();
  }, [blueprintId]);

  // 팝업 열기 (생성)
  const openCreatePopup = () => {
    setIsEditing(false);
    setPinId(null);
    setPinName('');
    setPinGroup('');
    setIsPopupOpen(true);
  };

  // 팝업 열기 (수정)
  const openEditPopup = () => {
    setIsEditing(true);
    setPinId('123'); // 임시 값 (테스트용)
    setPinName('기존 핀 이름'); // 기존 데이터 불러오기 (테스트)
    setPinGroup('기존 그룹'); // 기존 데이터 불러오기 (테스트)
    setIsPopupOpen(true);
  };

  // 핀 생성 API
  const handleCreatePin = async () => {
    if (!pinName.trim() || !pinGroup) return;
    try {
      await post(`blueprints/${blueprintId}/${blueprintVersion}/pins`, {
        name: pinName,
        group: pinGroup,
      });
      console.log('핀 생성 완료:', { name: pinName, group: pinGroup });

      closePopup();
    } catch (error) {}
  };

  // 핀 수정 API
  const handleEditPin = async () => {
    if (!pinId || !pinName.trim() || !pinGroup) return;
    try {
      await patch(`pins/${pinId}/name`, { name: pinName });
      await patch(`pins/${pinId}/${blueprintVersion}/group`, {
        group: pinGroup,
      });

      console.log('핀 수정 완료:', { name: pinName, group: pinGroup });

      closePopup();
    } catch (error) {}
  };

  //  팝업 닫기 & 입력 필드 초기화
  const closePopup = () => {
    setPinName('');
    setPinGroup('');
    setIsPopupOpen(false);
  };

  return (
    <div>
      {/* 버튼 (생성 / 수정) */}
      <button onClick={openCreatePopup}>핀 생성</button>
      <button onClick={openEditPopup}>핀 수정</button>

      {/* 팝업창 */}
      {isPopupOpen && (
        <div style={overlayStyle}>
          <div style={popupStyle}>
            <h2>{isEditing ? '핀 수정' : '핀 생성'}</h2>

            <label>
              이름:
              <input
                type="text"
                value={pinName}
                onChange={(e) => setPinName(e.target.value)}
                placeholder="핀 이름 입력"
              />
            </label>

            <label>
              그룹:
              <select
                value={pinGroup}
                onChange={(e) => setPinGroup(e.target.value)}
              >
                <option value="" disabled>
                  그룹 선택
                </option>
                {groupOptions.map((option, index) => (
                  <option key={index} value={option.pin_group_id}>
                    {option.pin_group_name}
                  </option>
                ))}
              </select>
            </label>

            {/* 버튼 (생성 / 수정) */}
            <button
              onClick={isEditing ? handleEditPin : handleCreatePin}
              disabled={!pinName.trim() || !pinGroup}
            >
              완료
            </button>
            <button onClick={closePopup}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PinPopup;

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const popupStyle = {
  background: '#fff',
  padding: '16px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};
