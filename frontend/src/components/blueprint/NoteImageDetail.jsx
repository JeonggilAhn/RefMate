import React, { useEffect, useState, useRef } from 'react';
import { get } from '../../api';
import Icon from '../common/Icon';
import Draggable from 'react-draggable';

const NoteImageDetail = ({ pinInfo, onClose }) => {
  const [detailPinImages, setDetailPinImages] = useState([]);

  useEffect(() => {
    const fetchImgWithPins = async () => {
      try {
        const response = await get(`pins/${pinInfo.pin_id}/images`);
        console.log('API 응답:', response.data.content);
        setDetailPinImages(
          Array.isArray(response.data.content) ? response.data.content : [],
        );
      } catch (error) {
        console.error('핀 및 노트 데이터 로드 실패:', error);
        setDetailPinImages([]);
      }
    };

    fetchImgWithPins();
  }, [pinInfo.pin_id]);

  return (
    <Draggable>
      <div className="border border-gray-300 h-auto w-80 bg-gray-100 shadow-lg">
        {/* 헤더 영역 */}
        <div className="flex border border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-center flex-grow gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: pinInfo.pin_group.pin_group_color }}
            ></div>

            <div>{pinInfo.pin_name}</div>
          </div>
          <button onClick={onClose}>
            <Icon name="IconCgClose" width={24} height={24} />
          </button>
        </div>

        {/* 노트 리스트 */}
        <div className="overflow-y-auto h-[250px]">
          {detailPinImages.map((pin) => (
            <div key={pin.note_id} className="mb-3 p-2">
              {/* 노트 제목 */}
              <div className="text-sm font-medium bg-white p-1 rounded-md shadow-sm">
                {pin.note_title}
              </div>

              {/* 이미지 리스트 */}
              <div className="grid gap-0.5 mt-2 grid-cols-3 place-items-center">
                {pin.image_list?.slice(0, 3).map((item, idx) => (
                  <div key={item.image_id} className="relative w-22 h-22">
                    <img
                      src={item.image_preview}
                      alt="reference"
                      className="w-full h-full object-cover rounded-md border"
                    />
                    {/* 북마크 아이콘 */}
                    {item.is_bookmark && (
                      <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 clip-triangle"></div>
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
      </div>
    </Draggable>
  );
};

export default NoteImageDetail;
