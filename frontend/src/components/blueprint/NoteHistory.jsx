import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NoteButton from './NoteButton';
import { get } from '../../api';
import Search from '../../assets/icons/Search.svg';
import NoteSearch from './NoteSearch';

const BLUEPRINT_ID = '6430550723600965';
const BLUEPRINT_VERSION = '1287663269766013';

const processNotes = (noteList) => {
  if (!Array.isArray(noteList)) {
    throw new Error('note_list 데이터가 배열 형식이 아닙니다.');
  }

  const sortedNotes = noteList.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const groupedByDate = sortedNotes.reduce((acc, note) => {
    const date = new Date(note.created_at).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(note);
    return acc;
  }, {});

  // 그룹화된 데이터를 배열로 변환
  return Object.entries(groupedByDate)
    .map(([date, notes]) => ({
      date,
      notes: notes.reverse(), // 최신순으로 정렬
    }))
    .reverse(); // 날짜 최신순 정렬
};

const NoteHistory = () => {
  const [notesByDate, setNotesByDate] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const apiUrl = `blueprints/${BLUEPRINT_ID}/${BLUEPRINT_VERSION}/notes`;
        const response = await get(apiUrl);
        const noteList = response.data.content?.note_list || [];
        const notesGroupedByDate = processNotes(noteList);
        setNotesByDate(notesGroupedByDate);
      } catch (error) {
        console.error('❌ 노트 데이터 로드 실패:', error.message);
        if (error.response?.status === 404) {
          setErrorMessage('해당 데이터를 찾을 수 없습니다. URL을 확인하세요.');
        } else {
          setErrorMessage('노트를 불러오는 데 실패했습니다.');
        }
      }
    };

    fetchNotes();
  }, []);

  const handleSearchToggle = () => {
    setIsSearching((prev) => !prev);
  };

  if (errorMessage) {
    return <NoData>{errorMessage}</NoData>;
  }

  return (
    <Container>
      <Header>
        전체 노트
        <SearchButton onClick={handleSearchToggle}>
          <img src={Search} alt="search" />
        </SearchButton>
      </Header>
      {isSearching ? (
        <NoteSearch />
      ) : (
        <NotesContainer>
          {notesByDate.length === 0 ? (
            <NoData>등록된 노트가 없습니다.</NoData>
          ) : (
            notesByDate.map(({ date, notes }) => (
              <React.Fragment key={date}>
                <DateSeparator>{date}</DateSeparator>
                {notes.map((note) => (
                  <NoteWithPinWrapper key={note.note_id}>
                    <NoteButton note={note} />
                  </NoteWithPinWrapper>
                ))}
              </React.Fragment>
            ))
          )}
        </NotesContainer>
      )}
    </Container>
  );
};

export default NoteHistory;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 0.0625rem solid #e0e0e0;
  border-radius: 0.5rem;
  background-color: #fff;
  height: 100%;
  max-height: 20rem;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f9f9f9;
  padding: 1rem;
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const NotesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.75rem;
`;

const DateSeparator = styled.div`
  font-size: 0.875rem;
  font-weight: bold;
  color: #555;
  padding: 0.5rem 0;
  border-top: 1px solid #ddd;
`;

const NoteWithPinWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const NoData = styled.div`
  font-size: 1rem;
  color: #999;
  text-align: center;
`;
