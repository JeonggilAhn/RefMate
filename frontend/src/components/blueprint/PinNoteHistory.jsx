import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NoteButton from './NoteButton';
import { get } from '../../api';
import NotePlusIconSrc from '../../assets/icons/NotePlusButton.svg';

const pin_id = 97514255; // 테스트용 핀 ID
const test_pin_name = 'Grace Gerhold'; // 테스트용 핀 이름

const PinNoteHistory = () => {
  const [notesByDate, setNotesByDate] = useState([]);

  useEffect(() => {
    const fetchNotesForPin = async () => {
      try {
        const response = await get(`pins/${pin_id}/notes`);
        const fetchedNotes = response.data.content?.note_list || [];

        // 최신순 정렬 (최신 항목이 아래로 가도록 설정)
        const sortedNotes = fetchedNotes.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        // 날짜별로 노트를 그룹화
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

        // 날짜별로 정렬된 배열 생성 (날짜 최신순 정렬)
        const notesGroupedByDate = Object.entries(groupedByDate)
          .map(([date, notes]) => ({
            date,
            notes: notes.reverse(), // 각 날짜의 노트를 최신순(역순)으로 정렬
          }))
          .reverse(); // 날짜 최신순 정렬

        setNotesByDate(notesGroupedByDate);
      } catch (error) {
        setNotesByDate([]);
      }
    };

    fetchNotesForPin();
  }, []);

  if (notesByDate.length === 0) {
    return <NoData>등록된 노트가 없습니다.</NoData>;
  }

  return (
    <Container>
      <Header>
        <NotePlusIcon src={NotePlusIconSrc} alt="노트 추가 아이콘" />
        {test_pin_name}
      </Header>
      <NotesContainer>
        {notesByDate.map(({ date, notes }) => (
          <React.Fragment key={date}>
            {/* 날짜 구분선 */}
            <DateSeparator>{date}</DateSeparator>
            {/* 해당 날짜의 노트를 최신순(역순)으로 표시 */}
            {notes.map((note) => (
              <NoteWithPinWrapper key={note.note_id}>
                <NoteButton note={{ ...note }} />
              </NoteWithPinWrapper>
            ))}
          </React.Fragment>
        ))}
      </NotesContainer>
    </Container>
  );
};

export default PinNoteHistory;

// 스타일 정의
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
  color: #333;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const NotePlusIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  left: 1rem;
  cursor: pointer;
`;

const NotesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.75rem;
  max-height: calc(100% - 3rem);
  box-sizing: border-box;
`;

const DateSeparator = styled.div`
  font-size: 0.875rem;
  font-weight: bold;
  color: #555;
  padding: 0.5rem 0;
  border-top: 1px solid #ddd;
  text-align: left;
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
