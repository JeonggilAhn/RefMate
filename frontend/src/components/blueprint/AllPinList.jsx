import React from 'react';
import Icon from '../common/Icon';
import EditOption from '../project/EditOption';

const AllPinList = ({
  data,
  isActiveTab,
  pinActiveActions,
  pinInactiveActions,
  togglePinVisible,
}) => {
  return data.map((pin) => (
    <div
      key={pin.pin_id}
      className="flex items-center justify-between bg-gray-100 rounded-md p-2 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <span className="text-gray-600">{pin.icon}</span>
        <button onClick={() => togglePinVisible(pin.pin_id)}>
          {pin.is_visible ? (
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
        <span className="w-[13.8rem] text-sm font-medium">{pin.pin_name}</span>
      </div>
      <EditOption
        actions={
          isActiveTab
            ? pinActiveActions(pin.pin_id)
            : pinInactiveActions(pin.pin_id)
        }
      />
    </div>
  ));
};

export default AllPinList;
