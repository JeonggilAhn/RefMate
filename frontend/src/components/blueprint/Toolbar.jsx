import React from 'react';
import Icon from '../common/Icon';

const Toolbar = ({
  isSidebarOpen,
  isDetailSidebarOpen,
  isOverlayVisible,
  isPinButtonEnaled,
  onClickPinButton,
  onClickMouseButon,
  toggleOverlayVisible,
  openBlueprintVersion,
  openNoteHistory, // NoteHistory 팝업용 토글 함수
}) => {
  return (
    <div
      className={`flex justify-between border w-[13.4rem] border-[#CBCBCB] absolute left-[45%] bottom-4 p-[0.2rem] bg-white rounded-md`}
    >
      <button
        className={`w-[2.4rem] h-[2.4rem] flex justify-center items-center cursor-pointer hover:bg-[#F1F1F1] rounded-md ${
          isPinButtonEnaled ? 'bg-[#B0CFFF]' : ''
        }`}
        onClick={onClickPinButton}
      >
        <Icon
          name="IconTbPinStroke"
          width={30}
          height={30}
          color={isPinButtonEnaled ? '#ffffff' : '#414141'}
        />
      </button>
      <button
        className={`w-[2.4rem] h-[2.4rem] flex justify-center items-center cursor-pointer hover:bg-[#F1F1F1] rounded-md ${
          !isPinButtonEnaled ? 'bg-[#B0CFFF]' : ''
        }`}
        onClick={onClickMouseButon}
      >
        <Icon
          name="IconBsCursor"
          width={25}
          height={25}
          color={!isPinButtonEnaled ? '#ffffff' : '#414141'}
        />
      </button>
      <button
        className={`w-[2.4rem] h-[2.4rem] flex justify-center items-center cursor-pointer hover:bg-[#F1F1F1] rounded-md`}
        onClick={openBlueprintVersion}
      >
        <Icon name="IconBsLayers" width={25} height={25} />
      </button>
      <button
        className={`w-[2.4rem] h-[2.4rem] flex justify-center items-center cursor-pointer hover:bg-[#F1F1F1] rounded-md ${
          isOverlayVisible ? 'bg-[#B0CFFF]' : 'bg-[#ffffff]'
        }`}
        onClick={toggleOverlayVisible}
      >
        {isOverlayVisible ? (
          <Icon
            name="IconTbEye"
            color={isOverlayVisible ? '#ffffff' : '#414141'}
          />
        ) : (
          <Icon name="IconTbEyeClosed" />
        )}
      </button>
      <button
        className={`w-[2.4rem] h-[2.4rem] flex justify-center items-center cursor-pointer hover:bg-[#F1F1F1] rounded-md`}
        onClick={openNoteHistory}
      >
        <Icon name="IconTbSearch" width={25} height={25} />
      </button>
    </div>
  );
};

export default Toolbar;
