import React, { useEffect, useState, useRef, useCallback } from 'react';
import NoteButton from './NoteButton';
import NoteDetail from './NoteDetail';
import Icon from '../common/Icon';
import { Skeleton } from '@/components/ui/skeleton';
import NoteSearch from './NoteSearch';
import { processNotes } from '../../utils/temp';
import { useRecoilValue, useRecoilState } from 'recoil';
import { noteState } from '../../recoil/blueprint';
import { userState } from '../../recoil/common/user';
import { useParams } from 'react-router-dom';
import { get } from '../../api/index';

const NoteHistory = () => {
  const rawNotes = useRecoilValue(noteState); // Blueprint에서 받은 전역 상태 사용
  const user = useRecoilValue(userState); // 로그인한 유저 정보 가져오기
  const [notes, setNotes] = useState([]);
  const [lastDate, setLastDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTargetId, setSearchTargetId] = useState(null);
  const noteRefs = useRef({});
  const scrollContainerRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const cursorIdRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const { blueprint_id, blueprint_version_id, projectId } = useParams();

  // 날짜별 구분선 추가하여 상태 저장
  useEffect(() => {
    if (rawNotes.length) {
      const { notesWithSeparators, lastDate: newLastDate } = processNotes(
        rawNotes,
        lastDate,
      );
      setNotes(notesWithSeparators.reverse());
      setLastDate(newLastDate);
    }
  }, [rawNotes]);

  // 검색된 노트 위치로 스크롤 이동
  useEffect(() => {
    if (searchTargetId && noteRefs.current[searchTargetId]) {
      noteRefs.current[searchTargetId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [searchTargetId]);

  // NoteDetail 이동 시 스크롤 저장/복원
  const handleNoteClick = (note) => {
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop;
    }
    setSelectedNote(note);
  };

  const handleBack = () => {
    setSelectedNote(null);
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollPositionRef.current;
      }
    }, 0);
  };

  const fetchMoreNotes = useCallback(async () => {
    if (isFetching) return; // 중복 요청 방지
    setIsFetching(true);

    try {
      const apiUrl = `blueprints/${blueprint_id}/${blueprint_version_id}/notes`;
      const params = {
        project_id: projectId,
        cursor_id: cursorIdRef.current,
        size: 5,
      };
      const response = await get(apiUrl, params);

      if (response.status === 200 && response.data?.content?.note_list) {
        setNotes((prevNotes) => {
          const { notesWithSeparators } = processNotes(
            [...response.data.content.note_list, ...prevNotes],
            lastDate,
          );
          return notesWithSeparators;
        });

        // 새로운 커서 ID 설정 (다음 요청을 위해)
        if (response.data.content.note_list.length > 0) {
          cursorIdRef.current = response.data.content.note_list.at(-1).note_id;
        }
      }
    } catch (error) {
      console.error('노트 히스토리 로딩 실패:', error);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, blueprint_id, blueprint_version_id, projectId, lastDate]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop } = scrollContainerRef.current;
      // 스크롤이 거의 최상단에 도달했을 때
      if (scrollTop < 5 && !isFetching) {
        fetchMoreNotes();
      }
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  if (!notes.length) {
    return (
      <div className="flex flex-col border border-gray-200 rounded-lg bg-white h-full max-h-[20rem]">
        <div className="sticky top-0 z-10 bg-gray-100 p-2 text-lg font-bold text-center border-b border-gray-200">
          전체 노트
        </div>
        <div className="flex flex-col gap-2 p-4">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-12 rounded-md bg-gray-200"
              />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-gray-200 rounded-lg bg-white h-full max-h-[20rem]">
      {selectedNote ? (
        <NoteDetail noteId={selectedNote.note_id} onBack={handleBack} />
      ) : (
        <>
          <div className="sticky top-0 z-10 bg-gray-100 p-1 text-lg font-bold border-b border-gray-200 flex items-center">
            {/* 제목 중앙 정렬 */}
            <span className="flex-1 text-center">전체 노트</span>
            {/* 검색 아이콘 */}
            <button
              onClick={() => setIsSearching((prev) => !prev)}
              className="text-gray-600"
            >
              <Icon name="IconTbSearch" width={20} height={20} />
            </button>
          </div>

          {isSearching && (
            <NoteSearch
              onSelect={setSearchTargetId}
              onClose={() => {
                setIsSearching(false);
                setSearchTargetId(null);
              }}
            />
          )}

          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto flex flex-col-reverse p-4 gap-3"
          >
            {notes.map((note, index) => {
              const isMyNote =
                note.type === 'note' &&
                user?.email === note.note_writer.user_email; // 내 노트인지 확인

              return (
                <React.Fragment key={index}>
                  {note.type === 'date-separator' ? (
                    <div className="text-sm font-bold text-gray-600 py-2 border-t border-gray-300">
                      {note.date}
                    </div>
                  ) : (
                    <div
                      key={note.note_id}
                      ref={(el) => (noteRefs.current[note.note_id] = el)}
                      className={`w-full flex ${
                        isMyNote ? 'justify-end' : 'justify-start'
                      }`} // 내 노트면 오른쪽 정렬, 남의 노트면 왼쪽 정렬
                    >
                      <NoteButton
                        note={note}
                        onClick={() => handleNoteClick(note)}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default NoteHistory;
