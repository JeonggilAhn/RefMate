import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { get, del, patch } from '../../api'; // PATCH 추가
import { useRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';
import Confirm from '../../components/common/Confirm';
import Icon from '../common/Icon';

const NoteDetail = ({ noteId, onBack }) => {
  const [noteData, setNoteData] = useState(null);
  const [modal, setModal] = useRecoilState(modalState);
  const [isBookmark, setIsBookmark] = useState(false); // 북마크 상태

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

  const handleDelete = () => {
    setModal({
      type: 'confirm',
      message: '정말 삭제하시겠습니까?',
      onConfirm: async () => {
        try {
          const response = await del(`notes/${noteId}`);
          if (response.status === 200) {
            alert('노트가 삭제되었습니다.');
            setNoteData(null);
            onBack();
          } else {
            alert('노트 삭제에 실패했습니다.');
          }
        } catch (error) {
          console.error('노트 삭제 중 에러 발생:', error);
          alert('노트 삭제 중 문제가 발생했습니다.');
        }
      },
    });
  };

  const toggleBookmark = async () => {
    try {
      const response = await patch(`notes/${noteId}/bookmark`, {
        is_bookmark: !isBookmark, // 상태를 반대로 전송
      });

      if (response.status === 200) {
        setIsBookmark((prev) => !prev); // 상태 업데이트
        setModal({
          type: 'alert',
          message: !isBookmark
            ? '중요 노트로 등록했습니다!'
            : '중요 노트를 해제했습니다!',
        }); // 알림 모달 표시
      } else {
        alert('북마크 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('북마크 상태 변경 중 에러 발생:', error);
      alert('북마크 상태 변경 중 문제가 발생했습니다.');
    }
  };

  if (!noteData) {
    return null;
  }

  const { note_writer, note_title, note_content, created_at, image_list } =
    noteData;

  const truncatedTitle =
    note_title.length > 10 ? `${note_title.slice(0, 10)}...` : note_title;

  return (
    <>
      <NoteDetailWrapper>
        <Header>
          <BackButton onClick={onBack}>
            <Icon name="IconGoChevronPrev" width={16} height={16} />
          </BackButton>
          <TitleWrapper>
            <Title>{truncatedTitle}</Title>
            {image_list.length > 0 && (
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
            <IconButton onClick={handleDelete}>
              <Icon name="IconFiTrash" width={16} height={16} />
            </IconButton>
          </HeaderButtons>
        </Header>
        <MainSection>
          <ProfileSection>
            <ProfileImage src={note_writer.profile_url} alt="User Profile" />
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
          <ImageGrid>{/* 이미지 리스트 렌더링 공간 */}</ImageGrid>
        </MainSection>
      </NoteDetailWrapper>
      <Confirm />
    </>
  );
};

export default NoteDetail;

// 스타일은 기존 코드 유지
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

const ProfileImage = styled.img`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  margin-right: 0.5rem;
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

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;
