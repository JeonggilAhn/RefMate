import React, { useState } from 'react';
import styled from 'styled-components';
import Icon from '../common/Icon';
import NoteReaders from './NoteReaders';

const NoteButton = ({ note, onClick }) => {
  // 읽은 사용자 목록 표시 여부 상태
  const [showReaders, setShowReaders] = useState(false);

  // 읽은 사용자 목록 토글 함수
  const handleShowReaders = () => {
    setShowReaders((prevState) => !prevState);
  };

  // 작성 시간 포맷팅 함수
  const formatCreatedAt = (time) => {
    const now = new Date();
    const created = new Date(time);
    const diffMs = now - created;

    if (diffMs < 3600000) {
      return `${Math.floor(diffMs / 60000)}분 전`; // 1시간 미만
    } else if (diffMs < 86400000) {
      return `${Math.floor(diffMs / 3600000)}시간 전`; // 1일 미만
    } else {
      return `${Math.floor(diffMs / 86400000)}일 전`; // 1일 이상
    }
  };

  // note
  const {
    note_writer,
    note_title,
    created_at,
    is_present_image,
    is_bookmark,
    read_users,
  } = note;

  return (
    <div className="flex items-center gap-4 p-2 bg-white">
      {/* 작성자 프로필 이미지 */}
      <img
        src={note_writer.profile_url}
        alt="프로필"
        className="w-8 h-8 rounded-full shrink-0"
      />
      <div className="flex flex-col justify-center flex-1">
        {/* 제목과 아이콘 */}
        <TitleWrapper
          onClick={onClick} // 클릭 시 Note 상세 정보를 열기 위한 함수 실행
          className="relative flex items-center justify-between w-full p-2 gap-2 bg-transparent border rounded-lg border-gray-300"
        >
          {/* 제목 표시 (최대 20글자로 제한) */}
          <span className="text-sm font-bold truncate max-w-[10rem]">
            {note_title.length > 20
              ? `${note_title.slice(0, 20)}...`
              : note_title}
          </span>
          {/* 이미지 아이콘 표시 (첨부된 이미지가 있는 경우) */}
          <div className="flex items-center gap-2">
            {is_present_image && (
              <Icon name="IconTbPhoto" width={18} height={18} />
            )}
          </div>
          {/* 북마크 표시 (있을 경우 삼각형 표시) */}
          {is_bookmark && <StyledBookmark />}
        </TitleWrapper>
        {/* 작성자, 작성 시간, 읽은 사용자 표시 */}
        <div className="flex items-center text-xs text-gray-500">
          {/* 작성자 이메일 */}
          <span>{note_writer.user_email.split('@')[0]}</span>
          <span className="mx-1">·</span>
          {/* 작성 시간 (포맷팅된 시간 표시) */}
          <span>{formatCreatedAt(created_at)}</span>
          {/* 읽은 사용자 목록 버튼 */}
          <button onClick={handleShowReaders} className="ml-2">
            😶
          </button>
        </div>
      </div>
      {/* 읽은 사용자 목록 표시 (showReaders가 true일 경우) */}
      {showReaders && <NoteReaders read_users={read_users} />}
    </div>
  );
};

export default NoteButton;

// 북마크 삼각형 스타일
const StyledBookmark = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 15px 15px 0;
  border-color: #ccc #87b5fa transparent transparent;
  border-radius: 0 0.3rem 0 0;
`;

const TitleWrapper = styled.button`
  position: relative;
  border-radius: 0.5rem;
  padding: 0.5rem;
  border: 0.0625rem solid #ccc;
  background-color: transparent;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
`;
