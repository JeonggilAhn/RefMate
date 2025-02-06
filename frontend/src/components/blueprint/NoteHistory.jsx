import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NoteButton from './NoteButton';
import { get } from '../../api';
import NoteDetail from './NoteDetail';
import Icon from '../common/Icon';
import NoteSearch from './NoteSearch';

const BLUEPRINT_ID = '6430550723600965';
const BLUEPRINT_VERSION = '1287663269766013';

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
  const [notesByDate, setNotesByDate] = useState([]); // 날짜별로 그룹화된 노트 상태
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
  const [isSearching, setIsSearching] = useState(false); // 검색 모드 상태
  const [selectedNote, setSelectedNote] = useState(null); // 노트 상세 정보 상태
  const [pins, setPins] = useState([]); // 핀 데이터 상태

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const apiUrl = `blueprints/${BLUEPRINT_ID}/${BLUEPRINT_VERSION}/pins`; // 블루프린트별 핀 리스트
        const response = await get(apiUrl); // API 호출
        const pinData = response.data.content || []; // 핀 데이터 상태 업데이트
        setPins(pinData);

        // 각 핀에 대한 노트 데이터를 가져옴
        const notesPromises = pinData.map(async (pin) => {
          const notesResponse = await get(`pins/${pin.pin_id}/notes`);
          return (
            notesResponse.data.content?.note_list.map((note) => ({
              ...note,
              pin_name: pin.pin_name,
              pin_group_color: pin.pin_group.pin_group_color,
            })) || []
          );
        });

        const notesResults = await Promise.all(notesPromises);
        const allNotes = notesResults.flat();
        const notesGroupedByDate = processNotes(allNotes); // 노트 데이터를 처리
        setNotesByDate(notesGroupedByDate); // 상태 업데이트
      } catch (error) {
        console.error('핀 데이터 로드 실패:', error.message);
        setErrorMessage('핀 데이터를 불러오는 데 실패했습니다.');
      }
    };

    fetchPins();
  }, []); // 컴포넌트 마운트 시 핀 데이터를 불러옴

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

  if (errorMessage) {
    return <div className="text-center text-gray-500">{errorMessage}</div>;
  }

  return (
    <div className="flex flex-col border border-gray-200 rounded-lg bg-white h-full max-h-[20rem]">
      {selectedNote ? (
        <NoteDetail note={selectedNote} onBack={handleBack} /> // NoteDetail 표시
      ) : (
        <>
          <div className="sticky top-0 z-10 bg-gray-100 p-4 text-lg font-bold text-center border-b border-gray-200 flex justify-between items-center">
            전체 노트
            <button onClick={handleSearchToggle} className="text-gray-600">
              <Icon name="IconTbSearch" width={20} height={20} />{' '}
            </button>
          </div>
          {isSearching ? (
            <NoteSearch /> // 검색 컴포넌트 표시
          ) : (
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
                      <div key={note.note_id} className="flex flex-col gap-1">
                        {note.pin_name && (
                          <PinNameWrapper color={note.pin_group_color}>
                            {note.pin_name.length > 10
                              ? `${note.pin_name.slice(0, 10)}...`
                              : note.pin_name}
                          </PinNameWrapper>
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
          )}
        </>
      )}
    </div>
  );
};

export default NoteHistory;

const PinNameWrapper = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.color || '#ccc'}; /* 배경색 */
  color: white; /* 텍스트 색상 */
  width: 4.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  font-weight: 500; /* 글씨 두께 */
  text-align: center; /* 텍스트 정렬 */
  margin-bottom: 0.5rem; /* 하단 간격 */
  margin-left: 55px; /* 좌측 여백 */
  white-space: nowrap; /* 한 줄로 유지 */
  overflow: hidden; /* 넘치는 텍스트 숨김 */
  text-overflow: ellipsis; /* 초과 텍스트 생략 (...) */
`;
