import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { get } from '../../api';
import ImageIcon from '../../assets/icons/ImageButton.svg';

const ImportantNoteList = ({ pinId }) => {
  const [notes, setNotes] = useState([]); // 노트 데이터를 관리하는 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  // 데이터 가져오기
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        console.log(`Fetching important notes for pinId: ${pinId}`);
        const response = await get(`pins/${pinId}/notes/bookmark`); // 엔드포인트 수정

        console.log('API 응답 데이터:', response.data); // API 응답 구조 확인

        if (
          response.data &&
          response.data.content &&
          Array.isArray(response.data.content.note_list)
        ) {
          setNotes(response.data.content.note_list); // 노트 리스트 저장
        } else {
          console.error('API 응답에 note_list가 없습니다.');
          setNotes([]); // 빈 배열 처리
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        setNotes([]); // 에러 발생 시 빈 리스트로 초기화
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [pinId]);

  // 로딩 상태
  if (loading) {
    return <Loading>Loading...</Loading>;
  }

  return (
    <Container>
      <Header>중요한 노트</Header>
      <NoteList>
        {notes.length === 0 ? (
          <NoData>등록된 노트가 없습니다.</NoData>
        ) : (
          notes.map((note) => (
            <NoteCard key={note.note_id}>
              <LeftBar />
              <NoteContent>
                <NoteTitle>{note.note_title}</NoteTitle>
                {note.is_present_image && (
                  <Icon src={ImageIcon} alt="Image Icon" />
                )}
              </NoteContent>
              <NoteDate>
                {new Date(note.created_at).toISOString().split('T')[0]}
              </NoteDate>
            </NoteCard>
          ))
        )}
      </NoteList>
    </Container>
  );
};

export default ImportantNoteList;

// ✅ `px` → `rem` 변환된 스타일 정의
const Container = styled.div`
  width: 17.75rem;
  height: 10.5rem;
  flex-shrink: 0;
  background-color: #fff;
  border: 0.0625rem solid #e0e0e0;
  border-radius: 0.25rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  width: 17.75rem;
  height: 2rem;
  flex-shrink: 0;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: bold;
  color: #333;
  border-bottom: 0.0625rem solid #e0e0e0;
`;

const NoteList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.25rem; /* 4px → 0.25rem */
`;

const NoteCard = styled.div`
  width: 16.44rem; /* 263px → 16.44rem */
  height: 1.625rem; /* 26px → 1.625rem */
  flex-shrink: 0;
  background-color: #f9f9f9;
  border-radius: 0.25rem; /* 4px → 0.25rem */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem; /* 8px → 0.5rem */
  margin-bottom: 0.25rem; /* 4px → 0.25rem */
  cursor: pointer;

  &:hover {
    background-color: #e9e9e9;
  }

  position: relative;
`;

const LeftBar = styled.div`
  width: 0.5rem;
  height: 100%;
  border-radius: 0.25rem 0 0 0.25rem;
  background: #87b5fa;
  position: absolute;
  left: 0;
  top: 0;
`;

const NoteContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding-left: 0.75rem;
`;

const NoteTitle = styled.span`
  font-size: 0.75rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NoteDate = styled.span`
  font-size: 0.75rem;
  color: #888;
`;

const Icon = styled.img`
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
`;

const Loading = styled.div`
  font-size: 0.875rem;
  color: #666;
  text-align: center;
  margin-top: 1rem;
`;

const NoData = styled.div`
  font-size: 0.75rem;
  color: #888;
  text-align: center;
  margin-top: 1rem;
`;
