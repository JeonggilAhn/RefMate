import React from 'react';
import Icon from '../common/Icon';
import SelectBox from '../common/SelectBox';
import { SelectItem } from '@/components/ui/select';
import Slider from '../common/Slider';

const ToolbarOpacity = ({
  blueprints,
  overlayOpacity,
  isOverlayVisible,
  selectedBlueprintIndex,
  onChangeSlider,
  onClickPrevBlueprintButton,
  onSelectBlueprintVersion,
  onClickNextBlueprintButton,
}) => {
  return (
    <div className="border border-[#CBCBCB] rounded-sm absolute left-2 top-[58px] z-6 px-2 py-2 bg-[#ffffff]">
      <div className="flex items-center gap-1">
        <button
          disabled={selectedBlueprintIndex <= 0}
          className={`w-[2.4rem] h-[2.4rem] flex justify-center items-center border border-[#CBCBCB] bg-[#F5F5F5] rounded-md ${selectedBlueprintIndex <= 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={onClickPrevBlueprintButton}
        >
          <Icon name="IconGoChevronPrev" width={20} height={20} />
        </button>
        <SelectBox
          value={selectedBlueprintIndex}
          onValueChange={onSelectBlueprintVersion}
          width={40}
          placeholder={``}
        >
          {blueprints.map((print, index) => (
            <SelectItem key={print.blueprint_version_id} value={index}>
              [{print.blueprint_version_seq}] {print.blueprint_version_name}
            </SelectItem>
          ))}
        </SelectBox>

        <button
          disabled={selectedBlueprintIndex === blueprints.length - 1}
          className={`w-[2.4rem] h-[2.4rem] flex justify-center items-center border border-[#CBCBCB] bg-[#F5F5F5] rounded-md ${selectedBlueprintIndex === blueprints.length - 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={onClickNextBlueprintButton}
        >
          <Icon name="IconGoChevronNext" width={20} height={20} />
        </button>
      </div>
      <Slider
        defaultValue={[overlayOpacity]}
        max={1}
        step={0.01}
        disabled={isOverlayVisible ? false : true}
        onChangeSlider={onChangeSlider}
      />
    </div>
  );
};

export default ToolbarOpacity;
