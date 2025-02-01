import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { get } from '../../api';
import ImageIcon from '../../assets/icons/ImageButton.svg';

const ImportantNoteList = ({ blueprintId, blueprintVersion }) => {
  const [notes, setNotes] = useState([]); // 노트 데이터를 관리하는 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  // 데이터 가져오기
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await get(
          `blueprints/${blueprintId}/${blueprintVersion}/notes/bookmark`,
        ); // API 호출
        setNotes(response.data); // 데이터 저장
      } catch (error) {
        console.error('데이터 로드 실패:', error); // 오류 처리
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchNotes();
  }, [blueprintId, blueprintVersion]); // 의존성 배열에 ID와 버전 추가

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
                {note.image_preview && (
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

const Container = styled.div`
  width: 284px;
  height: 168px;
  flex-shrink: 0;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  width: 284px;
  height: 32px;
  flex-shrink: 0;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
`;

const NoteList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 4px;
`;

const NoteCard = styled.div`
  width: 263px;
  height: 26px;
  flex-shrink: 0;
  background-color: #f9f9f9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  margin-bottom: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e9e9e9;
  }

  position: relative;
`;

const LeftBar = styled.div`
  width: 8px;
  height: 100%;
  border-radius: 4px 0px 0px 4px;
  background: #87b5fa;
  position: absolute;
  left: 0;
  top: 0;
`;

const NoteContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding-left: 12px;
`;

const NoteTitle = styled.span`
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NoteDate = styled.span`
  font-size: 12px;
  color: #888;
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

const Loading = styled.div`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 16px;
`;

const NoData = styled.div`
  font-size: 12px;
  color: #888;
  text-align: center;
  margin-top: 16px;
`;
