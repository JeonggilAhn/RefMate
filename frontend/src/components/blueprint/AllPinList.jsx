import React from 'react';
import Icon from '../common/Icon';
import EditOption from '../project/EditOption';

const AllPinList = ({
  data,
  isActiveTab,
  pinActiveActions,
  pinInactiveActions,
  togglePinVisible,
  onClickPin,
}) => {
  return data.map((pin) => (
    <div
      key={pin.pin_id}
      className="w-full flex items-center justify-between bg-[#F1F1F1] rounded-md px-2 py-0.5 shadow-sm cursor-pointer hover:bg-black/10"
      onClick={() => onClickPin(pin)}
    >
      <div className="flex items-center gap-2">
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
        <span className="w-[13.8rem] text-sm font-medium">{pin.pin_name}</span>
      </div>
      <EditOption
        actions={isActiveTab ? pinActiveActions(pin) : pinInactiveActions(pin)}
      />
    </div>
  ));
};

export default AllPinList;
