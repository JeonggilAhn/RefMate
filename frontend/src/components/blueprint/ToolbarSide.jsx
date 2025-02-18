import React from 'react';
import Icon from '../common/Icon';

const ToolbarSide = ({
  isSidebarOpen,
  toggleSidebar,
  toggleAllPinVisible,
  closeAllNotePopup,
  closeAllImagePopup,
}) => {
  return (
    <div
      className={`fixed top-[48px] right-0 z-10 p-1 flex justify-between items-center border border-[#CBCBCB] rounded-md m-1.5 bg-white transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-[21.2rem]' : 'w-[11.8rem]'}`}
    >
      <button
        onClick={toggleSidebar}
        className="w-[2.4rem] h-[2.4rem] flex justify-center items-center rounded-md cursor-pointer hover:bg-[#F1F1F1]"
      >
        <Icon name="IconLuPanelRight" width={24} height={24} />
      </button>
      <div className="flex gap-2">
        <button
          onClick={toggleAllPinVisible}
          className="w-[2.4rem] h-[2.4rem] flex justify-center items-center rounded-md cursor-pointer hover:bg-[#F1F1F1] pr-1"
        >
          <Icon name="IconTbPinStroke" width={28} height={28} />
        </button>
        <button
          onClick={closeAllNotePopup}
          className="w-[2.4rem] h-[2.4rem] flex justify-center items-center rounded-md cursor-pointer hover:bg-[#F1F1F1]"
        >
          <Icon name="IconTbNote" width={26} height={26} />
        </button>
        <button
          onClick={closeAllImagePopup}
          className="w-[2.4rem] h-[2.4rem] flex justify-center items-center rounded-md cursor-pointer hover:bg-[#F1F1F1]"
        >
          <Icon name="IconTbPhoto" width={24} height={24} />
        </button>
      </div>
    </div>
  );
};

export default ToolbarSide;
