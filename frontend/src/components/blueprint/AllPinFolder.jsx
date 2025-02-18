import React from 'react';
import Icon from '../common/Icon';
import EditOption from '../project/EditOption';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const AllPinFolder = ({
  data,
  isActiveTab,
  togglePinVisible,
  pinActiveActions,
  pinInactiveActions,
  onClickPinImage,
  onClickPinHighlightIcon,
}) => {
  return data.map((pin, index) => {
    return (
      <div
        key={pin.pin_id}
        className="border border-[#CBCBCB] rounded-md shadow-sm cursor-pointer"
      >
        <div
          className="flex items-center justify-between pl-1 py-0.5 rounded-t-md relative group overflow-hidden border-b border-[#CBCBCB]"
          style={{
            backgroundColor: `${pin.pin_group?.pin_group_color}15`,
          }}
        >
          <div
            className="absolute inset-0 bg-current transition-all duration-300 ease-out transform translate-x-[-100%] group-hover:translate-x-0 z-0"
            style={{
              backgroundColor: pin.pin_group?.pin_group_color,
              opacity: 0.15,
            }}
          />
          <div className="flex items-center gap-1 z-10">
            <button
              disabled={!isActiveTab}
              onClick={() => togglePinVisible(pin.pin_id)}
              className={`w-7 h-7 flex items-center justify-center ${isActiveTab ? 'hover:bg-white/50 cursor-pointer rounded-full' : 'cursor-default'}`}
            >
              {!isActiveTab ? null : pin.is_visible ? (
                <Icon
                  name="IconTbPinFill"
                  width={23}
                  color={pin.pin_group?.pin_group_color}
                />
              ) : (
                <Icon name="IconBiBlock" width={20} color="#414141" />
              )}
            </button>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  className="w-23 truncate font-medium"
                  onClick={() => onClickPinHighlightIcon(pin.pin_id)}
                >
                  {pin.pin_name}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{pin.pin_name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <EditOption
            actions={
              isActiveTab ? pinActiveActions(pin) : pinInactiveActions(pin)
            }
          />
        </div>

        {!pin.preview_image_list.length ? (
          <div className="grid grid-cols-1 grid-rows-1 gap-rows-1 place-items-center p-2">
            <div className="w-full h-[8rem] flex items-center justify-center text-gray-400 bg-gray-100 rounded-md">
              No image
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 grid-row-2 gap-1 place-items-center p-2">
            {pin.preview_image_list.map((item, idx) => {
              return (
                <div
                  key={item.image_id}
                  className="relative"
                  onClick={() => onClickPinImage(pin.preview_image_list)}
                >
                  <img
                    src={item.image_preview}
                    alt="reference"
                    className="w-[4rem] h-[4rem] object-cover rounded-md shadow-2xs"
                  />
                  {item.image_id && item.is_bookmark && (
                    <div className="absolute top-0 right-0 w-4 h-4 bg-[#87B5FA] clip-triangle"></div>
                  )}
                  {idx === 3 && pin.preview_image_list.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm font-semibold rounded-md">
                      +{pin.preview_image_list.length - 4}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  });
};

export default AllPinFolder;
