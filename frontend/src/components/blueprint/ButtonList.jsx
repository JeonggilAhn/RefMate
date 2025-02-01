import React from 'react';
import styled from 'styled-components';
import NoteIcon from '../../assets/icons/NoteButton.svg';
import ImageIcon from '../../assets/icons/ImageButton.svg';
import InfoPlusIcon from '../../assets/icons/InfoPlusButton.svg';

const ButtonGroup = () => {
  return (
    <GroupContainer>
      <Button>
        <Icon src={NoteIcon} alt="Note Button" />
      </Button>
      <Button>
        <Icon src={ImageIcon} alt="Image Button" />
      </Button>
      <Button>
        <Icon src={InfoPlusIcon} alt="Info Plus Button" />
      </Button>
    </GroupContainer>
  );
};

export default ButtonGroup;

const GroupContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 60px;
  height: 20px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50px;
  flex-shrink: 0;
  padding: 2px; /* 패딩 조정 */
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px; /* 버튼 크기 증가 */
  height: 16px;
  background: rgba(255, 254, 254, 0.52);
  border-radius: 50%;
  flex-shrink: 0;
  cursor: pointer;
`;

const Icon = styled.img`
  width: 12px; /* 아이콘 크기 증가 */
  height: 12px;
  object-fit: contain;
  filter: brightness(0) invert(1); /* Icon 색상을 흰색으로 변환 */
`;
