import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { get, post, put } from '../../api'; // API 요청 함수 임포트

// 테스트 시 import해서 확인, 버튼 형식으로 만듦.

const PinPopup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 자체 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [pinName, setPinName] = useState('');
  const [pinGroup, setPinGroup] = useState('');
  const [groupOptions, setGroupOptions] = useState([]);

  // 그룹 목록을 API에서 가져오기
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await get('pingroups'); // 그룹 리스트 가져오기
        setGroupOptions(response.data || []);
      } catch (error) {
        console.error('그룹 목록을 불러오는데 실패했습니다.', error);
      }
    };
    fetchGroups();
  }, []);

  // 핀 생성 버튼 클릭 시 (팝업 열기)
  const openCreatePopup = () => {
    setIsEditing(false);
    setPinName('');
    setPinGroup('');
    setIsPopupOpen(true);
  };

  // 핀 수정 버튼 클릭 시 (팝업 열기)
  const openEditPopup = () => {
    setIsEditing(true);
    setPinName('기존 핀 이름'); // 예시 데이터
    setPinGroup('검토 중');
    setIsPopupOpen(true);
  };

  // 팝업 닫기
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // 저장 버튼 클릭 시 (API 호출)
  const handleSave = async () => {
    if (!pinName.trim() || !pinGroup) return;

    try {
      if (isEditing) {
        await put(`pins/1`, { name: pinName, group: pinGroup }); // 기존 핀 ID 사용 (테스트용)
        console.log('핀 수정 완료:', { name: pinName, group: pinGroup });
      } else {
        await post('pins', { name: pinName, group: pinGroup });
        console.log('새 핀 생성 완료:', { name: pinName, group: pinGroup });
      }
      closePopup();
    } catch (error) {
      console.error('저장 중 오류 발생', error);
    }
  };

  return (
    <div>
      <button onClick={openCreatePopup}>핀 생성</button>
      <button onClick={openEditPopup}>핀 수정</button>

      {isPopupOpen && (
        <Overlay>
          <PopupContainer>
            <Header>
              <h2>{isEditing ? '핀 수정' : '핀 생성'}</h2>
              <button onClick={closePopup}>X</button>
            </Header>
            <InputGroup>
              <label htmlFor="pinName">이름</label>
              <input
                id="pinName"
                type="text"
                value={pinName}
                onChange={(e) => setPinName(e.target.value)}
                placeholder="전체 도면"
              />
            </InputGroup>
            <InputGroup>
              <label htmlFor="pinGroup">그룹</label>
              <select
                id="pinGroup"
                value={pinGroup}
                onChange={(e) => setPinGroup(e.target.value)}
              >
                <option value="" disabled>
                  그룹 선택
                </option>
                {groupOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </InputGroup>
            <ButtonGroup>
              <button
                onClick={handleSave}
                disabled={!pinName.trim() || !pinGroup}
              >
                완료
              </button>
            </ButtonGroup>
          </PopupContainer>
        </Overlay>
      )}
    </div>
  );
};

export default PinPopup;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContainer = styled.div`
  width: 317px;
  height: 240px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const InputGroup = styled.div`
  width: 100%;
  margin-bottom: 10px;

  label {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 4px;
  }

  input,
  select {
    width: 100%;
    height: 30px;
    padding: 4px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;

  button {
    padding: 6px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;
