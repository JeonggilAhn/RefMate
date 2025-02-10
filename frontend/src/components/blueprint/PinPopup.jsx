import React, { useState, useEffect } from 'react';
import { get, post, patch } from '../../api';
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
  const [groupOptions, setGroupOptions] = useState([]);

  // 초기 핀 데이터 설정
  useEffect(() => {
    if (initialPin) {
      setIsEditing(initialPin.pin_id !== null);
      setPinId(initialPin.pin_id);
      setPinName(initialPin.pin_name || '');
      setPinGroup(initialPin.pin_group?.pin_group_id || '');
    }
  }, [initialPin]);

  // 핀 그룹 데이터 가져오기
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

  // 핀 생성 핸들러
  const handleCreatePin = async () => {
    if (!pinName.trim() || !pinGroup) return;

    try {
      const groupColor =
        groupOptions.find((g) => g.pin_group_id === pinGroup)
          ?.pin_group_color || 'gray';
      post(`blueprints/${blueprintId}/${blueprintVersion}/pins`, {
        name: pinName,
        group: pinGroup,
      }).then((res) => {
        const {
          data: { content },
        } = res;
        onConfirm(pinName, pinGroup, groupColor, content.pin_id);
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
        groupOptions.find((g) => g.pin_group_id === pinGroup)
          ?.pin_group_color || 'gray';
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
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 flex items-center gap-2">
              {pinGroup ? (
                <>
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor:
                        groupOptions.find((g) => g.pin_group_id === pinGroup)
                          ?.pin_group_color || 'transparent',
                    }}
                  />
                  <SelectValue placeholder="그룹 선택" />
                </>
              ) : (
                <SelectValue placeholder="그룹 선택" />
              )}
            </SelectTrigger>
            <SelectContent>
              {groupOptions.map((option) => (
                <SelectItem
                  key={option.pin_group_id}
                  value={option.pin_group_id}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: option.pin_group_color }}
                    />
                    {option.pin_group_name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 버튼 영역 */}
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
