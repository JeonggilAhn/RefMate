import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NoteButton from './NoteButton';
import { get } from '../../api';

const PinNotes = ({ pinId }) => {
  const [notesWithPins, setNotesWithPins] = useState([]);
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

  if (notesWithPins.length === 0) {
    return <NoData>등록된 노트가 없습니다.</NoData>;
  }

  return (
    <Container>
      <div className="flex justify-between border">
        <div className="border">+</div>
        <h3>🔵 핀 이름</h3>
        <div className="border">search</div>
      </div>

      <NotesContainer>
        {notesWithPins.map((note) => (
          <NoteWithPinWrapper key={note.note_id}>
            <NoteButton note={note} />
          </NoteWithPinWrapper>
        ))}
      </NotesContainer>
    </Container>
  );
};

export default PinNotes;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 0.0625rem solid #e0e0e0;
  background-color: #fff;
  height: 100%;
  max-height: 20rem;
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

const NoData = styled.div`
  font-size: 1rem;
  color: #999;
  text-align: center;
`;
