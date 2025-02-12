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
  const { blueprint_id, blueprint_version_id } = useParams(); // 컴포넌트 내부로 이동
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
        const apiUrl = `blueprints/${blueprint_id}/${blueprint_version_id}/pins`; // API 호출 URL
        const response = await get(apiUrl); // API 호출
        const pinData = response.data.content || []; // 핀 데이터 상태 업데이트
        setPins(pinData);

        // 각 핀에 대한 노트 데이터를 가져옴
        const { project_id } = useParams();
        const notesPromises = pinData.map(async (pin) => {
          const notesResponse = await get(
            `/pins/${pin.pin_id}/notes?project_id=${project_id}`,
          ); // 핀별 노트 데이터 API 호출
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
      } catch (error) {
        console.error('핀 데이터 로드 실패:', error.message);
        setErrorMessage('핀 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchPins(); // 핀 데이터를 가져오는 함수 실행
  }, []); // 컴포넌트 마운트 시 핀 데이터를 불러옴

  useEffect(() => {
    console.log('searchTargetId 변경:', searchTargetId);
    if (searchTargetId && noteRefs.current[searchTargetId]) {
      console.log('노트 찾음:', noteRefs.current[searchTargetId]);

      // 현재 노트 스크롤
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
  const handleSearchSelect = (note_id) => {
    console.log(note_id);
    setSearchTargetId(note_id);
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
                onClose={() => {
                  setIsSearching(false); // 검색 상태를 false로 설정
                  setSearchTargetId(null); // 하이라이트를 제거하기 위해 searchTargetId를 null로 설정
                }}
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
                      ref={(el) => (noteRefs.current[note.note_id] = el)} // ref 설정
                      id={note.note_id} // id 추가 (하이라이트를 위해 필요)
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
