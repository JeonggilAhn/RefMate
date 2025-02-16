import React, { useState, useEffect } from 'react';
import { post, patch } from '../../api';
import { useRecoilValue } from 'recoil';
import { colorState } from '../../recoil/common/color';
import { websocketState } from '../../recoil/common/websocket';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import TextButton from '../common/TextButton';

const PinPopup = ({
  isCreate,
  blueprintId,
  blueprintVersion,
  initialPin,
  onConfirm,
}) => {
  const [pinId, setPinId] = useState(null);
  const [pinName, setPinName] = useState('');
  const [pinGroup, setPinGroup] = useState('');

  const groupOptions = useRecoilValue(colorState); // Recoil에서 컬러 데이터 가져오기
  const ws = useRecoilValue(websocketState);

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
    if (!isCreate) {
      setPinId(initialPin.pin_id);
      setPinName(initialPin.pin_name || '');
      setPinGroup(initialPin.pin_group?.pin_group_id || '');
    }
  }, [isCreate]);

  // 핀 생성 핸들러
  const handleCreatePin = async () => {
    if (!pinName.trim() || !pinGroup) return;

    try {
      post(`blueprints/${blueprintId}/${blueprintVersion}/pins`, {
        pin_name: pinName,
        pin_group_id: pinGroup,
        pin_x: initialPin.pin_x,
        pin_y: initialPin.pin_y,
      }).then((res) => {
        const {
          data: {
            content: { pin },
          },
        } = res;
        onConfirm({ ...pin, pin_x: initialPin.pin_x, pin_y: initialPin.pin_y });
        ws.send(
          `/api/blueprints/${blueprintId}/${blueprintVersion}/pins`,
          {},
          pin.pin_id,
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
      const resName = await patch(`pins/${pinId}/name`, { name: pinName });
      const resGroup = await patch(`pins/${pinId}/${blueprintVersion}/group`, {
        group: pinGroup,
      });

      let newPin = initialPin;

      if (resName.status) {
        newPin = { ...newPin, ...resName.data.content };
      }

      if (resGroup.status === 200) {
        newPin = {
          ...newPin,
          pin_group: { ...newPin.pin_group, ...resGroup.data.content },
        };
      }

      if (resName.status == 200 && resGroup.status === 200) {
        onConfirm(newPin);
      }
    } catch (error) {
      console.error('핀 수정 실패:', error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col z-50">
      {/* ColorInitializer 제거됨 (Blueprint.jsx에서 실행됨) */}
      {/* 이름 입력 */}
      <div className="mt-5 mb-4">
        <label className="block mb-1">이름</label>
        <input
          type="text"
          value={pinName}
          onChange={(e) => setPinName(e.target.value)}
          placeholder="핀 이름 입력"
          className="w-full px-3 py-2 my-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 그룹 선택 */}
      <div className="mb-4">
        <label className="block mb-1">그룹</label>
        <div className="my-2">
          <Select
            value={isCreate ? undefined : pinGroup}
            onValueChange={(value) => setPinGroup(value)}
          >
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 flex items-center gap-2 bg-white">
              <SelectValue placeholder="핀의 그룹을 선택해주세요" />
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
                      <div className="w-96 flex justify-center">
                        {option.name}
                      </div>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-gray-500">그룹 없음</div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 기존 버튼 UI 유지 (삭제된 버튼 복구) */}
      <div className="flex justify-end gap-2">
        <TextButton
          type="start"
          disabled={!pinName.trim() || !pinGroup}
          onClick={isCreate ? handleCreatePin : handleEditPin}
        >
          완료
        </TextButton>
      </div>
    </div>
  );
};

export default PinPopup;
