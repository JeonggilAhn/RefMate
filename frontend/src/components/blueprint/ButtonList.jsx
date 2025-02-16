import React from 'react';
import Icon from '../common/Icon';

const ButtonGroup = ({
  isNoteOpen,
  isImageOpen,
  onNoteClick,
  onImgClick,
  onInfoClick,
}) => {
  return (
    <div className="flex items-center justify-center gap-x-2 w-32 h-11 bg-black/40 rounded-full p-1 z-1 shrink-0">
      <button
        onClick={onNoteClick}
        className={`flex items-center justify-center w-8 h-8 ${isNoteOpen ? 'bg-[#B0CFFF]' : 'bg-white/70'} rounded-full shrink-0 z-1 cursor-pointer`}
      >
        <Icon
          name="IconTbNote"
          width={24}
          height={24}
          color={isNoteOpen ? '#ffffff' : '#414141'}
        />
      </button>
      <button
        onClick={onImgClick}
        className={`flex items-center justify-center w-8 h-8 ${isImageOpen ? 'bg-[#B0CFFF]' : 'bg-white/70'} rounded-full shrink-0 z-1 cursor-pointer`}
      >
        <Icon
          name="IconTbPhoto"
          width={24}
          height={24}
          color={isImageOpen ? '#ffffff' : '#414141'}
        />
      </button>
      <button
        onClick={onInfoClick}
        className="flex items-center justify-center w-8 h-8 bg-white/70 rounded-full shrink-0 cursor-pointer"
      >
        <Icon name="IconGoInfo" width={24} height={24} />
      </button>
    </div>
  );
};

export default ButtonGroup;
