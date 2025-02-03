import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NoteButton from './NoteButton';
import { get } from '../../api';
import NoteCreation from '../../assets/icons/NoteCreation.svg';
import Search from '../../assets/icons/Search.svg';
import CreateNote from './CreateNote';
import NoteSearch from './NoteSearch';

const PinNotes = ({ pinId, onClose }) => {
  const [notesWithPins, setNotesWithPins] = useState([]);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchNotesWithPins = async () => {
      try {
        const notesResponse = await get(`pins/${pinId}/notes`);
        const notes = notesResponse.data.content.note_list;

        const notesPromises = notes.map(async (pin) => {
          const notesResponse = await get(`pins/${pin.pin_id}/notes`);
          const notes = notesResponse.data.content.note_list;

          return notes.map((note) => ({
            ...note,
            preview_image_list: pin.preview_image_list, // 노트에 이미지 정보 추가
          }));
        });

        const allNotesArray = await Promise.all(notesPromises);
        const allNotesWithPins = allNotesArray.flat();

        const sortedNotes = allNotesWithPins.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        setNotesWithPins(sortedNotes);
      } catch (error) {
        console.error('핀 및 노트 데이터 로드 실패:', error);
        setNotesWithPins([]);
      }
    };

    fetchNotesWithPins();
  }, [pinId]);

  const handleCreateNote = () => {
    setShowCreateNote(true); // 버튼 클릭 시 CreateNote 컴포넌트를 보여줌
  };

  const handleIconClick = () => {
    setIsSearching((prev) => !prev);
  };

  return (
    <Container>
      <div className="flex justify-between border">
        <button onClick={handleCreateNote}>
          <img src={NoteCreation} alt="create note" />
        </button>
        <h3>🔵 핀 이름</h3>
        {!onClose && (
          <button onClick={handleIconClick}>
            <img src={Search} alt="search" />
          </button>
        )}

        {onClose && (
          <button onClick={onClose} className="text-gray-500">
            닫기
          </button>
        )}
      </div>

      <NotesContainer>
        {notesWithPins.map((note) => (
          <NoteWithPinWrapper key={note.note_id}>
            <NoteButton note={note} />
          </NoteWithPinWrapper>
        ))}
      </NotesContainer>
      {showCreateNote && (
        <CreateNote closeModal={() => setShowCreateNote(false)} />
      )}
      {isSearching && <NoteSearch />}
    </Container>
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

const NotesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  padding: 1rem;
  gap: 0.75rem;
  max-height: calc(100% - 3rem);
  box-sizing: border-box;
`;

const NoteWithPinWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;
