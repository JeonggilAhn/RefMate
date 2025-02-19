import React, { useState } from 'react';
import styled from 'styled-components';
import Icon from '../common/Icon';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/common/user';
import { get } from '../../api/index';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const NoteButton = ({ note, onClick }) => {
  // 로그인한 유저 정보 가져오기
  const user = useRecoilValue(userState);
  const [noteContent, setNoteContent] = useState(''); // 노트 내용 상태 추가

  const fetchNoteContent = async () => {
    if (!noteContent) {
      try {
        const response = await get(`notes/${note.note_id}`);
        //  console.log(`response :`, response);
        const content =
          response?.data?.content?.note?.note_content || '내용 없음';
        //  console.log(`content : `, content);
        setNoteContent(content);
      } catch (error) {
        //  console.error('노트 상세 조회 실패:', error);
        setNoteContent('내용을 불러올 수 없습니다.');
      }
    }
  };

  const formatCreatedAt = (time) => {
    const now = new Date();
    const created = new Date(time);

    // 날짜(YYYY-MM-DD) 추출
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 오늘 00:00:00
    const createdDate = new Date(
      created.getFullYear(),
      created.getMonth(),
      created.getDate(),
    );

    // 날짜 차이 계산
    const diffDays = Math.floor((nowDate - createdDate) / 86400000);

    // 작성일이 오늘과 다르면 'n일 전'으로 표시
    if (diffDays > 0) {
      return `${diffDays}일 전`;
    }

    // 같은 날짜이면 시간/분 단위로 계산
    const diffMs = now - created;
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return '방금';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;

    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}시간 전`;
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger
          className="relative flex items-center gap-4 p-2 bg-transp cursor-pointer"
          onMouseEnter={fetchNoteContent}
          onClick={onClick}
        >
          {/* 작성자 프로필 이미지 (로그인한 유저와 다를 때만 표시) */}
          {user?.user_email !== note.note_writer.user_email && (
            <img
              src={note.note_writer.profile_url}
              alt="프로필"
              className="w-8 h-8 rounded-full shrink-0"
            />
          )}
          <div className="flex flex-col justify-center w-full">
            {/* 제목과 아이콘 */}
            <div className="relative flex items-center justify-between w-full p-2 gap-2 bg-white border rounded-lg border-gray-300">
              {/* 제목 표시 (최대 20글자로 제한) */}
              <span className="text-sm font-bold truncate flex-1">
                {note.note_title.length > 20
                  ? `${note.note_title.slice(0, 20)}...`
                  : note.note_title}
              </span>
              {/* 이미지 아이콘 표시 (첨부된 이미지가 있는 경우) */}
              <div className="flex items-center gap-2">
                {note.is_present_image && (
                  <Icon name="IconTbPhoto" width={18} height={18} />
                )}
              </div>
              {/* 북마크 표시 (있을 경우 삼각형 표시) */}
              {note.is_bookmark && (
                <div
                  className="absolute top-0 right-0 w-4 h-4 clip-triangle"
                  style={{ backgroundColor: '#87b5fa' }}
                ></div>
              )}
            </div>
            {/* 작성자, 작성 시간 */}
            <div className="flex items-center text-xs text-gray-500">
              <span>{note.note_writer.user_email.split('@')[0]}</span>
              <span className="mx-1">·</span>
              <span>{formatCreatedAt(note.created_at)}</span>
            </div>
          </div>
        </TooltipTrigger>

        {/* 호버 시 노트 내용 툴팁으로 표시 */}
        <TooltipContent side="top">
          <p className="text-sm max-w-[250px]">{noteContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NoteButton;
