import React, { useEffect, useState, useRef, memo } from 'react';
import { get } from '../../api';
import Icon from '../common/Icon';
import Draggable from 'react-draggable';

const PinImagePopup = memo(function PinImagePopup({ detailPinImages }) {
  return (
    <div className="overflow-y-auto h-[17.3rem]">
      {detailPinImages.map((pin) => (
        <div key={pin.note_id} className="p-2">
          {/* 노트 제목 */}
          <div className="border border-[#CBCBCB] text-sm font-medium bg-white p-1 rounded-md shadow-sm">
            {pin.note_title}
          </div>

          {/* 이미지 리스트 */}
          <div className="grid gap-2 mt-2 grid-cols-3 place-items-center">
            {pin.image_list?.slice(0, 3).map((item, idx) => (
              <div key={item.image_id} className="relative w-22 h-22">
                <img
                  src={item.image_preview}
                  alt="reference"
                  className="w-full h-full object-cover rounded-md"
                />
                {/* 북마크 아이콘 */}
                {item.is_bookmark && (
                  <div
                    className="absolute top-0 right-0 w-4 h-4 clip-triangle"
                    style={{ backgroundColor: '#87b5fa' }}
                  />
                )}
                {/* 추가 이미지 개수 표시 */}
                {idx === 2 && pin.image_list.length > 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm font-semibold rounded-md">
                    +{pin.image_list.length - 3}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

function NoteImageDetail({ pinInfo, onClose }) {
  const [detailPinImages, setDetailPinImages] = useState([]);
  const dragRef = useRef(null);

  useEffect(() => {
    async function fetchImgWithPins() {
      try {
        const response = await get(`pins/${pinInfo.pin_id}/images`);
        const { content } = response.data;
        setDetailPinImages(Array.isArray(content) ? content : []);
      } catch (error) {
        console.error('핀 및 노트 데이터 로드 실패:', error);
        setDetailPinImages([]);
      }
    }
    if (pinInfo?.pin_id) {
      fetchImgWithPins();
    }
  }, [pinInfo.pin_id]);

  return (
    <Draggable nodeRef={dragRef}>
      <div
        ref={dragRef}
        className="border border-[#CBCBCB] h-[350px] w-[320px] bg-[#F5F5F5] rounded-lg shadow-md prevent-zoom"
      >
        {/* 헤더 영역 */}
        <div className="flex p-2 border-b border-[#CBCBCB] rounded-t-lg bg-white">
          <div className="flex items-center justify-center flex-grow gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: pinInfo.pin_group.pin_group_color }}
            />
            <div>{pinInfo.pin_name}</div>
          </div>
          <button onClick={onClose}>
            <Icon name="IconCgClose" width={20} height={20} />
          </button>
        </div>
        <PinImagePopup detailPinImages={detailPinImages} />
      </div>
    </Draggable>
  );
}

export default memo(NoteImageDetail);
