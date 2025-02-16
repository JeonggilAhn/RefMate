import React, { useEffect, useState, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { pinState } from '../../recoil/blueprint';

const PinImageSection = ({ pinId, onClickImage }) => {
  const bottomRef = useRef(null);
  const [pins, setPins] = useRecoilState(pinState);
  const [data, setData] = useState({ pinDetailImages: [] });

  useEffect(() => {
    const pin = pins.find((item) => item.pin_id === pinId) || {
      pinDetailImages: [],
    };
    setData(pin);
  }, [pinId, pins]);

  return (
    <div className="relative border border-[#CBCBCB] rounded-lg shadow-md bg-white h-[250px]">
      <div className="sticky text-center p-2 border-b border-[#CBCBCB] top-0 w-full rounded-t-lg bg-[#F5F5F5]">
        레퍼런스
      </div>
      <div ref={bottomRef} className="h-50 overflow-y-auto p-2">
        {data.pinDetailImages.map((pin) => {
          const images = pin.image_list.slice(0, 3); // 최대 3개 표시
          return (
            <div key={pin.note_id} className="mb-2">
              <div className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-md">
                {pin.note_title}
              </div>
              <div className="grid gap-1 mt-2 grid-cols-3 place-items-center">
                {images.map((item, idx) => (
                  <div
                    key={item.image_id}
                    className="relative w-[6.1rem] h-[6.1rem]"
                    onClick={() => onClickImage(pin.image_list, idx)}
                  >
                    <img
                      src={item.image_preview}
                      alt="reference"
                      className="w-full h-full object-cover rounded-md"
                    />
                    {item.is_bookmark && (
                      <div
                        className="absolute top-0 right-0 w-4 h-4 clip-triangle"
                        style={{ backgroundColor: '#87b5fa' }}
                      ></div>
                    )}
                    {idx === 2 && pin.image_list.length > 3 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm font-semibold rounded-md">
                        +{pin.preview_image_list.length - 3}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PinImageSection;
