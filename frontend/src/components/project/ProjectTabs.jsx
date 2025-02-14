import React, { useState } from 'react';
import styled from 'styled-components';
import SearchBar from './SearchBar';
import Icon from '../common/Icon';

const ProjectTabs = ({ actions, setFilterType, setSearchQuery }) => {
  const [activeTab, setActiveTab] = useState(actions[0]?.name || '');
  const [searchVisible, setSearchVisible] = useState(false); // SearchBar 표시 여부

  const handleSearchClick = () => {
    setSearchVisible(true); // 아이콘 클릭 시 SearchBar 보이기
  };

  const handleSearchBarClear = () => {
    setSearchVisible(false); // X 아이콘 클릭 시 SearchBar 숨기기
    setSearchQuery(''); // 검색어 초기화
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <TabContainer>
      <TabGroup>
        {actions.map(({ name, type }) => (
          <Tab
            key={name}
            active={activeTab === name}
            onClick={() => {
              setActiveTab(name);
              setFilterType(type); // 탭 클릭 시 필터 초기화
            }}
          >
            {name}
          </Tab>
        ))}
      </TabGroup>

      {/* 검색 아이콘 클릭 시 SearchBar 보이기 */}
      <SearchIconWrapper onClick={handleSearchClick}>
        {!searchVisible && <Icon name="IconTbSearch" />}
      </SearchIconWrapper>

      {/* SearchBar가 보일 때만 나타나도록 */}
      {searchVisible && (
        <SearchBar
          onSearch={handleSearch} // 검색어 처리
          onClear={handleSearchBarClear} // X 아이콘 클릭 시 SearchBar 숨기기
        />
      )}
    </TabContainer>
  );
};

export default ProjectTabs;

const Tab = styled.div.withConfig({
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
  // padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const TabGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const SearchIconWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  color: #666;

  &:hover {
    color: #7ba8ec;
  }
`;
