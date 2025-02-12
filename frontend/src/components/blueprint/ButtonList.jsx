import React from 'react';
import Icon from '../common/Icon';

const ButtonGroup = ({ onNoteClick, onImgClick }) => {
  return (
    <div className="flex items-center justify-center gap-x-2 w-20 h-10 bg-black/40 rounded-full p-1 shrink-0">
      <button
        onClick={onNoteClick}
        className="flex items-center justify-center w-8 h-8 bg-white/70 rounded-full shrink-0 cursor-pointer"
      >
        <Icon name="IconTbNote" width={24} height={24} />
      </button>
      <button
        onClick={onImgClick}
        className="flex items-center justify-center w-8 h-8 bg-white/70 rounded-full shrink-0 cursor-pointer"
      >
        <Icon name="IconTbPhoto" width={24} height={24} />
      </button>
    </div>
  );
};

export default ButtonGroup;
