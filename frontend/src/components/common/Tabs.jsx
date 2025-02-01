import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSearch, FiList, FiGrid } from 'react-icons/fi';

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

const Tab = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  color: ${({ active }) => (active ? '#7ba8ec;' : '#333')};
  border-bottom: ${({ active }) => (active ? '2px solid #7BA8EC' : 'none')};

  &:hover {
    color: #7ba8ec;
  }
`;

const IconButton = styled.div`
  font-size: 20px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;

  &:hover {
    color: #7ba8ec;
  }
`;

function Tabs({ tabs, iconType }) {
  const [activeTab, setActiveTab] = useState(tabs[0]); // 탭 종류류
  // 아이콘 종류
  const renderIcon = () => {
    if (iconType === 'search') return <FiSearch />;
    if (iconType === 'list') return <FiList />;
    if (iconType === 'grid') return <FiGrid />;
    return null;
  };

  return (
    <TabContainer>
      <TabGroup>
        {tabs.map((tab) => (
          <Tab
            key={tab}
            active={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Tab>
        ))}
      </TabGroup>
      {iconType && <IconButton>{renderIcon()}</IconButton>}
    </TabContainer>
  );
}

export default Tabs;
