import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NoteButton from './NoteButton';
import { get } from '../../api';
import CreateNote from './CreateNote';
import NoteSearch from './NoteSearch';
import NoteDetail from './NoteDetail';
import Icon from '../common/Icon';
import Draggable from 'react-draggable';

const processNotes = (noteList) => {
  if (!Array.isArray(noteList)) {
    throw new Error('note_list 데이터가 배열 형식이 아닙니다.');
  }

  const groupedByDate = noteList.reduce((acc, note) => {
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

  return Object.entries(groupedByDate)
    .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
    .map(([date, notes]) => ({
      date,
      notes: notes.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      ),
    }));
};

const PinNotes = ({ pinId, onClose, isSidebar }) => {
  const [notesByDate, setNotesByDate] = useState([]);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchNotesWithPins = async () => {
      try {
        const response = await get(`pins/${pinId}/notes`);
        const fetchedNotes = response.data.content?.note_list || [];
        const notesGroupedByDate = processNotes(fetchedNotes);
        setNotesByDate(notesGroupedByDate);
      } catch (error) {
        console.error('핀 및 노트 데이터 로드 실패:', error);
        setNotesByDate([]);
      }
    };

    fetchNotesWithPins();
  }, [pinId]);

  const handleCreateNote = () => {
    setShowCreateNote(true);
  };

  const handleIconClick = () => {
    setIsSearching((prev) => !prev);
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  const handleBack = () => {
    setSelectedNote(null);
  };

  return (
    <Draggable disabled={isSidebar}>
      <Container>
        {selectedNote ? (
          <NoteDetail note={selectedNote} onBack={handleBack} />
        ) : (
          <>
            <Header>
              <button onClick={handleCreateNote}>
                <Icon name="IconIoIosAddCircleOutline" width={20} height={20} />
              </button>
              <h3>🔵 핀 이름</h3>
              {!onClose && (
                <button onClick={handleIconClick}>
                  <Icon name="IconTbSearch" width={20} height={20} />
                </button>
              )}
              {onClose && (
                <button onClick={onClose} className="text-gray-500">
                  닫기
                </button>
              )}
            </Header>
            <NotesContainer>
              {notesByDate.length === 0 ? (
                <NoData>등록된 노트가 없습니다.</NoData>
              ) : (
                notesByDate.map(({ date, notes }) => (
                  <React.Fragment key={date}>
                    <DateSeparator>{date}</DateSeparator>
                    {notes.map((note) => (
                      <NoteWithPinWrapper key={note.note_id}>
                        <NoteButton
                          note={note}
                          onClick={() => handleNoteClick(note)}
                        />
                      </NoteWithPinWrapper>
                    ))}
                  </React.Fragment>
                ))
              )}
            </NotesContainer>
            {showCreateNote && (
              <CreateNote closeModal={() => setShowCreateNote(false)} />
            )}
            {isSearching && <NoteSearch />}
          </>
        )}
      </Container>
    </Draggable>
  );
};

export default PinNotes;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 0.0625rem solid #e0e0e0;
  background-color: #fff;
  height: 20rem;
  width: 100%;
  z-index: 99;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9f9f9;
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
