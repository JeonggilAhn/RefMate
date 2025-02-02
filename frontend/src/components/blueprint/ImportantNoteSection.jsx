import React from 'react';
import styled from 'styled-components';
import ImportantNoteList from './ImportantNoteList';

const ImportantNoteSection = () => {
  const pinId = 70281145; // 고정된 핀 ID (나중에 props로 전달 가능)

  return (
    <SectionContainer>
      <Header>중요한 노트</Header>
      <ImportantNoteList pinId={pinId} />
    </SectionContainer>
  );
};

export default ImportantNoteSection;

// 스타일 정의
const SectionContainer = styled.div`
  width: 100%;
  max-width: 30rem;
  margin: 0 auto;
  padding: 1rem;
  border: 0.0625rem solid #e0e0e0;
  border-radius: 0.5rem;
  background-color: #fff;
`;

const Header = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;
