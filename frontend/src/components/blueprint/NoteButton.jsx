import React from 'react';
import styled from 'styled-components';
import ImageIconSrc from '../../assets/icons/ImageButton.svg';

const NoteButton = ({ note }) => {
  const formatCreatedAt = (time) => {
    const now = new Date();
    const created = new Date(time);
    const diffMs = now - created;

    if (diffMs < 3600000) {
      return `${Math.floor(diffMs / 60000)}분 전`;
    } else if (diffMs < 86400000) {
      return `${Math.floor(diffMs / 3600000)}시간 전`;
    } else {
      return `${Math.floor(diffMs / 86400000)}일 전`;
    }
  };

  const { note_writer, note_title, created_at, is_present_image, is_bookmark } =
    note;

  return (
    <NoteWrapper>
      <ProfileImage src={note_writer.profile_url} alt="프로필" />
      <ContentWrapper>
        <TitleWrapper>
          <Title>{note_title}</Title>
          <IconsWrapper>
            {is_bookmark && <BookmarkIcon />}
            {is_present_image && (
              <ImageIcon src={ImageIconSrc} alt="이미지 아이콘" />
            )}
          </IconsWrapper>
        </TitleWrapper>
        <MetaData>
          <UserInfo>{note_writer.user_email.split('@')[0]}</UserInfo>
          <Separator>·</Separator>
          <CreatedAt>{formatCreatedAt(created_at)}</CreatedAt>
        </MetaData>
      </ContentWrapper>
    </NoteWrapper>
  );
};

export default NoteButton;

// 스타일 정의
const NoteWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  background-color: #fff;
`;

const ProfileImage = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  flex-shrink: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0.0625rem solid #ccc;
  border-radius: 0.5rem;
  padding: 0.5rem;
  gap: 0.5rem;
  position: relative;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 0.875rem;
  font-weight: bold;
`;

const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ImageIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const BookmarkIcon = styled.div`
  width: 0;
  height: 0;
  border-top: 1rem solid #87b5fa; /* 파란색 모서리 */
  border-left: 1rem solid transparent;
  position: absolute;
  top: 0;
  right: 0;
`;

const MetaData = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
`;

const UserInfo = styled.div`
  font-size: 0.75rem;
`;

const Separator = styled.div`
  margin: 0 0.25rem;
`;

const CreatedAt = styled.div`
  font-size: 0.75rem;
  color: #888;
`;
