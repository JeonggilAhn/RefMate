import React, { useState, useEffect } from 'react';
import { post, patch } from '../../api';
import { useRecoilValue } from 'recoil';
import { colorState } from '../../recoil/common/color';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

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

  const groupOptions = useRecoilValue(colorState); // Recoil에서 컬러 데이터 가져오기

  // blueprintId가 올바르게 전달되는지 확인
  useEffect(() => {
    console.log('현재 blueprintId:', blueprintId);
  }, [blueprintId]);

  // Recoil에서 가져온 데이터가 올바르게 들어오는지 확인
  useEffect(() => {
    console.log('현재 groupOptions:', groupOptions);
  }, [groupOptions]);

  // 초기 핀 데이터 설정
  useEffect(() => {
    if (initialPin) {
      setIsEditing(initialPin.pin_id !== null);
      setPinId(initialPin.pin_id);
      setPinName(initialPin.pin_name || '');
      setPinGroup(initialPin.pin_group?.pin_group_id || '');
    } else if (groupOptions.length > 0) {
      setPinGroup(groupOptions[0].id); // 그룹 목록이 있으면 첫 번째 항목을 기본값으로 설정
    }
  }, [initialPin, groupOptions]);

  // 핀 생성 핸들러
  const handleCreatePin = async () => {
    if (!pinName.trim() || !pinGroup) return;

    try {
      const groupColor =
        groupOptions.find((g) => g.id === pinGroup)?.color || 'gray';
      post(`blueprints/${blueprintId}/${blueprintVersion}/pins`, {
        pin_name: pinName,
        pin_group_id: pinGroup,
        pin_x: initialPin.pin_x,
        pin_y: initialPin.pin_y,
      }).then((res) => {
        const {
          data: { content },
        } = res;
        onConfirm(
          content.pin.pin_name,
          content.pin.pin_group.pin_group_id,
          content.pin.pin_group.pin_group_color,
          content.pin.pin_id,
        );
      });
    } catch (error) {
      console.error('핀 생성 실패:', error);
    }
  };

  // 핀 수정 핸들러
  const handleEditPin = async () => {
    if (!pinId || !pinName.trim() || !pinGroup) return;

    try {
      const groupColor =
        groupOptions.find((g) => g.id === pinGroup)?.color || 'gray';
      await patch(`pins/${pinId}/name`, { name: pinName });
      await patch(`pins/${pinId}/${blueprintVersion}/group`, {
        group: pinGroup,
      });
      onConfirm(pinName, pinGroup, groupColor);
    } catch (error) {
      console.error('핀 수정 실패:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
      {/* ColorInitializer 제거됨 (Blueprint.jsx에서 실행됨) */}
      <div className="bg-white rounded-lg p-6 w-96 border border-black">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? '핀 수정' : '핀 생성'}
        </h2>

        {/* 이름 입력 */}
        <div className="mb-4">
          <label className="block font-bold mb-1">이름:</label>
          <input
            type="text"
            value={pinName}
            onChange={(e) => setPinName(e.target.value)}
            placeholder="핀 이름 입력"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* 그룹 선택 */}
        <div className="mb-4">
          <label className="block font-bold mb-1">그룹:</label>
          <Select onValueChange={(value) => setPinGroup(value)}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 flex items-center gap-2 bg-white">
              {pinGroup ? (
                <>
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor:
                        groupOptions.find((g) => g.id === pinGroup)?.color ||
                        'transparent',
                    }}
                  />
                  <SelectValue placeholder="그룹 선택" />
                </>
              ) : (
                <SelectValue placeholder="그룹 선택" />
              )}
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 rounded-md shadow-md">
              {groupOptions.length > 0 ? (
                groupOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      {option.name}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-gray-500">그룹 없음</div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* 기존 버튼 UI 유지 (삭제된 버튼 복구) */}
        <div className="flex justify-end gap-2">
          <button
            className={`px-4 py-2 rounded-md ${
              pinName.trim() && pinGroup
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!pinName.trim() || !pinGroup}
            onClick={isEditing ? handleEditPin : handleCreatePin}
          >
            완료
          </button>
          <button
            className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
            onClick={onCancel}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinPopup;
