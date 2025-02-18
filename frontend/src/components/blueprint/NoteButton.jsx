import React, { useState } from 'react';
import styled from 'styled-components';
import Icon from '../common/Icon';
// import NoteReaders from './NoteReaders';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/common/user';

const NoteButton = ({ note, onClick, previewImage }) => {
  // 로그인한 유저 정보 가져오기
  const user = useRecoilValue(userState);
  const [isHovered, setIsHovered] = useState(false);

  // 읽은 사용자 목록 표시 여부 상태
  // const [showReaders, setShowReaders] = useState(false);

  // 읽은 사용자 목록 토글 함수
  // const handleShowReaders = () => {
  //   setShowReaders((prevState) => !prevState);
  // };

  // 작성 시간 포맷팅 함수
  const formatCreatedAt = (time) => {
    const now = new Date();
    const created = new Date(time);

    // 날짜(YYYY-MM-DD) 추출
    const nowDate = now.toISOString().split('T')[0];
    const createdDate = created.toISOString().split('T')[0];

    // 오늘 작성된 노트라면 시간/분으로 표시
    if (nowDate === createdDate) {
      const diffMs = now - created;
      const diffMinutes = Math.floor(diffMs / 60000);

      if (diffMinutes < 1) return '방금';
      if (diffMinutes < 60) return `${diffMinutes}분 전`;

      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours}시간 전`;
    }

    // 날짜 차이 계산 (자정 기준으로 비교)
    const nowMidnight = new Date(nowDate).getTime(); // 오늘 00:00:00
    const createdMidnight = new Date(createdDate).getTime(); // 생성일 00:00:00
    const diffDays = Math.floor((nowMidnight - createdMidnight) / 86400000);

    return `${diffDays}일 전`;
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
    <div
      className="relative flex items-center gap-4 p-2 bg-transp"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 작성자 프로필 이미지 (로그인한 유저와 다를 때만 표시) */}
      {user?.user_email !== note_writer.user_email && (
        <img
          src={note_writer.profile_url}
          alt="프로필"
          className="w-8 h-8 rounded-full shrink-0"
        />
      )}
      <div className="flex flex-col justify-center flex-1">
        {/* 제목과 아이콘 */}
        <TitleWrapper
          onClick={onClick} // 클릭 시 Note 상세 정보를 열기 위한 함수 실행
          className="relative flex items-center justify-between w-full p-2 gap-2 bg-white border rounded-lg border-gray-300"
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
          {is_bookmark && (
            <div
              className="absolute top-0 right-0 w-4 h-4 clip-triangle"
              style={{ backgroundColor: '#87b5fa' }}
            ></div>
          )}
        </TitleWrapper>
        {/* 작성자, 작성 시간, 읽은 사용자 표시 */}
        <div className="flex items-center text-xs text-gray-500">
          {/* 작성자 이메일 */}
          <span>{note_writer.user_email.split('@')[0]}</span>
          <span className="mx-1">·</span>
          {/* 작성 시간 (포맷팅된 시간 표시) */}
          <span>{formatCreatedAt(created_at)}</span>
        </div>
      </div>
      {/* 호버 시 이미지 표시 */}
      {isHovered && previewImage && (
        <div className="absolute left-full ml-4 w-40 h-full border border-gray-300 rounded-lg shadow-lg bg-white p-10">
          <img
            src={previewImage}
            alt="노트 미리보기"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default NoteButton;

const TitleWrapper = styled.button`
  position: relative;
  border-radius: 0.5rem;
  padding: 0.5rem;
  border: 0.0625rem solid #ccc;
  background-color: white;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;

  &:hover {
    background-color: #cbcbcb; 
`;
