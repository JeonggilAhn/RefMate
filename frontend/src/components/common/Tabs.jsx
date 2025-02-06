import React, { useState } from 'react';
import styled from 'styled-components';
import Icon from '../common/Icon';

const Tabs = ({ actions }) => {
  // 첫 번째 탭을 기본값으로 설정
  const [activeTab, setActiveTab] = useState(actions[0]?.name || '');

  return (
    <TabContainer>
      <TabGroup>
        {actions.map(({ name, handler }) => (
          <Tab
            key={name}
            active={activeTab === name}
            onClick={() => {
              setActiveTab(name);
              handler();
            }}
          >
            {name}
          </Tab>
        ))}
      </TabGroup>
      <Icon name="IconTbSearch" />
    </TabContainer>
  );
};

export default Tabs;

const Tab = styled.div.withConfig({
  // active 속성이 DOM에 전달되지 않도록 필터링
  shouldForwardProp: (prop) => prop !== 'active',
})`
  padding: 8px 16px;
  cursor: pointer;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  color: ${({ active }) => (active ? '#7ba8ec' : '#333')};
  border-bottom: ${({ active }) => (active ? '2px solid #7BA8EC' : 'none')};

  &:hover {
    color: #7ba8ec;
  }
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const TabGroup = styled.div`
  display: flex;
  gap: 10px;
`;
