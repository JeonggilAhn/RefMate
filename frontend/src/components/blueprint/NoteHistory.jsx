import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NoteButton from './NoteButton';
import { get } from '../../api';

const NoteHistory = ({ blueprintId, blueprintVersion }) => {
  const [notesWithPins, setNotesWithPins] = useState([]);

  useEffect(() => {
    const fetchNotesWithPins = async () => {
      try {
        const pinResponse = await get(
          `blueprints/${blueprintId}/${blueprintVersion}/pins`,
        );
        const pins = pinResponse.data.content;

        const notesPromises = pins.map(async (pin) => {
          const notesResponse = await get(`pins/${pin.pin_id}/notes`);
          const notes = notesResponse.data.content.note_list || [];

          return notes.map((note) => ({
            ...note,
            pin_name: pin.pin_name, // 핀 이름 포함
            preview_image_list: pin.preview_image_list || [], // 노트에 이미지 정보 추가
          }));
        });

        const allNotesArray = await Promise.all(notesPromises);
        const allNotesWithPins = allNotesArray.flat();

        // ✅ created_at 기준으로 최신순 정렬 유지
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
  }, [blueprintId, blueprintVersion]);

  if (notesWithPins.length === 0) {
    return <NoData>등록된 노트가 없습니다.</NoData>;
  }

  return (
    <Container>
      <Header>전체 노트</Header>
      <NotesContainer>
        {notesWithPins.map((note) => (
          <NoteWithPinWrapper key={note.note_id}>
            <PinName>{note.pin_name}</PinName>
            <NoteButton note={note} />
          </NoteWithPinWrapper>
        ))}
      </NotesContainer>
    </Container>
  );
};

export default NoteHistory;

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

const PinName = styled.div`
  font-size: 0.65rem;
  font-weight: bold;
  color: #555;
  text-align: left;
  margin-left: 3rem;
`;

const NoData = styled.div`
  font-size: 1rem;
  color: #999;
  text-align: center;
`;
