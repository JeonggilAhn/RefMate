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

  // 날짜별 구분선 추가하여 상태 저장
  useEffect(() => {
    if (rawNotes.length) {
      const { notesWithSeparators, lastDate: newLastDate } = processNotes(
        rawNotes,
        lastDate,
      );
      setNotes(notesWithSeparators.reverse()); // 최신 데이터가 아래로 가도록 reverse()
      setLastDate(newLastDate);

      // cursorIdRef는 가장 오래된 note_id로 설정
      cursorIdRef.current = rawNotes.at(-1)?.note_id || null;
      //  console.log('초기 cursorId 설정:', cursorIdRef.current);

      // 스크롤 위치를 맨 아래로 설정
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop =
            currentScrollTop +
            (scrollContainerRef.current.scrollHeight - currentScrollHeight);
        }
      }, 0);
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

    setIsSearched(true);

    try {
      const searchApiUrl = `${projectId}/blueprints/${blueprint_id}/${blueprint_version_id}/notes/search`;
      const searchParams = { keyword: keyword };
      const searchResponse = await get(searchApiUrl, searchParams);
      const searchResults =
        searchResponse.data.content.matched_note_id_list || [];
      console.log(searchResponse.data.content);
      console.log(searchResults);

      // 노트 아이디들 저장
      setSearchedNotes(searchResults);

      // 아예 일치하는 노트들이 없다면
      if (searchResults.length === 0) {
        return;
      }

      // 일치하는 노트 아이디들 중에서도 가장 최신 노트 아이디 저장
      setNextId(searchResults[searchResults.length - 1]);
      console.log(nextId);

      const existingNote = (note_id) => {
        return notes.some((note) => note.note_id === note_id);
      };

      // 이미 존재하면 해당 노트로 이동
      if (existingNote(nextId)) {
        setSearchTargetId(existingNote.note_id);
      } else {
        // 없으면 범위 노트 요청 API 호출 (검색된 노트를 가져오기 위해)
        await fetchRangeNotes(searchResults);
      }

      // next_id 갱신
      if (searchResults.length >= 2) {
        setNextId(searchResults[searchResults.length - 2]);
      }
    } catch (error) {
      console.error('검색 실패:', error.message);
    }
  };

  // 노트 범위 요청
  const fetchRangeNotes = async (searchResults) => {
    try {
      const rangeApiUrl = `${blueprint_id}/${blueprint_version_id}/notes`;
      const rangeParams = {
        project_id: projectId,
        next_id: nextId,
        last_id: lastId,
      };
      const rangeResponse = await get(rangeApiUrl, rangeParams);
      const newNotes = rangeResponse.data.content.note_list || [];

      console.log('범위 노트 요청 결과:', newNotes.created_at);

      if (newNotes.length > 0) {
        setNotes((prevNotes) => [...prevNotes, ...newNotes]); // 노트 추가
        setLastId(nextId); // 마지막 노트 아이디

        // 추가된 노트 중 검색된 노트가 있는지 확인 후 스크롤
        const foundNote = newNotes.find((note) =>
          searchResults.includes(note.note_id),
        );

        if (foundNote) {
          setSearchTargetId(foundNote.note_id);
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
  }, [searchTargetId]);

  const goToPreviousNote = () => {
    const newIndex =
      currentIndex - 1 < 0 ? searchedNotes.length - 1 : currentIndex - 1; // 처음이면 마지막으로 이동
    setCurrentIndex(newIndex);

    const targetNoteId = searchedNotes[newIndex];
    if (!targetNoteId) return;

    if (!notes.some((note) => note.note_id === targetNoteId)) {
      fetchRangeNotes(targetNoteId);
    }

    setSearchTargetId(targetNoteId);
  };

  const goToNextNote = () => {
    const newIndex = (currentIndex + 1) % searchedNotes.length; // 마지막이면 처음으로 이동
    setCurrentIndex(newIndex);

    const targetNoteId = searchedNotes[newIndex];
    if (!targetNoteId) return;

    if (!notes.some((note) => note.note_id === targetNoteId)) {
      fetchRangeNotes(targetNoteId);
    }

    setSearchTargetId(targetNoteId);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
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
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollPositionRef.current;
      }
    }, 0);
  };

  // 페이지네이션 추가 노트 불러오기
  const fetchMoreNotes = useCallback(async () => {
    if (isFetching || cursorIdRef.current === null) {
      console.log('요청 중이거나, 불러올 데이터 없음. 요청 중단.');
      return;
    }
    setIsFetching(true); // 요청 중에는 중복 호출하지 않음음

    try {
      //  console.log('현재 cursorId:', cursorIdRef.current);

      const apiUrl = `blueprints/${blueprint_id}/${blueprint_version_id}/notes`;
      const params = {
        project_id: projectId,
        cursor_id: cursorIdRef.current, // 호출한 가장 오래된 노트 ID
        size: 5, // 가져올 data 수
      };
      const response = await get(apiUrl, params);

      // console.log('API 응답 확인:', response.data);

      const newNotes = response.data?.content?.note_list || [];
      console.log(`정보 : `, newNotes);
      if (response.status === 200 && newNotes.length > 0) {
        /*  console.log(
          'API 응답 받은 note_id 리스트:',
          newNotes.map((note) => note.note_id),
        );*/

        // 현재 스크롤 위치 저장
        const currentScrollHeight = scrollContainerRef.current.scrollHeight;
        const currentScrollTop = scrollContainerRef.current.scrollTop;

        setNotes((prevNotes) => {
          // 기존 데이터와 합쳐 중복 제거
          const existingNoteIds = new Set(
            prevNotes.map((note) => note.note_id),
          );
          const filteredNotes = newNotes.filter(
            (note) => !existingNoteIds.has(note.note_id),
          );
          // 새로운 노트 기존 노트 앞에 추가.
          const mergedNotes = [...prevNotes, ...filteredNotes];
          // 날짜 구분선 추가 및 LastDate 업데이트
          const { notesWithSeparators, lastDate: newLastDate } = processNotes(
            mergedNotes,
            lastDate,
          );
          setLastDate(newLastDate);
          return notesWithSeparators;
        });

        // cursorId 업데이트 (가장 오래된 note_id로 설정)
        cursorIdRef.current = newNotes.at(-1)?.note_id || cursorIdRef.current;
        // console.log('업데이트된 cursorId:', cursorIdRef.current);

        // 새로운 노트가 추가된 후 스크롤 위치 복원
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop =
              scrollContainerRef.current.scrollHeight -
              currentScrollHeight +
              currentScrollTop;
          }
        }, 0);
      } else {
        console.log('응답은 정상이나, 불러올 데이터 없음.');
        cursorIdRef.current = null;
      }
    } catch (error) {
      console.error('노트 히스토리 로딩 실패:', error);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, blueprint_id, blueprint_version_id, projectId, lastDate]);
  // 최상단 도달 시 추가 노트 요청청
  const handleScroll = useCallback(() => {
    // 스크롤 컨테이너 or API 요청 중이면 실행X
    if (!scrollContainerRef.current || isFetching) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;

    /*console.log('handleScroll 실행됨', {
      scrollTop,
      scrollHeight,
      clientHeight,
      cursorId: cursorIdRef.current,
    });*/

    // 스크롤이 최상단 도달했을 때만 실행
    if (scrollTop <= 10 && cursorIdRef.current !== null) {
      // console.log('최상단 도달! 노트 추가 요청');
      fetchMoreNotes(); // 추가 노트 불러오기기
    }
  }, [isFetching, fetchMoreNotes]);

  //
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll); // 스크롤 이벤트 등록
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll); // 컴포넌트 언마운트시 제거
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
                      className={`p-2 w-full flex 
                          ${searchTargetId === note.note_id ? 'bg-yellow-200' : ''} 
                          ${isMyNote ? 'justify-end' : 'justify-start'}
                        `} // 내 노트면 오른쪽 정렬, 남의 노트면 왼쪽 정렬
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
