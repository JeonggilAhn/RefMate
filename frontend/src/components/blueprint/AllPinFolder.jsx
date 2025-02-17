import React from 'react';
import Icon from '../common/Icon';
import EditOption from '../project/EditOption';

const AllPinFolder = ({
  data,
  isActiveTab,
  togglePinVisible,
  pinActiveActions,
  pinInactiveActions,
  onClickPinImage,
  setHighlightedPinId,
}) => {
  return data.map((pin, index) => {
    return (
      <div
        key={pin.pin_id}
        className="border border-[#CBCBCB] rounded-md shadow-sm cursor-pointer hover:bg-[#F1F1F1]"
        onMouseEnter={() => setHighlightedPinId(pin.pin_id)}
        onMouseLeave={() => setHighlightedPinId(null)}
      >
        <div
          className="flex items-center justify-between px-2 py-0.5 rounded-t-md"
          style={{
            backgroundColor: `${pin.pin_group?.pin_group_color}15`,
            borderBottom: `2px solid ${pin.pin_group?.pin_group_color}`,
          }}
        >
          <div className="flex items-center gap-1">
            <button onClick={() => togglePinVisible(pin.pin_id)}>
              {!isActiveTab ? null : pin.is_visible ? (
                <Icon name="IconTbEye" width={19} />
              ) : (
                <Icon name="IconTbEyeClosed" width={19} />
              )}
            </button>
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: pin.pin_group.pin_group_color,
              }}
            />
            <span className="w-18 truncate font-medium">{pin.pin_name}</span>
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
