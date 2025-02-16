import React, { useEffect, useState, useRef, useCallback } from 'react';
import NoteButton from './NoteButton';
import NoteDetail from './NoteDetail';
import Icon from '../common/Icon';
import { Skeleton } from '@/components/ui/skeleton';
import { processNotes } from '../../utils/temp';
import { useRecoilValue, useRecoilState } from 'recoil';
import { noteState } from '../../recoil/blueprint';
import { userState } from '../../recoil/common/user';
import { useParams } from 'react-router-dom';
import { get } from '../../api/index';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast(20);
  const scrollTimeoutRef = useRef(null); // scrollTimeoutRef 추가

  // 검색 기능
  const [keyword, setKeyword] = useState('');
  const [nextId, setNextId] = useState(0);
  const [lastId, setLastId] = useState(0);
  const [searchedNotes, setSearchedNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSearched, setIsSearched] = useState(false);
  const cursorIdRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const { blueprint_id, blueprint_version_id, projectId } = useParams();
  const [highlightedNoteId, setHighlightedNoteId] = useState(null);

  // 날짜별 구분선 추가하여 상태 저장
  useEffect(() => {
    if (rawNotes.length) {
      const { notesWithSeparators, lastDate: newLastDate } = processNotes(
        rawNotes,
        lastDate,
      );
      setNotes(notesWithSeparators.reverse());
      setLastDate(newLastDate);

      cursorIdRef.current = rawNotes.at(-1)?.note_id || null;
    }
  }, [rawNotes]);

  // 검색 -> 스크롤 & 하이라이트
  const fetchSearchNotes = async () => {
    if (!keyword.trim()) {
      toast({
        title: '검색어를 입력하세요.',
      });
      return; // 빈 검색어 방지
    }

    try {
      const searchApiUrl = `${projectId}/blueprints/${blueprint_id}/${blueprint_version_id}/notes/search`;
      const searchParams = { keyword: keyword };
      const searchResponse = await get(searchApiUrl, searchParams);
      const searchResults =
        searchResponse.data.content.matched_note_id_list || [];
      console.log(searchResponse.data.content);
      console.log('검색된 노트들 : ', searchResults);

      // 검색된 노트 ID 리스트 저장 (역순)
      const reversedResults = [...searchResults].reverse();
      setSearchedNotes(reversedResults);
      setIsSearched(true);

      // 아예 일치하는 노트들이 없다면
      if (searchResults.length === 0) {
        return;
      }

      // 일치하는 노트 아이디들 중에서도 가장 최신 노트 아이디 저장
      const firstMatchId = reversedResults[0];
      setNextId(firstMatchId);
      console.log('첫 노트 아이디 : ', firstMatchId);

      const existingNote = notes.some((note) => note.note_id === firstMatchId);

      // 이미 존재하면 해당 노트로 이동
      if (existingNote) {
        // 있으면 바로 스크롤 및 하이라이트
        setSearchTargetId(firstMatchId);
        setHighlightedNoteId(firstMatchId);
      } else {
        // 없으면 범위 노트 요청
        await fetchRangeNotes(reversedResults, firstMatchId);
      }
    } catch (error) {
      console.error('검색 실패:', error.message);
    }
  };

  // 노트 범위 요청
  const fetchRangeNotes = async (searchResults, nextMatchId) => {
    try {
      const rangeApiUrl = `blueprints/${blueprint_id}/${blueprint_version_id}/notes/range`;
      const rangeParams = {
        project_id: projectId,
        next_id: nextMatchId, // 다음 찾을 노트 ID
        last_id: cursorIdRef.current, // 현재까지 있는 노트들 중 가장 오래된 ID
      };
      const rangeResponse = await get(rangeApiUrl, rangeParams);
      const newNotes = rangeResponse.data.content.note_list || [];

      console.log('범위 노트 요청 결과:', newNotes);

      if (newNotes.length > 0) {
        setNotes((prevNotes) => [...prevNotes, ...newNotes]); // 노트 추가
        // cursorId 업데이트 (가장 오래된 노트의 ID로 변경)
        const lastFetchedNoteId = newNotes.at(-1)?.note_id;
        cursorIdRef.current = lastFetchedNoteId || cursorIdRef.current;
        console.log('변경되었는지 확인: ', cursorIdRef.current);

        // 추가된 노트 중 검색된 노트가 있는지 확인 후 스크롤
        const foundNote = newNotes.find((note) =>
          searchResults.includes(note.note_id),
        );

        if (foundNote) {
          setSearchTargetId(foundNote.note_id);
          setHighlightedNoteId(foundNote.note_id);
        }
      }
    } catch (error) {
      console.error('범위 노트 요청 실패:', error.message);
    }
  };

  useEffect(() => {
    if (searchTargetId && noteRefs.current[searchTargetId]) {
      noteRefs.current[searchTargetId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }

    setHighlightedNoteId(searchTargetId);
  }, [searchTargetId]);

  const goToPreviousNote = () => {
    const newIndex =
      currentIndex - 1 < 0 ? searchedNotes.length - 1 : currentIndex - 1; // 처음이면 마지막으로 이동
    setCurrentIndex(newIndex);

    const targetNoteId = searchedNotes[newIndex];
    if (!targetNoteId) return;

    if (!notes.some((note) => note.note_id === targetNoteId)) {
      fetchRangeNotes(searchedNotes);
    }

    setSearchTargetId(targetNoteId);
  };

  const goToNextNote = () => {
    const newIndex = (currentIndex + 1) % searchedNotes.length; // 마지막이면 처음으로 이동
    setCurrentIndex(newIndex);

    const targetNoteId = searchedNotes[newIndex];
    if (!targetNoteId) return;

    if (!notes.some((note) => note.note_id === targetNoteId)) {
      fetchRangeNotes(searchedNotes);
    }

    setSearchTargetId(targetNoteId);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchSearchNotes();
    }
  };

  const clearSearch = () => {
    setIsSearching(false);
    setIsSearched(false);
    setKeyword('');
    setCurrentIndex(0);
    setSearchTargetId(null);
    setSearchedNotes([]);
    setHighlightedNoteId(null);
  };

  // NoteDetail 이동 시 스크롤 저장/복원
  const handleNoteClick = (note) => {
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop;
    }
    setSelectedNote(note);
  };

  const handleBack = () => {
    setSelectedNote(null);
    setSearchTargetId(null);
    setHighlightedNoteId(null);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollPositionRef.current;
    }
  };

  // 페이지네이션 추가 노트 불러오기
  const fetchMoreNotes = useCallback(async () => {
    if (isFetching || !cursorIdRef.current) {
      console.log(
        'fetchMoreNotes 요청 중단 - cursorIdRef:',
        cursorIdRef.current,
      );
      return;
    }
    setIsFetching(true);

    console.log(
      'fetchMoreNotes 요청 시작 - cursorIdRef.current before API call:',
      cursorIdRef.current,
    );

    try {
      const apiUrl = `blueprints/${blueprint_id}/${blueprint_version_id}/notes`;
      const params = {
        project_id: projectId,
        cursor_id: cursorIdRef.current,
        size: 5,
      };
      const response = await get(apiUrl, params);

      const newNotes = response.data?.content?.note_list || [];
      console.log('API 응답 받은 노트들:', newNotes);

      if (newNotes.length > 0) {
        setNotes((prevNotes) => {
          const existingNoteIds = new Set(
            prevNotes.map((note) => note.note_id),
          );
          const filteredNotes = newNotes.filter(
            (note) => !existingNoteIds.has(note.note_id),
          );
          return [...prevNotes, ...filteredNotes];
        });

        // cursorId 업데이트 (가장 오래된 노트의 ID로 변경)
        const lastFetchedNoteId = newNotes.at(-1)?.note_id;
        cursorIdRef.current = lastFetchedNoteId || cursorIdRef.current;

        console.log('업데이트된 cursorIdRef.current:', cursorIdRef.current);
      } else {
        console.log('더 이상 불러올 노트 없음. cursorIdRef 초기화.');
        cursorIdRef.current = null; // 더 이상 불러올 데이터가 없음을 표시
      }
    } catch (error) {
      console.error('노트 불러오기 실패:', error);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, blueprint_id, blueprint_version_id, projectId]);

  // 최상단 도달 시 추가 노트 요청
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isFetching) return;

    const { scrollTop } = scrollContainerRef.current;
    console.log('handleScroll 이벤트 발생 - scrollTop:', scrollTop);
    console.log('현재 cursorIdRef.current:', cursorIdRef.current);
    console.log('현재 isFetching:', isFetching);

    const isAtTop = scrollTop === 0;

    if (isAtTop && cursorIdRef.current !== null && !isFetching) {
      console.log('최상단 도달! 노트 추가 요청...');

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        requestAnimationFrame(fetchMoreNotes);
      }, 50);
    }
  }, [isFetching, fetchMoreNotes]);

  // 스크롤 이벤트 체크
  useEffect(() => {
    console.log(
      'useEffect 실행됨 - scrollContainerRef:',
      scrollContainerRef.current,
    );

    if (scrollContainerRef.current) {
      console.log(
        'scrollContainerRef가 정상적으로 연결됨:',
        scrollContainerRef.current,
      );

      scrollContainerRef.current.addEventListener('scroll', handleScroll);
      console.log('scroll 이벤트 바인딩 완료!');

      return () => {
        console.log('scroll 이벤트 해제 중...');
        scrollContainerRef.current.removeEventListener('scroll', handleScroll);
        console.log('scroll 이벤트 해제 완료!');
      };
    } else {
      console.error('scrollContainerRef.current가 NULL입니다. 확인 필요!');
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
            <div className="p-2 border border-gray-300 rounded w-85">
              <div className="flex items-center space-x-4 justify-between">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="search"
                  className="w-40 focus:outline-none focus:ring-0 border-none"
                />

                <div className="flex gap-2">
                  {/* 검색 버튼 눌렀는데 검색 결과도 없을 때 */}
                  {isSearched && searchedNotes.length === 0 && (
                    <div className="text-center text-gray-500">결과 없음</div>
                  )}

                  {searchedNotes.length > 0 && (
                    <>
                      <div className="text-center text-gray-500">
                        {currentIndex + 1} / {searchedNotes.length}
                      </div>
                      <button
                        onClick={goToPreviousNote}
                        disabled={currentIndex === 0}
                      >
                        <Icon
                          name="IconGoChevronPrev"
                          width={20}
                          height={20}
                          color={currentIndex === 0 ? '#ccc' : '#000'}
                        />
                      </button>
                      <button
                        onClick={goToNextNote}
                        disabled={currentIndex === searchedNotes.length - 1}
                      >
                        <Icon
                          name="IconGoChevronNext"
                          width={20}
                          height={20}
                          color={
                            currentIndex === searchedNotes.length - 1
                              ? '#ccc'
                              : '#000'
                          }
                        />
                      </button>
                    </>
                  )}
                  <button onClick={clearSearch}>
                    <Icon name="IconCgClose" width={20} height={20} />
                  </button>
                  <button onClick={fetchSearchNotes}>
                    <Icon name="IconTbSearch" width={20} height={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto flex flex-col-reverse p-4 gap-3"
          >
            {notes.map((note, index) => {
              const isMyNote =
                note.type === 'note' &&
                user?.user_email === note.note_writer.user_email; // 내 노트인지 확인

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
                      className={`p-2 w-full flex flex-col 
    ${highlightedNoteId === note.note_id || searchTargetId === note.note_id ? 'bg-yellow-200' : ''} 
    ${isMyNote ? 'items-end' : 'items-start'}`}
                    >
                      {note.type === 'note' && note.pin_name && (
                        <div
                          className="px-6 py-1 rounded-md text-sm font-semibold mb-1"
                          style={{
                            backgroundColor: note.pin_group_color || '#D1D5DB', // 배경색 강제 적용
                            color: '#FFFFFF', // 글씨색 강제 적용
                            maxWidth: '8rem',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                          }}
                        >
                          {note.pin_name}
                        </div>
                      )}

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
