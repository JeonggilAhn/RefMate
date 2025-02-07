import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { get, del, patch } from '../../api'; // PATCH 추가
import { useRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';
import Confirm from '../../components/common/Confirm';
import Icon from '../common/Icon';
import EditNote from './EditNote'; // 수정 컴포넌트 추가
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Avatar 컴포넌트 추가

const NoteDetail = ({ noteId, onBack }) => {
  const [noteData, setNoteData] = useState(null);
  const [modal, setModal] = useRecoilState(modalState);
  const [isBookmark, setIsBookmark] = useState(false); // 북마크 상태
  const [editModal, setEditModal] = useState(false); // 수정 모달 상태 추가

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await get(`notes/${noteId}`);
        const note = response.data.content.note;
        setNoteData(note);
        setIsBookmark(note.is_bookmark); // 초기 북마크 상태 설정
      } catch (error) {
        console.error('Failed to fetch note:', error);
      }
    };

    fetchNote();
  }, [noteId]);

  // 데이터 로딩 전이면 아무것도 렌더링하지 않음
  if (!noteData) {
    return null;
  }

  const {
    note_writer,
    note_title,
    note_content,
    created_at,
    image_list,
    is_editable,
  } = noteData;

  const truncatedTitle =
    note_title.length > 10 ? `${note_title.slice(0, 10)}...` : note_title;

  return (
    <div className="relative">
      {/* 수정 모달 */}
      {editModal && (
        <EditNote
          noteId={noteId}
          initialTitle={note_title}
          initialContent={note_content}
          closeModal={() => setEditModal(false)}
        />
      )}

      <NoteDetailWrapper>
        <Header>
          <BackButton onClick={onBack}>
            <Icon name="IconGoChevronPrev" width={16} height={16} />
          </BackButton>
          <TitleWrapper>
            <Title>{truncatedTitle}</Title>
            {image_list?.length > 0 && (
              <IconButton>
                <Icon name="IconTbPhoto" width={16} height={16} />
              </IconButton>
            )}
          </TitleWrapper>
          <HeaderButtons>
            <IconButton onClick={toggleBookmark}>
              <Icon
                name={isBookmark ? 'IconTbFlag3Fill' : 'IconTbFlag3Stroke'}
                width={16}
                height={16}
              />
            </IconButton>
            {is_editable && (
              <>
                <IconButton onClick={() => setEditModal(true)}>
                  <Icon name="IconTbEdit" width={16} height={16} />
                </IconButton>
                <IconButton onClick={handleDelete}>
                  <Icon name="IconFiTrash" width={16} height={16} />
                </IconButton>
              </>
            )}
          </HeaderButtons>
        </Header>
        <MainSection>
          <ProfileSection>
            <Avatar>
              <AvatarImage src={note_writer.profile_url} alt="User Profile" />
              <AvatarFallback>
                {note_writer.user_email.split('@')[0].slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <ProfileInfo>
              <UserName>{note_writer.user_email.split('@')[0]}</UserName>
            </ProfileInfo>
            <CreationDate>
              {new Date(created_at).toLocaleDateString()}
            </CreationDate>
          </ProfileSection>
          <NoteContent>
            <NoteText>{note_content}</NoteText>
          </NoteContent>
        </MainSection>
      </NoteDetailWrapper>

      <Confirm />
    </div>
  );
};

export default NoteDetail;

/**
 * 스타일 정의
 */
const NoteDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: none;
  border-radius: 0.3rem;
  background-color: #cbcbcb;
  width: 100%;
  max-width: 37.5rem;
  height: 20rem;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 0.0625rem solid #cbcbcb;
  height: 2.4rem;
  border-radius: 0.3rem;
  background-color: #cbcbcb;
  padding: 0 0.5rem;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  gap: 0.5rem;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: 1.2rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const MainSection = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 0.5rem;
  border: 0.0625rem solid #cbcbcb;
  background-color: #fff;
`;

const ProfileSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
`;

const CreationDate = styled.span`
  font-size: 0.875rem;
  color: #555;
`;

const NoteContent = styled.div`
  margin-bottom: 1rem;
`;

const NoteText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
`;
