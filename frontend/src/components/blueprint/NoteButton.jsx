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

  const truncateTitle = (title) => {
    return title.length > 15 ? `${title.slice(0, 15)}...` : title;
  };

  const {
    note_writer: { profile_url, user_email },
    note_title,
    created_at,
    preview_image_list, // preview_image_list 사용
    is_bookmark,
  } = note;

  // preview_image_list의 존재 여부를 확인하여 이미지 아이콘 표시
  const is_present_image =
    Array.isArray(preview_image_list) && preview_image_list.length > 0;

  return (
    <NoteWrapper>
      <ProfileImage src={profile_url} alt="프로필" />
      <ContentWrapper>
        <TitleWrapper $isBookmarked={is_bookmark}>
          <Title>{truncateTitle(note_title)}</Title>
          {is_present_image && (
            <ImageIcon src={ImageIconSrc} alt="이미지 아이콘" />
          )}
        </TitleWrapper>
        <MetaData>
          <UserInfo>{user_email.split('@')[0]}</UserInfo>
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
  border-radius: 0.2rem;
  padding: 0.5rem;
  gap: 0.5rem;
  height: 2rem;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: #f9f9f9;
  }

  &::before {
    content: '';
    display: ${({ $isBookmarked }) => ($isBookmarked ? 'block' : 'none')};
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-top: 1rem solid #87b5fa;
    border-left: 1rem solid transparent;
  }
`;

const Title = styled.div`
  font-size: 0.75rem;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ImageIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
`;

const MetaData = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.65rem;
  color: #666;
  margin-top: 0.25rem;
`;

const UserInfo = styled.div`
  font-size: 0.65rem;
`;

const Separator = styled.div`
  margin: 0 0.25rem;
`;

const CreatedAt = styled.div`
  font-size: 0.65rem;
  color: #999;
`;
