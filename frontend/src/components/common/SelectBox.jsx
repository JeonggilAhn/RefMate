import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SelectBox = ({
  width = 30,
  placeholder = '',
  value,
  onValueChange,
  children,
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      {/* todo : 고장나는 이 친구 [&_svg]:w-15 [&_svg]:h-10 */}
      <SelectTrigger
        className={`w-${width} pr-2 border-[#CBCBCB] ring-2 ring-[#F1F1F1]`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className={`w-${width} bg-white border-zinc-400 text-zinc-800 break-all`}
        style={{
          position: 'absolute',
          zIndex: 100,
        }}
      >
        {children}
      </SelectContent>
    </Select>
  );
};

export default SelectBox;
