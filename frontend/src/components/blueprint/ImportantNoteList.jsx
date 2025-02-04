import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { get } from '../../api';
import ImageIcon from '../../assets/icons/ImageButton.svg';

const ImportantNoteList = ({ pinId, onNoteClick }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await get(`pins/${pinId}/notes/bookmark`);
        if (
          response.data &&
          response.data.content &&
          Array.isArray(response.data.content.note_list)
        ) {
          const sortedNotes = response.data.content.note_list
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .reverse();
          setNotes(sortedNotes);
        } else {
          setNotes([]);
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [pinId]);

  if (loading) {
    return <Loading>Loading...</Loading>;
  }

  if (notes.length === 0) {
    return <NoData>등록된 노트가 없습니다.</NoData>;
  }

  return (
    <Container>
      {notes.map((note) => (
        <NoteCard key={note.note_id} onClick={() => onNoteClick(note.note_id)}>
          <LeftBar />
          <NoteContent>
            <NoteTitle>{note.note_title}</NoteTitle>
            {note.is_present_image && <Icon src={ImageIcon} alt="Image Icon" />}
          </NoteContent>
          <NoteDate>{formatDate(note.created_at)}</NoteDate>
        </NoteCard>
      ))}
    </Container>
  );
};

export default ImportantNoteList;

// 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 15rem;
  overflow-y: auto;
  padding: 0.5rem;
  box-sizing: border-box;
`;

const NoteCard = styled.div`
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  cursor: pointer;
  border-left: 0.25rem solid #87b5fa;

  &:hover {
    background-color: #e9e9e9;
  }
`;

const NoteContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
`;

const NoteTitle = styled.span`
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
  color: #333;
`;

const NoteDate = styled.span`
  font-size: 0.875rem;
  color: #888;
  white-space: nowrap;
`;

const Icon = styled.img`
  width: 1.25rem;
  height: 1.25rem;
`;

const LeftBar = styled.div`
  width: 0.25rem;
  height: 100%;
  background-color: #87b5fa;
  border-radius: 0.25rem 0 0 0.25rem;
`;

const Loading = styled.div`
  font-size: 0.875rem;
  text-align: center;
`;

const NoData = styled.div`
  font-size: 0.875rem;
  text-align: center;
  color: #888;
`;
