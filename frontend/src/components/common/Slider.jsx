import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils'; // Shadcn에서 제공하는 클래스 병합 함수

const Slider = React.forwardRef(
  ({ className, onChangeSlider, disabled, ...props }, ref) => {
    return (
      <SliderPrimitive.Root
        ref={ref}
        disabled={disabled}
        className={cn(
          'relative flex items-center select-none touch-none w-full h-6',
          className,
        )}
        {...props}
        onValueChange={onChangeSlider}
      >
        {/* 슬라이더 바 (전체) */}
        <SliderPrimitive.Track className="relative w-full h-1.5 bg-gray-300 rounded-full">
          {/* 슬라이더 진행 바 (채워진 부분) */}
          <SliderPrimitive.Range className="absolute h-full bg-[#87B5FA] rounded-full" />
        </SliderPrimitive.Track>

        {/* 슬라이더 핸들 */}
        <SliderPrimitive.Thumb className="block w-4 h-4 bg-white border border-gray-400 rounded-full shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-1 focus:ring-[#F5F5F5]" />
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

export default Slider;
