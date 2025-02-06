import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiSearch } from 'react-icons/fi';

const SearchBar = ({ onClear, onSearch }) => {
  const [query, setQuery] = useState(''); // 입력값을 관리할 상태

  // 검색어 입력값 변경 시 상태 업데이트
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // X 아이콘 클릭 시 입력값 초기화
  const handleClear = () => {
    setQuery('');
    onClear && onClear(); // onClear 콜백 호출 (있으면)
  };

  // 검색 아이콘 클릭 시 검색어 처리
  const handleSearch = () => {
    if (onSearch) {
      onSearch(query); // 검색어를 외부로 전달
    }
  };

  return (
    <SearchWrapper>
      <Input
        type="text"
        placeholder="Search"
        value={query}
        onChange={handleInputChange}
      />
      <IconWrapper onClick={handleClear}>
        <FiX />
      </IconWrapper>
      <IconWrapper onClick={handleSearch}>
        <FiSearch />
      </IconWrapper>
    </SearchWrapper>
  );
};

export default SearchBar;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  width: 200px;
  height: 40px;
  border: 1px solid #ccc;
`;

const Input = styled.input`
  border: none;
  outline: none;
  background: transparent;
  padding: 5px;
  width: 100%;
`;

const IconWrapper = styled.div`
  font-size: 18px;
  display: flex;
  align-items: center;
  padding: 2px;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #7ba8ec;
  }
`;
