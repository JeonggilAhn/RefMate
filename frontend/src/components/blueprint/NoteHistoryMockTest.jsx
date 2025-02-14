import React, { useEffect, useState, useRef, useCallback } from 'react';
import { get } from '../../api';
import NoteButton from './NoteButton';
import NoteDetail from './NoteDetail';
import Icon from '../common/Icon';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'react-router-dom';
import { processNotes } from '../../utils/temp';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast(20);

  // 추가된 부분: 스크롤 컨테이너 ref 및 저장된 스크롤 위치
  const scrollContainerRef = useRef(null);
  const scrollPositionRef = useRef(0);

  // 검색 기능
  const [keyword, setKeyword] = useState('');
  const [nextId, setNextId] = useState(0);
  const [lastId, setLastId] = useState(0);
  const [searchedNotes, setSearchedNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSearched, setIsSearched] = useState(false);

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

      // 목데이터
      const mock = [
        {
          blueprint_id: -13112463,
          blueprint_title:
            'vacantly spiteful purse unless runny regarding exterior overcook',
          blueprint_version_id: 5106470,
          note_id: -9070596,
          note_writer: {
            user_id: 1979110845982302,
            user_email: 'Deontae_Murphy43@gmail.com',
            profile_url: 'https://avatars.githubusercontent.com/u/55217752',
            signup_date: '2025-02-14T01:07:55.986Z',
            role: 'est in dolor cupidatat',
          },
          note_title:
            'illustrious er yearningly aware thorn nor um bar failing',
          is_bookmark: false,
          created_at: '2025-02-13T14:23:16.708Z',
          is_editable: true,
          is_present_image: false,
          read_users: [
            {
              user_id: 2245749416313631,
              user_email: 'Wilhelm_Hodkiewicz91@yahoo.com',
              profile_url: 'https://avatars.githubusercontent.com/u/93287024',
              signup_date: '2025-02-14T01:07:55.988Z',
              role: 'labore ullamco fugiat in',
            },
          ],
        },
        {
          blueprint_id: 91065393,
          blueprint_title: 'unfortunately dearly because assail fluff frail',
          blueprint_version_id: -42901870,
          note_id: -50483525,
          note_writer: {
            user_id: 3083132215291110,
            user_email: 'Green.Volkman@hotmail.com',
            profile_url: 'https://avatars.githubusercontent.com/u/25146095',
            signup_date: '2025-02-14T01:07:55.989Z',
            role: 'ad esse',
          },
          note_title: 'angrily embed before astride than',
          is_bookmark: true,
          created_at: '2025-02-13T03:30:34.088Z',
          is_editable: false,
          is_present_image: false,
          read_users: [
            {
              user_id: 8655313565510821,
              user_email: 'Adonis.Goyette@hotmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/24458251',
              signup_date: '2025-02-14T01:07:55.990Z',
              role: 'aute',
            },
          ],
        },
        {
          blueprint_id: -11099432,
          blueprint_title: 'over mmm meanwhile beret',
          blueprint_version_id: -91240137,
          note_id: -49372310,
          note_writer: {
            user_id: 4295363540744363,
            user_email: 'Dovie.Wehner15@yahoo.com',
            profile_url: 'https://avatars.githubusercontent.com/u/1838186',
            signup_date: '2025-02-14T01:07:56.024Z',
            role: 'ut commodo elit',
          },
          note_title:
            '112keenly restaurant piglet moisten with flame marvelous editor',
          is_bookmark: true,
          created_at: '2025-02-13T09:40:48.172Z',
          is_editable: false,
          is_present_image: true,
          read_users: [
            {
              user_id: 6871580398609225,
              user_email: 'Eugenia_Schinner74@hotmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/1365707',
              signup_date: '2025-02-14T01:07:56.026Z',
              role: 'quis in officia',
            },
            {
              user_id: 6699132712018442,
              user_email: 'Marcus6@yahoo.com',
              profile_url: 'https://avatars.githubusercontent.com/u/76501952',
              signup_date: '2025-02-14T01:07:56.027Z',
              role: 'enim magna do',
            },
            {
              user_id: 5489048717145960,
              user_email: 'Salma46@yahoo.com',
              profile_url: 'https://avatars.githubusercontent.com/u/2838274',
              signup_date: '2025-02-14T01:07:56.065Z',
              role: 'occaecat non',
            },
          ],
        },
        {
          blueprint_id: -11099432,
          blueprint_title: 'over mmm meanwhile beret',
          blueprint_version_id: -91240137,
          note_id: -9372310,
          note_writer: {
            user_id: 4295363540744363,
            user_email: 'Dovie.Wehner15@yahoo.com',
            profile_url: 'https://avatars.githubusercontent.com/u/1838186',
            signup_date: '2025-02-14T01:07:56.024Z',
            role: 'ut commodo elit',
          },
          note_title:
            'keenly restaurant piglet moisten with flame marvelous editor',
          is_bookmark: true,
          created_at: '2025-02-13T09:40:48.172Z',
          is_editable: false,
          is_present_image: true,
          read_users: [
            {
              user_id: 6871580398609225,
              user_email: 'Eugenia_Schinner74@hotmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/1365707',
              signup_date: '2025-02-14T01:07:56.026Z',
              role: 'quis in officia',
            },
            {
              user_id: 6699132712018442,
              user_email: 'Marcus6@yahoo.com',
              profile_url: 'https://avatars.githubusercontent.com/u/76501952',
              signup_date: '2025-02-14T01:07:56.027Z',
              role: 'enim magna do',
            },
            {
              user_id: 5489048717145960,
              user_email: 'Salma46@yahoo.com',
              profile_url: 'https://avatars.githubusercontent.com/u/2838274',
              signup_date: '2025-02-14T01:07:56.065Z',
              role: 'occaecat non',
            },
          ],
        },
        {
          blueprint_id: -11099432,
          blueprint_title: 'over mmm meanwhile beret',
          blueprint_version_id: -91240137,
          note_id: -4932310,
          note_writer: {
            user_id: 4295363540744363,
            user_email: 'Dovie.Wehner15@yahoo.com',
            profile_url: 'https://avatars.githubusercontent.com/u/1838186',
            signup_date: '2025-02-14T01:07:56.024Z',
            role: 'ut commodo elit',
          },
          note_title:
            '111keenly restaurant piglet moisten with flame marvelous editor',
          is_bookmark: true,
          created_at: '2025-02-13T09:40:48.172Z',
          is_editable: false,
          is_present_image: true,
          read_users: [
            {
              user_id: 6871580398609225,
              user_email: 'Eugenia_Schinner74@hotmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/1365707',
              signup_date: '2025-02-14T01:07:56.026Z',
              role: 'quis in officia',
            },
            {
              user_id: 6699132712018442,
              user_email: 'Marcus6@yahoo.com',
              profile_url: 'https://avatars.githubusercontent.com/u/76501952',
              signup_date: '2025-02-14T01:07:56.027Z',
              role: 'enim magna do',
            },
            {
              user_id: 5489048717145960,
              user_email: 'Salma46@yahoo.com',
              profile_url: 'https://avatars.githubusercontent.com/u/2838274',
              signup_date: '2025-02-14T01:07:56.065Z',
              role: 'occaecat non',
            },
          ],
        },
      ];
      setNotes(mock);
      // 목데이터

      setCursorId(noteData.length > 0 ? noteData[0].note_id : null); // 커서 ID 업데이트
      setLastDate(newLastDate); // 마지막 날짜 구분선 날짜 업데이트
      setLastId(cursorId);

      console.log(notes);
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
      console.log(searchResults);

      // 노트 아이디들 저장
      setSearchedNotes(searchResults);

      // 목업
      const mockIds = [-4932310, -49372310];
      setSearchedNotes(mockIds);
      //

      // 아예 일치하는 노트들이 없다면
      if (mockIds.length === 0) {
        toast({
          title: '일치하는 노트가 없습니다.',
        });
        return;
      }

      // 일치하는 노트 아이디들 중에서도 가장 최신 노트 아이디 저장
      setNextId(mockIds[mockIds.length - 1]);
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
      if (mockIds.length >= 2) {
        setNextId(mockIds[mockIds.length - 2]);
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchSearchNotes();
    }
  };

  const goToPreviousNote = () => {
    if (currentIndex <= 0) return; // 이미 첫 번째 노트면 종료

    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);

    const targetNoteId = searchedNotes[newIndex];
    if (!targetNoteId) return; // 유효한 노트 ID가 없으면 종료

    // 현재 노트 목록에 존재하는지 확인
    if (!notes.some((note) => note.note_id === targetNoteId)) {
      fetchRangeNotes(targetNoteId); // 존재하지 않으면 노트 불러오기
    }

    setSearchTargetId(targetNoteId);
  };

  const goToNextNote = () => {
    if (currentIndex >= searchedNotes.length - 1) return; // 이미 마지막 노트면 종료

    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);

    const targetNoteId = searchedNotes[newIndex];
    if (!targetNoteId) return; // 유효한 노트 ID가 없으면 종료

    // 현재 노트 목록에 존재하는지 확인
    if (!notes.some((note) => note.note_id === targetNoteId)) {
      fetchRangeNotes(targetNoteId); // 존재하지 않으면 노트 불러오기
    }

    setSearchTargetId(targetNoteId);
  };

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
            <div className="p-2 border border-gray-300 rounded w-85">
              <div className="flex items-center space-x-4 justify-between">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="search"
                  className="w-35 focus:outline-none focus:ring-0 border-none"
                />

                <div className="flex gap-2">
                  {/* 검색 버튼 눌렀는데 검색 결과도 없을 때 */}
                  {isSearched && searchedNotes.length == 0 && (
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
                  <button onClick={() => setIsSearching(false)}>
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
                    className={`p-2 ${searchTargetId === note.note_id ? 'bg-yellow-200' : ''}`}
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
