import React from 'react';
import Icon from '../common/Icon';

const ButtonGroup = ({ onNoteClick, onImgClick, onClickInfoButton }) => {
  return (
    <div className="flex items-center justify-between w-15 h-5 bg-black/40 rounded-full p-0.5 shrink-0">
      <button
        onClick={onNoteClick}
        className="flex items-center justify-center w-4 h-4 bg-white/50 rounded-full shrink-0 cursor-pointer"
      >
        <Icon name="IconTbNotes" width={12} height={12} />
      </button>
      <button
        onClick={onImgClick}
        className="flex items-center justify-center w-4 h-4 bg-white/50 rounded-full shrink-0 cursor-pointer"
      >
        <Icon name="IconTbPhoto" width={12} height={12} />
      </button>
      <button
        className="flex items-center justify-center w-4 h-4 bg-white/50 rounded-full shrink-0 cursor-pointer"
        onClick={onClickInfoButton}
      >
        <Icon name="IconGoInfo" width={12} height={12} />
      </button>
    </div>
  );
};

export default ButtonGroup;
