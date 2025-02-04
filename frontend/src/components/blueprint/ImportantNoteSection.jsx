import React, { useState } from 'react';
import styled from 'styled-components';
import ImportantNoteList from './ImportantNoteList';
import NoteDetail from '../blueprint/NoteDetail'; // NoteDetail 불러오기

const ImportantNoteSection = () => {
  const pinId = 70281145; // 고정된 핀 ID
  const [selectedNoteId, setSelectedNoteId] = useState(null); // 선택된 note_id 상태

  const handleNoteClick = (noteId) => {
    setSelectedNoteId(noteId); // 선택된 note_id 설정
  };

  const handleBack = () => {
    setSelectedNoteId(null); // NoteDetail 닫기
  };

  return (
    <SectionContainer>
      <Header>중요한 노트</Header>
      {selectedNoteId ? (
        <NoteDetail noteId={selectedNoteId} onBack={handleBack} />
      ) : (
        <ImportantNoteList pinId={pinId} onNoteClick={handleNoteClick} />
      )}
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
