import * as ICONS from '../../assets/icons/index';

const Icon = ({
  name,
  width = 30,
  height = 30,
  isActive = true,
  color = '#414141',
  ...props
}) => {
  const IconComponent = ICONS[name];

  // 아이콘 컴포넌트가 없을 때는 렌더링하지 않음
  if (!IconComponent) {
    console.warn(`❗ Icon "${name}" not found.`);
    return null;
  }

  return (
    <IconComponent
      width={width}
      height={height}
      style={isActive ? { color } : { color: '#898989' }}
      {...props}
    />
  );
};

export default Icon;
