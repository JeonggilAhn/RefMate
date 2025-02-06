import React, { useState } from 'react';
import styled from 'styled-components';

const Tabs = ({ actions, setFilterType }) => {
  const [activeTab, setActiveTab] = useState(actions[0]?.name || '');

  return (
    <TabContainer>
      <TabGroup>
        {actions.map(({ name, type }) => (
          <Tab
            key={name}
            active={activeTab === name}
            onClick={() => {
              setActiveTab(name);
              setFilterType(type); // 선택한 필터 적용
            }}
          >
            {name}
          </Tab>
        ))}
      </TabGroup>
      <div className="border">아이콘</div>
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
