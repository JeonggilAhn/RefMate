import React, { useEffect, useState, useRef } from 'react';
import { get } from '../../api';
import NoteButton from './NoteButton';
import NoteDetail from './NoteDetail';
import Icon from '../common/Icon';
import { Skeleton } from '@/components/ui/skeleton';
import NoteSearch from './NoteSearch';
import { useParams } from 'react-router-dom';

// 노트 데이터를 날짜별로 그룹화하고 정렬하는 함수
const processNotes = (noteList) => {
  if (!Array.isArray(noteList)) {
    throw new Error('note_list 데이터가 배열 형식이 아닙니다.');
  }

  // 작성일 기준으로 노트를 정렬
  const sortedNotes = noteList.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  // 날짜별로 노트를 그룹화
  const groupedByDate = sortedNotes.reduce((acc, note) => {
    const date = new Date(note.created_at).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(note);
    return acc;
  }, {});

  // 날짜별 그룹을 배열로 변환하고 역순 정렬
  return Object.entries(groupedByDate)
    .map(([date, notes]) => ({
      date,
      notes: notes.reverse(),
    }))
    .reverse();
};

const NoteHistory = () => {
  const { BLUEPRINT_ID, BLUEPRINT_VERSION } = useParams(); // 블루프린트 ID
  const [notesByDate, setNotesByDate] = useState([]); // 날짜별로 그룹화된 노트 상태
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
  const [isSearching, setIsSearching] = useState(false); // 검색 모드 상태
  const [selectedNote, setSelectedNote] = useState(null); // 노트 상세 정보 상태
  const [pins, setPins] = useState([]); // 핀 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [searchTargetId, setSearchTargetId] = useState(null); // 검색된 노트 ID 저장
  const noteRefs = useRef({}); // 노트별 ref 저장

  useEffect(() => {
    const fetchPins = async () => {
      try {
        setLoading(true); // 로딩 시작
        const apiUrl = `blueprints/${BLUEPRINT_ID}/${BLUEPRINT_VERSION}/pins`; // API 호출 URL
        const response = await get(apiUrl); // API 호출
        const pinData = response.data.content || []; // 핀 데이터 상태 업데이트
        setPins(pinData);

        // 각 핀에 대한 노트 데이터를 가져옴
        const notesPromises = pinData.map(async (pin) => {
          const notesResponse = await get(`pins/${pin.pin_id}/notes`); // 핀별 노트 데이터 API 호출
          return (
            notesResponse.data.content?.note_list.map((note) => ({
              ...note,
              pin_name: pin.pin_name, // 핀 이름 추가
              pin_group_color: pin.pin_group.pin_group_color, // 핀 그룹 색상 추가
            })) || []
          );
        });

        const notesResults = await Promise.all(notesPromises); // 모든 노트 데이터를 비동기로 가져옴
        const allNotes = notesResults.flat(); // 가져온 노트 데이터를 하나의 배열로 합침
        const notesGroupedByDate = processNotes(allNotes); // 노트를 날짜별로 그룹화
        setNotesByDate(notesGroupedByDate); // 상태 업데이트

        // 각 핀에 대한 노트 데이터 (목업 데이터 사용)
        const mockNotes = [
          {
            note_id: 5845445,
            note_writer: {
              user_id: 8937565865589817,
              user_email: 'Olin.Paucek@yahoo.com',
              profile_url: 'https://avatars.githubusercontent.com/u/617429',
              signup_date: '2025-02-07T08:01:26.458Z',
              role: 'nisi mollit quis sit',
            },
            note_title: 'puzzled hmph blond except disposer quash than',
            created_at: '2025-02-06T20:42:30.148Z',
            is_editable: false,
            is_present_image: true,
            read_users: [
              {
                user_id: 4569878562513893,
                user_email: 'Antonio63@yahoo.com',
                profile_url: 'https://avatars.githubusercontent.com/u/4951571',
                signup_date: '2025-02-07T08:01:26.459Z',
                role: 'in sit',
              },
            ],
          },
          {
            note_id: -74623705,
            note_writer: {
              user_id: 6202887093682253,
              user_email: 'Amara91@gmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/76738418',
              signup_date: '2025-02-07T08:01:26.468Z',
              role: 'proident enim fugiat',
            },
            note_title: 'mmm obnoxiously twin brr case',
            created_at: '2025-02-07T02:51:01.877Z',
            is_editable: true,
            is_present_image: true,
            read_users: [
              {
                user_id: 5152745109732729,
                user_email: 'Justyn.Padberg@hotmail.com',
                profile_url: 'https://avatars.githubusercontent.com/u/73429758',
                signup_date: '2025-02-07T08:01:26.469Z',
                role: 'aliqua velit amet enim',
              },
              {
                user_id: 6441004563989400,
                user_email: 'Bernadine11@hotmail.com',
                profile_url: 'https://avatars.githubusercontent.com/u/79590346',
                signup_date: '2025-02-07T08:01:26.470Z',
                role: 'tempor',
              },
            ],
          },
          {
            note_id: -746237051,
            note_writer: {
              user_id: 6202887093682253,
              user_email: 'Amara91@gmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/76738418',
              signup_date: '2025-02-07T08:01:26.468Z',
              role: 'proident enim fugiat',
            },
            note_title: 'mmm obnoxiously twin brr case',
            created_at: '2025-02-07T02:51:01.877Z',
            is_editable: true,
            is_present_image: true,
            read_users: [
              {
                user_id: 5152745109732729,
                user_email: 'Justyn.Padberg@hotmail.com',
                profile_url: 'https://avatars.githubusercontent.com/u/73429758',
                signup_date: '2025-02-07T08:01:26.469Z',
                role: 'aliqua velit amet enim',
              },
              {
                user_id: 6441004563989400,
                user_email: 'Bernadine11@hotmail.com',
                profile_url: 'https://avatars.githubusercontent.com/u/79590346',
                signup_date: '2025-02-07T08:01:26.470Z',
                role: 'tempor',
              },
            ],
          },
          {
            note_id: -746237052,
            note_writer: {
              user_id: 6202887093682253,
              user_email: 'Amara91@gmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/76738418',
              signup_date: '2025-02-07T08:01:26.468Z',
              role: 'proident enim fugiat',
            },
            note_title: 'mmm obnoxiously twin brr case',
            created_at: '2025-02-07T02:51:01.877Z',
            is_editable: true,
            is_present_image: true,
            read_users: [
              {
                user_id: 5152745109732729,
                user_email: 'Justyn.Padberg@hotmail.com',
                profile_url: 'https://avatars.githubusercontent.com/u/73429758',
                signup_date: '2025-02-07T08:01:26.469Z',
                role: 'aliqua velit amet enim',
              },
              {
                user_id: 6441004563989400,
                user_email: 'Bernadine11@hotmail.com',
                profile_url: 'https://avatars.githubusercontent.com/u/79590346',
                signup_date: '2025-02-07T08:01:26.470Z',
                role: 'tempor',
              },
            ],
          },
          {
            note_id: -746237053,
            note_writer: {
              user_id: 6202887093682253,
              user_email: 'Amara91@gmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/76738418',
              signup_date: '2025-02-07T08:01:26.468Z',
              role: 'proident enim fugiat',
            },
            note_title: 'mmm obnoxiously twin brr case',
            created_at: '2025-02-07T02:51:01.877Z',
            is_editable: true,
            is_present_image: true,
            read_users: [
              {
                user_id: 5152745109732729,
                user_email: 'Justyn.Padberg@hotmail.com',
                profile_url: 'https://avatars.githubusercontent.com/u/73429758',
                signup_date: '2025-02-07T08:01:26.469Z',
                role: 'aliqua velit amet enim',
              },
              {
                user_id: 6441004563989400,
                user_email: 'Bernadine11@hotmail.com',
                profile_url: 'https://avatars.githubusercontent.com/u/79590346',
                signup_date: '2025-02-07T08:01:26.470Z',
                role: 'tempor',
              },
            ],
          },
          {
            note_id: -1746237053,
            note_writer: {
              user_id: 6202887093682253,
              user_email: 'Amara91@gmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/76738418',
              signup_date: '2025-02-07T08:01:26.468Z',
              role: 'proident enim fugiat',
            },
            note_title: 'mmm obnoxiously twin brr case',
            created_at: '2025-02-07T02:51:01.877Z',
            is_editable: true,
            is_present_image: true,
            read_users: [
              {
                user_id: 5152745109732729,
                user_email: 'Justyn.Padberg@hotmail.com',
                profile_url: 'https://avatars.githubusercontent.com/u/73429758',
                signup_date: '2025-02-07T08:01:26.469Z',
                role: 'aliqua velit amet enim',
              },
              {
                user_id: 6441004563989400,
                user_email: 'Bernadine11@hotmail.com',
                profile_url: 'https://avatars.githubusercontent.com/u/79590346',
                signup_date: '2025-02-07T08:01:26.470Z',
                role: 'tempor',
              },
            ],
          },
          {
            note_id: -7462237053,
            note_writer: {
              user_id: 6202887093682253,
              user_email: 'Amara91@gmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/76738418',
              signup_date: '2025-02-07T08:01:26.468Z',
              role: 'proident enim fugiat',
            },
            note_title: 'mmm obnoxiously twin brr case',
            created_at: '2025-02-07T02:51:01.877Z',
            is_editable: true,
            is_present_image: true,
            read_users: [
              {
                user_id: 5152745109732729,
                user_email: 'Justyn.Padberg@hotmail.com',
                profile_url: 'https://avatars.githubusercontent.com/u/73429758',
                signup_date: '2025-02-07T08:01:26.469Z',
                role: 'aliqua velit amet enim',
              },
              {
                user_id: 6441004563989400,
                user_email: 'Bernadine11@hotmail.com',
                profile_url: 'https://avatars.githubusercontent.com/u/79590346',
                signup_date: '2025-02-07T08:01:26.470Z',
                role: 'tempor',
              },
            ],
          },
        ];

        const notesGroupedByDate1 = processNotes(mockNotes);
        setNotesByDate(notesGroupedByDate1);
        // 목업 테스트
      } catch (error) {
        console.error('핀 데이터 로드 실패:', error.message);
        setErrorMessage('핀 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchPins(); // 핀 데이터를 가져오는 함수 실행
  }, []); // 컴포넌트 마운트 시 핀 데이터를 불러옴

  // 검색된 노트가 변경될 때 스크롤 및 하이라이팅 처리
  useEffect(() => {
    if (searchTargetId && noteRefs.current[searchTargetId]) {
      noteRefs.current[searchTargetId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [searchTargetId]);

  // 검색 모드 토글
  const handleSearchToggle = () => {
    setIsSearching((prev) => !prev);
  };

  // 노트 클릭 시 상세보기 열기
  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  // NoteDetail에서 뒤로 가기 기능
  const handleBack = () => {
    setSelectedNote(null);
  };

  // 검색된 노트 목록 업데이트
  const handleSearchSelect = (note) => {
    setSearchTargetId(note.note_id);
  };

  if (loading) {
    // 로딩 중 Skeleton 표시
    return (
      <div className="flex flex-col border border-gray-200 rounded-lg bg-white h-full max-h-[20rem]">
        <div className="sticky top-0 z-10 bg-gray-100 p-4 text-lg font-bold text-center border-b border-gray-200">
          전체 노트
        </div>
        <div className="flex flex-col gap-2 p-4">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-5 rounded-md bg-gray-200"
              />
            ))}
        </div>
      </div>
    );
  }

  if (errorMessage) {
    // 에러 발생 시 메시지 표시
    return <div className="text-center text-gray-500">{errorMessage}</div>;
  }

  return (
    <div className="flex flex-col border border-gray-200 rounded-lg bg-white h-full max-h-[20rem]">
      {selectedNote ? (
        <NoteDetail note={selectedNote} onBack={handleBack} />
      ) : (
        <>
          <div className="sticky top-0 z-10 bg-gray-100 p-4 text-lg font-bold text-center border-b border-gray-200 flex justify-between items-center">
            전체 노트
            <button onClick={handleSearchToggle} className="text-gray-600">
              <Icon name="IconTbSearch" width={20} height={20} />
            </button>
          </div>
          {isSearching && (
            <div className="absolute h-auto w-full top-42 bg-white z-20 flex flex-col">
              <NoteSearch
                onSelect={handleSearchSelect}
                onClose={() => setIsSearching(false)}
              />
            </div>
          )}
          <div className="flex-1 overflow-y-auto flex flex-col p-4 gap-3">
            {notesByDate.length === 0 ? (
              <div className="text-center text-gray-500">
                등록된 노트가 없습니다.
              </div>
            ) : (
              notesByDate.map(({ date, notes }) => (
                <React.Fragment key={date}>
                  <div className="text-sm font-bold text-gray-600 py-2 border-t border-gray-300">
                    {date}
                  </div>
                  {notes.map((note) => (
                    <div
                      key={note.note_id}
                      ref={(el) => (noteRefs.current[note.note_id] = el)}
                      className={`p-2 ${searchTargetId === note.note_id ? 'bg-yellow-200' : ''}`}
                    >
                      {note.pin_name && (
                        <div
                          style={{
                            backgroundColor: note.pin_group_color || '#ccc',
                          }}
                          className="inline-flex justify-center items-center text-white w-[4.5rem] h-6 rounded-sm text-xs font-medium ml-14"
                        >
                          {note.pin_name.length > 7
                            ? `${note.pin_name.slice(0, 7)}...`
                            : note.pin_name}
                        </div>
                      )}
                      <NoteButton
                        note={note}
                        onClick={() => handleNoteClick(note)}
                      />
                    </div>
                  ))}
                </React.Fragment>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NoteHistory;
