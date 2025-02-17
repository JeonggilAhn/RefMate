import React, { useEffect, useState, useRef, useCallback } from 'react';
import NoteButton from './NoteButton';
import NoteDetail from './NoteDetail';
import Icon from '../common/Icon';
import Draggable from 'react-draggable';

import { Skeleton } from '@/components/ui/skeleton';
import { processNotes } from '../../utils/temp';
import { useRecoilValue, useRecoilState } from 'recoil';
import { noteState } from '../../recoil/blueprint';
import { userState } from '../../recoil/common/user';
import { useParams } from 'react-router-dom';
import { get } from '../../api/index';
import { useToast } from '@/hooks/use-toast';
import { throttle } from 'lodash'; // lodash의 throttle 사용

const NoteHistory = ({ setIsNoteHistoryOpen }) => {
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
  const draggableRef = useRef(null);

  // 검색 기능
  const [keyword, setKeyword] = useState('');
  const [searchedNotes, setSearchedNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSearched, setIsSearched] = useState(false);
  const cursorIdRef = useRef(null);
  const nextIdRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const { blueprint_id, blueprint_version_id, projectId } = useParams();
  const [highlightedNoteId, setHighlightedNoteId] = useState(null);

  const [isAtTop, setIsAtTop] = useState(false); // 최상단 여부 상태 추가
  const [lastId, setLastId] = useState(null);

  // 날짜별 구분선 추가하여 상태 저장
  useEffect(() => {
    if (!rawNotes.length) {
      console.warn('rawNotes가 비어있음! notes 업데이트 안 됨');
      return;
    } // 노트가 아예 없으면 실행 안 함 (빈 배열 방지)
    console.log('rawNotes 업데이트됨:', rawNotes);

    const { notesWithSeparators, lastDate: newLastDate } = processNotes(
      rawNotes,
      lastDate,
    );

    console.log('notesWithSeparators:', notesWithSeparators);

    setNotes(notesWithSeparators.reverse()); // 최신 데이터가 아래로 가도록 reverse()
    setLastDate(newLastDate);

    // cursorIdRef는 가장 오래된 note_id로 설정
    cursorIdRef.current = rawNotes.at(-1)?.note_id || null;

    //  console.log('초기 cursorId 설정:', cursorIdRef.current);
    if (rawNotes.length > 5) {
      // 스크롤 위치를 맨 아래로 설정
      setTimeout(() => {
        if (scrollContainerRef.current) {
          const currentScrollTop = scrollContainerRef.current.scrollTop || 0;
          const currentScrollHeight =
            scrollContainerRef.current.scrollHeight || 0;

          scrollContainerRef.current.scrollTop =
            currentScrollTop +
            (scrollContainerRef.current.scrollHeight - currentScrollHeight);
        }
      }, 0);
    }
  }, [rawNotes]);

  // 검색 -> 스크롤 & 하이라이트
  const fetchSearchNotes = async () => {
    setCurrentIndex(0);
    setSearchTargetId(null);
    setSearchedNotes([]);
    setHighlightedNoteId(null);
    nextIdRef.current = null;

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
      nextIdRef.current = firstMatchId;

      console.log('첫 노트 아이디 : ', firstMatchId);

      const existingNote = notes.some((note) => note.note_id === firstMatchId);

      // 이미 존재하면 해당 노트로 이동
      if (existingNote) {
        // 있으면 바로 스크롤 및 하이라이트
        setSearchTargetId(firstMatchId);
        setHighlightedNoteId(firstMatchId);
      } else {
        // 없으면 범위 노트 요청
        await fetchRangeNotes(reversedResults);
      }
    } catch (error) {
      console.error('검색 실패:', error.message);
    }
  };

  // 노트 범위 요청
  /*const fetchRangeNotes = async (searchResults) => {
    try {
      const rangeApiUrl = `blueprints/${blueprint_id}/${blueprint_version_id}/notes/range`;
      const rangeParams = {
        project_id: projectId,
        next_id: nextIdRef.current, // 다음 찾을 노트 ID
        last_id: cursorIdRef.current, // 현재까지 있는 노트들 중 가장 오래된 ID
      };
      const rangeResponse = await get(rangeApiUrl, rangeParams);
      const newNotes = rangeResponse.data.content.note_list || [];

      console.log('범위 노트 요청 결과:', newNotes);

      if (newNotes.length > 0) {
        const transformedNotes = newNotes.map((note) => {
          if (note.type === 'note') {
            // note 타입일 경우
            return {
              type: note.type,
              note_id: note.note_id,
              note_writer: {
                user_id: note.user_id,
                user_email: note.user_email,
                profile_url: note.profile_url,
                signup_date: note.created_at,
                role: 'ROLE_OWNER',
              },
              note_title: note.note_title,
              note_content: '',
              is_bookmark: note.is_bookmark,
              created_at: note.created_at,
              is_present_image: note.is_present_image,
              read_users: [
                {
                  user_id: note.user_id,
                  user_email: note.user_email,
                  profile_url: note.profile_url,
                  signup_date: note.created_at,
                  role: 'ROLE_OWNER',
                },
              ],
              blueprint_id: note.blueprint_id,
              blueprint_title: note.blueprint_title,
              blueprint_version_id: note.blueprint_version_id,
              pin_id: note.pin_id,
              pin_name: note.pin_name,
              pin_x: note.pin_x,
              pin_y: note.pin_y,
              pin_group_id: note.pin_group_id,
              pin_group_name: note.pin_group_name,
              pin_group_color: note.pin_group_color,
            };
          } else if (note.type === 'date-separator') {
            // date-separator 타입일 경우 그대로 반환
            return note;
          }
          // 그 외의 경우는 원래대로 처리
          return note;
        });

        // 변환된 데이터를 상태에 저장
        setNotes((prevNotes) => [...prevNotes, ...transformedNotes]);

        // setNotes((prevNotes) => [...prevNotes, ...newNotes]); // 노트 추가

        // cursorId 업데이트 (가장 오래된 노트의 ID로 변경)
        console.log('변경 전: ', cursorIdRef.current);
        const firstNote = newNotes.find((item) => item.type === 'note');
        cursorIdRef.current = firstNote
          ? firstNote.note_id
          : cursorIdRef.current;
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
  };*/

  useEffect(() => {
    if (searchTargetId && noteRefs.current[searchTargetId]) {
      noteRefs.current[searchTargetId].scrollIntoView({
        behavior: 'smooth',
        block: 'center', // 최상단으로 스크롤
      });
    }

    setHighlightedNoteId(searchTargetId);
  }, [searchTargetId]);

  const goToPreviousNote = () => {
    const newIndex =
      currentIndex - 1 < 0 ? searchedNotes.length - 1 : currentIndex - 1; // 처음이면 마지막으로 이동
    setCurrentIndex(newIndex);

    const targetNoteId = searchedNotes[newIndex];
    nextIdRef.current = searchedNotes[newIndex];

    console.log('현재 노트 id', targetNoteId);

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
    nextIdRef.current = searchedNotes[newIndex];

    console.log('현재 노트 id', targetNoteId);

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
    nextIdRef.current = null;
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

      if (response.status === 200 && newNotes.length > 0) {
        setNotes((prevNotes) => {
          // 기존 데이터와 합쳐 중복 제거
          const existingNoteIds = new Set(
            prevNotes.map((note) => note.note_id),
          );
          const filteredNotes = newNotes.filter(
            (note) => !existingNoteIds.has(note.note_id),
          );

          console.log('기존 노트 목록:', prevNotes);
          console.log('새로 추가할 노트 목록:', newNotes);
          console.log('필터링된 노트 목록 (중복 제거 후):', filteredNotes);

          // 새로운 노트 기존 노트 앞에 추가.
          const mergedNotes = [...prevNotes, ...filteredNotes];

          // 날짜 구분선 추가 및 LastDate 업데이트
          const { notesWithSeparators, lastDate: newLastDate } = processNotes(
            mergedNotes,
            lastDate,
          );

          console.log('페이지네이션 노트:', notesWithSeparators);
          setNotes(notesWithSeparators);
          setLastDate(newLastDate);
          return notesWithSeparators;
        });

        // cursorId 업데이트 (가장 오래된 note_id로 설정)
        cursorIdRef.current = newNotes.at(-1)?.note_id || cursorIdRef.current;

        // 검색 시 범위 요청을 위해 현재까지 불러온 노트 아이디 저장
        setLastId(cursorIdRef.current);
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

  const prevScrollTopRef = useRef(0);

  // 최상단 도달 시 추가 노트 요청청
  const handleScroll = useCallback(
    throttle(() => {
      if (!scrollContainerRef.current || isFetching) return;

      const { scrollTop } = scrollContainerRef.current;

      // 최상단 도달 감지
      if (
        scrollTop < prevScrollTopRef.current &&
        scrollTop <= 5 &&
        !isFetching
      ) {
        console.log('최상단 도달! 페이지네이션 실행');
        fetchMoreNotes();
      }

      prevScrollTopRef.current = scrollTop;
    }, 200), // 200ms마다 실행 (반응 속도 조정 가능)
    [isFetching, fetchMoreNotes],
  );

  // 스크롤 이벤트 체크
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
    <Draggable nodeRef={draggableRef}>
      <div
        ref={draggableRef}
        className="flex flex-col border border-gray-200 rounded-lg bg-white h-full max-h-[20rem]"
      >
        {selectedNote ? (
          <NoteDetail noteId={selectedNote.note_id} onBack={handleBack} />
        ) : (
          <>
            <div className="sticky top-0 z-10 bg-gray-100 p-1 text-lg font-bold border-b border-gray-200 flex items-center">
              <button
                onClick={() => setIsNoteHistoryOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <Icon name="IconCgClose" width={24} height={24} />
              </button>
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
              {(() => {
                console.log('현재 렌더링되는 notes 상태:', notes);
                if (!notes || notes.length === 0) {
                  console.warn('현재 notes가 비어있음:', notes);
                }
              })()}
              {notes.map((note, index) => {
                console.log(`${index}번째 노트 : `, note);
                if (!note) {
                  console.warn('note 객체가 undefined입니다:', note);
                  return null;
                }

                console.log('노트리스트:', note);

                if (note.type === 'date-separator') {
                  return (
                    <div
                      key={index}
                      className="text-sm font-bold text-gray-600 py-2 border-t border-gray-300"
                    >
                      {note.date}
                    </div>
                  );
                }

                // 디버깅 로그 추가
                console.log('노트 데이터:', note);
                console.log('유저정보:', user);

                // console.log('note_writer:', note?.note_writer);

                // if (note?.note_writer === undefined) {
                // console.error('note_writer가 undefined입니다!:', note);
                // }

                // `note_writer`가 없을 경우 대비
                let authorEmail = note?.user_email || 'unknown';

                // if (note?.note_writer) {
                // if ('user_email' in note.note_writer) {
                //   authorEmail = note.note_writer.user_email;
                //  } else {
                //  console.error(
                //   'note_writer에 user_email 없음:',
                //  note.note_writer,
                // );
                //  }
                //  }

                console.log('작성자:', authorEmail);
                console.log('로그인 유저:', user?.user_email);

                if (!note.user_email) {
                  console.error(`note.user_email이 undefined!`, note);
                }

                //  const isMyNote =
                //note.type === 'note' && user?.user_email === authorEmail;
                return (
                  <div
                    key={note.note_id}
                    ref={(el) => (noteRefs.current[note.note_id] = el)}
                    className={`p-2 w-full flex flex-col 
        ${highlightedNoteId === note.note_id || searchTargetId === note.note_id ? 'bg-yellow-200' : ''} 
       `}
                  >
                    {note.pin_name && (
                      <div
                        className="px-6 py-1 rounded-md text-sm font-semibold mb-1"
                        style={{
                          backgroundColor: note.pin_group_color || '#D1D5DB',
                          color: '#FFFFFF',
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
                );
              })}
            </div>
          </>
        )}
      </div>
    </Draggable>
  );
};

export default NoteHistory;
