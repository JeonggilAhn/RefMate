import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { colorState } from '../../recoil/common/color';
import { get } from '../../api';

const ColorInitializer = ({ blueprintId }) => {
  const setColors = useSetRecoilState(colorState);

  useEffect(() => {
    if (!blueprintId) {
      return;
    }
    const fetchGroups = async () => {
      try {
        const response = await get(`blueprints/${blueprintId}/pin-groups`);
        if (response.data?.content && Array.isArray(response.data.content)) {
          const formattedColors = response.data.content.map((item) => ({
            id: item.pin_group_id,
            name: item.pin_group_name,
            color: item.pin_group_color,
          }));
          setColors(formattedColors);
        }
      } catch (error) {}
    };

    fetchGroups();
  }, [blueprintId, setColors]);

  return null;
};

export default ColorInitializer;
