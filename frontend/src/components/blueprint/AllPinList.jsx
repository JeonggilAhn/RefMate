import React from 'react';
import Icon from '../common/Icon';
import EditOption from '../project/EditOption';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const AllPinList = ({
  data,
  isActiveTab,
  pinActiveActions,
  pinInactiveActions,
  togglePinVisible,
  onClickPin,
  onClickPinHighlightIcon,
}) => {
  return data.map((pin) => (
    <div
      key={pin.pin_id}
      className="w-full flex items-center justify-between rounded-md px-2 py-0.5 shadow-sm cursor-pointer relative group overflow-hidden"
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
      <div className="flex items-center gap-2 z-10">
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
              className="w-[13.8rem] truncate font-medium cursor-pointer"
              onClick={() => {
                onClickPinHighlightIcon(pin.pin_id);
                onClickPin(pin);
              }}
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
        actions={isActiveTab ? pinActiveActions(pin) : pinInactiveActions(pin)}
        className="z-10"
      />
    </div>
  ));
};

export default AllPinList;
