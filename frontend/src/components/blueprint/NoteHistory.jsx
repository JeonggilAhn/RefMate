import React, { useEffect, useState, useRef, useCallback } from 'react';
import { get } from '../../api';
import NoteButton from './NoteButton';
import NoteDetail from './NoteDetail';
import Icon from '../common/Icon';
import { Skeleton } from '@/components/ui/skeleton';
import NoteSearch from './NoteSearch';
import { useParams } from 'react-router-dom';
import { processNotes } from '../../utils/temp';

const NoteHistory = () => {
  const { blueprint_id, blueprint_version_id, projectId } = useParams(); // 컴포넌트 내부로 이동
  const [notes, setNotes] = useState([]); // 노트 상태
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
  const [isSearching, setIsSearching] = useState(false); // 검색 모드 상태
  const [selectedNote, setSelectedNote] = useState(null); // 노트 상세 정보 상태
  const [pins, setPins] = useState([]); // 핀 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [searchTargetId, setSearchTargetId] = useState(null); // 검색된 노트 ID 저장
  const [cursorId, setCursorId] = useState(null); // 페이지네이션을 위한 커서 ID
  const [lastDate, setLastDate] = useState(''); // 마지막 날짜 구분선 날짜
  const noteRefs = useRef({}); // 노트별 ref 저장

  // 추가된 부분: 스크롤 컨테이너 ref 및 저장된 스크롤 위치
  const scrollContainerRef = useRef(null);
  const scrollPositionRef = useRef(0);

  const fetchNotes = async (cursorId = null) => {
    try {
      setLoading(true); // 로딩 시작
      const apiUrl = `blueprints/${blueprint_id}/${blueprint_version_id}/notes`;
      const params = { project_id: projectId, cursor_id: cursorId, size: 20 }; // 페이지네이션을 위한 파라미터
      const response = await get(apiUrl, params); // API 호출
      const noteData = response.data.content.note_list || []; // 노트 데이터 상태 업데이트
      const { notesWithSeparators, lastDate: newLastDate } = processNotes(
        noteData,
        lastDate,
      ); // 노트를 날짜별로 그룹화하고 날짜 구분선 추가
      setNotes((prevNotes) => [...notesWithSeparators, ...prevNotes]); // 상태 업데이트
      setCursorId(noteData.length > 0 ? noteData[0].note_id : null); // 커서 ID 업데이트
      setLastDate(newLastDate); // 마지막 날짜 구분선 날짜 업데이트
    } catch (error) {
      console.error('노트 데이터 로드 실패:', error.message);
      setErrorMessage('노트 데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    fetchNotes(); // 컴포넌트 마운트 시 노트 데이터를 불러옴
  }, []); // 컴포넌트 마운트 시 노트 데이터를 불러옴

  useEffect(() => {
    if (searchTargetId && noteRefs.current[searchTargetId]) {
      noteRefs.current[searchTargetId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [searchTargetId]);

  // 추가된 부분: NoteDetail로 이동하기 전 스크롤 위치 저장
  const handleNoteClick = (note) => {
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop;
    }
    setSelectedNote(note);
  };

  // 추가된 부분: NoteDetail에서 돌아올 때 스크롤 복원
  const handleBack = () => {
    setSelectedNote(null);
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollPositionRef.current;
      }
    }, 0);
  };

  // 스크롤 이벤트 핸들러 추가
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current.scrollTop === 0 && cursorId) {
      fetchNotes(cursorId);
    }
  }, [cursorId]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  if (loading && notes.length === 0) {
    return (
      <div className="flex flex-col border border-gray-200 rounded-lg bg-white h-full max-h-[20rem]">
        <div className="sticky top-0 z-10 bg-gray-100 p-2 text-lg font-bold text-center border-b border-gray-200">
          전체 노트
        </div>
        <div className="flex flex-col gap-2 p-4">
          {(pins.length > 0 ? pins : Array(4).fill(0)).map((_, index) => (
            <Skeleton
              key={index}
              className="w-full h-12 rounded-md bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className="flex flex-col border border-gray-200 rounded-lg bg-white h-full max-h-[20rem]">
      {selectedNote ? (
        <NoteDetail note={selectedNote} onBack={handleBack} />
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
            {notes.map((note, index) => (
              <React.Fragment key={index}>
                {note.type === 'date-separator' ? (
                  <div className="text-sm font-bold text-gray-600 py-2 border-t border-gray-300">
                    {note.date}
                  </div>
                ) : (
                  <div
                    key={note.note_id}
                    ref={(el) => (noteRefs.current[note.note_id] = el)}
                  >
                    <NoteButton
                      note={note}
                      onClick={() => handleNoteClick(note)}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NoteHistory;
