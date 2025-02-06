import React, { useState, useEffect } from 'react';
import { get, post, patch } from '../../api';
import styled from 'styled-components';

const PinPopup = ({
  blueprintId,
  blueprintVersion,
  initialPin,
  onConfirm,
  onCancel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [pinId, setPinId] = useState(null);
  const [pinName, setPinName] = useState('');
  const [pinGroup, setPinGroup] = useState('');
  const [groupOptions, setGroupOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (initialPin) {
      setIsEditing(initialPin.pin_id !== null);
      setPinId(initialPin.pin_id);
      setPinName(initialPin.pin_name || '');
      setPinGroup(initialPin.pin_group?.pin_group_id || '');
    }
  }, [initialPin]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!blueprintId) return;
      try {
        const response = await get(`blueprints/${blueprintId}/pin-groups`);
        if (response.data?.content && Array.isArray(response.data.content)) {
          setGroupOptions(response.data.content);
        }
      } catch (error) {
        console.error('핀 그룹 로딩 오류:', error);
      }
    };

    fetchGroups();
  }, [blueprintId]);

  const handleCreatePin = async () => {
    if (!pinName.trim() || !pinGroup) return;
    try {
      await post(`blueprints/${blueprintId}/${blueprintVersion}/pins`, {
        name: pinName,
        group: pinGroup,
      });

      console.log('핀 생성 완료:', { name: pinName, group: pinGroup });

      onConfirm(
        pinName,
        pinGroup,
        groupOptions.find((g) => g.pin_group_id === pinGroup)?.pin_group_color,
      );
    } catch (error) {
      console.error('핀 생성 실패:', error);
    }
  };

  const handleEditPin = async () => {
    if (!pinId || !pinName.trim() || !pinGroup) return;
    try {
      await patch(`pins/${pinId}/name`, { name: pinName });
      await patch(`pins/${pinId}/${blueprintVersion}/group`, {
        group: pinGroup,
      });

      console.log('핀 수정 완료:', { name: pinName, group: pinGroup });

      onConfirm(
        pinName,
        pinGroup,
        groupOptions.find((g) => g.pin_group_id === pinGroup)?.pin_group_color,
      );
    } catch (error) {
      console.error('핀 수정 실패:', error);
    }
  };

  return (
    <Overlay>
      <Popup>
        <h2>{isEditing ? '핀 수정' : '핀 생성'}</h2>

        <Label>
          이름:
          <Input
            type="text"
            value={pinName}
            onChange={(e) => setPinName(e.target.value)}
            placeholder="핀 이름 입력"
          />
        </Label>

        <Label>
          그룹:
          <DropdownWrapper>
            <DropdownHeader onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              {pinGroup ? (
                <>
                  <ColorCircle
                    color={
                      groupOptions.find((g) => g.pin_group_id === pinGroup)
                        ?.pin_group_color || 'transparent'
                    }
                  />
                  {groupOptions.find((g) => g.pin_group_id === pinGroup)
                    ?.pin_group_name || '그룹 선택'}
                </>
              ) : (
                '그룹 선택'
              )}
            </DropdownHeader>

            {isDropdownOpen && (
              <DropdownList>
                {groupOptions.map((option) => (
                  <DropdownItem
                    key={option.pin_group_id}
                    onClick={() => {
                      setPinGroup(option.pin_group_id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <ColorCircle color={option.pin_group_color} />
                    {option.pin_group_name}
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>
        </Label>

        <Button
          disabled={
            !pinName.trim() ||
            !pinGroup || // 그룹 선택이 안 된 경우
            groupOptions.find((g) => g.pin_group_id === pinGroup)
              ?.pin_group_name === '그룹 선택' // 그룹이 "그룹 선택"인 경우
          }
          onClick={isEditing ? handleEditPin : handleCreatePin}
        >
          완료
        </Button>

        <Button onClick={onCancel}>닫기</Button>
      </Popup>
    </Overlay>
  );
};

export default PinPopup;

// Styled Components
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
  z-index: 100;
`;

const Popup = styled.div`
  background: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 100;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
`;

const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownHeader = styled.div`
  padding: 0.5rem;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DropdownList = styled.ul`
  position: absolute;
  width: 100%;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  margin-top: 0.25rem;
  list-style: none;
  padding: 0;
  max-height: 10rem;
  overflow-y: auto;
  z-index: 30;
`;

const DropdownItem = styled.li`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`;

const ColorCircle = styled.span`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: ${(props) => props.color || 'gray'};
`;

const Button = styled.button`
  padding: 0.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  &:disabled {
    background: #ccc;
  }
`;
