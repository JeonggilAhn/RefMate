import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSearch, FiList, FiGrid } from 'react-icons/fi';
import SearchBar from '../project/SearchBar';

const Tab = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'active', // active는 DOM에 전달되지 않도록 필터링
})`
  padding: 8px 16px;
  cursor: pointer;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  color: ${({ active }) => (active ? '#7ba8ec;' : '#333')};
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

function Tabs({ tabs, iconType, setFilterType }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isSearching, setIsSearching] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === '모든 프로젝트') {
      setFilterType('all');
    } else if (tab === '내 프로젝트') {
      setFilterType('mine');
    } else if (tab === '공유 프로젝트') {
      setFilterType('shared');
    }
  };

  // 아이콘 클릭 핸들러
  const handleIconClick = () => {
    if (iconType === 'search') {
      setIsSearching((prev) => !prev); // search일 때만 toggle
    }
  };

  // 아이콘 종류
  const renderIcon = () => {
    if (isSearching) return;
    if (iconType === 'search') return <FiSearch />;
    if (iconType === 'list') return <FiList />;
    if (iconType === 'grid') return <FiGrid />;
    return null;
  };

  // 검색 상태 종료 핸들러
  const handleClearSearch = () => {
    setIsSearching(false); // 검색 상태 종료
  };

  return (
    <TabContainer>
      <TabGroup>
        {tabs.map((tab) => (
          <Tab
            key={tab}
            active={activeTab === tab}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </Tab>
        ))}
      </TabGroup>
      <IconButton onClick={handleIconClick}>{renderIcon()}</IconButton>
      {isSearching && <SearchBar onClear={handleClearSearch} />}
    </TabContainer>
  );
}

export default Tabs;
