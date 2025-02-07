import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SelectBox = ({ width = 30, placeholder = '', children }) => {
  return (
    <Select>
      {/* todo : 고장나는 이 친구 [&_svg]:w-15 [&_svg]:h-10 */}
      <SelectTrigger className={`w-${width} pr-2`}>
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

{
  /* <Select>
                  <SelectTrigger className="w-[125px] h-[32px] bg-white border-zinc-400 text-zinc-800 focus:ring-zinc-300"> */
}
{
  /* todo : 현재 블루프린트와 일치하는 버전 노출 시키기 */
}
{
  /* <SelectValue
                      placeholder={
                        '[' +
                        blueprints[0]?.blueprint_version_seq +
                        '] ' +
                        blueprints[0]?.blueprint_version_name
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="w-[120px] bg-white border-zinc-400 text-zinc-800 break-all">
                    <SelectGroup>
                      {blueprints.map((item, index) => (
                        <SelectItem
                          key={item.blueprint_version_id}
                          value={item.blueprint_version_id}
                        >
                          [{item.blueprint_version_seq}]{' '}
                          {item.blueprint_version_name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select> */
}
