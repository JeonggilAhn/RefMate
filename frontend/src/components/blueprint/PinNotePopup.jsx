import React, { useState, useMemo, useRef, useCallback, memo } from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { pinState } from '../../recoil/blueprint';
import { processNotes } from '../../utils/temp';

import Icon from '../common/Icon';
import NoteDetail from './NoteDetail';
import NoteButton from './NoteButton';
import NoteSearch from './NoteSearch';
import AddNote from './AddNote';

const NoteList = memo(function NoteList({
  processedNotes,
  searchTargetId,
  onNoteClick,
  noteRefs,
}) {
  if (processedNotes.notesWithSeparators.length === 0) {
    return <NoData>등록된 노트가 없습니다.</NoData>;
  }

  return (
    <>
      {processedNotes.notesWithSeparators.map((note, index) => {
        if (note.type === 'date-separator') {
          return <DateSeparator key={index}>{note.date}</DateSeparator>;
        }
        return (
          <div
            key={note.note_id}
            ref={(el) => (noteRefs.current[note.note_id] = el)}
            className={`p-2 ${
              searchTargetId === note.note_id ? 'bg-yellow-200' : ''
            }`}
          >
            <NoteButton note={note} onClick={() => onNoteClick(note)} />
          </div>
        );
      })}
    </>
  );
});

function PinNotePopup({
  pinInfo,
  onClose,
  isSidebar,
  pinId,
  detailNote,
  setDetailNote,
}) {
  const draggableRef = useRef(null);
  const pins = useRecoilValue(pinState);

  // pinId가 유효할 경우에만 해당 pin 객체 찾기
  const currentPin = useMemo(() => {
    if (!pinId) return null;
    return pins.find((item) => item.pin_id === pinId) || null;
  }, [pinId, pins]);

  // pin이 없으면 아무것도 렌더하지 않음
  if (!pinInfo.pin_id || !currentPin) {
    return null;
  }

  // 노트 배열 가공
  const processedNotes = useMemo(() => {
    return processNotes(currentPin.pinDetailNotes || []);
  }, [currentPin.pinDetailNotes]);

  const [addOpen, setAddOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTargetId, setSearchTargetId] = useState(null);

  const noteRefs = useRef({}); // 노트별 DOM 레퍼런스

  const handleNoteClick = useCallback((note) => {
    setSelectedNote(note);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedNote(null);
    setDetailNote && setDetailNote(null);
  }, [setDetailNote]);

  const handleIconClick = useCallback(() => {
    setIsSearching((prev) => !prev);
  }, []);

  const handleSearchSelect = useCallback((note_id) => {
    setSearchTargetId(note_id);
  }, []);

  // searchTargetId가 변하면 해당 노트로 스크롤
  React.useEffect(() => {
    if (searchTargetId && noteRefs.current[searchTargetId]) {
      noteRefs.current[searchTargetId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [searchTargetId]);

  const { projectId, blueprintVersionId } = useParams();

  if (selectedNote) {
    // 노트 상세 보기
    return (
      <Draggable nodeRef={draggableRef}>
        <Container ref={draggableRef}>
          <NoteDetail
            noteId={selectedNote.note_id}
            note={detailNote}
            onBack={handleBack}
          />
        </Container>
      </Draggable>
    );
  }

  return (
    <Draggable nodeRef={draggableRef}>
      <Container ref={draggableRef}>
        <Header>
          <button className="pl-2" onClick={() => setAddOpen(!addOpen)}>
            <Icon
              name="IconIoIosAddCircleOutline"
              width={20}
              height={20}
              color="#414141"
            />
          </button>
          <div className="flex items-center justify-center flex-grow gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: pinInfo.pin_group.pin_group_color }}
            />
            <div>{pinInfo.pin_name}</div>
          </div>

          {!onClose && (
            <button onClick={handleIconClick} className="pr-2">
              <Icon name="IconTbSearch" width={20} height={20} />
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-gray-500 pr-2">
              <Icon name="IconCgClose" width={20} height={20} />
            </button>
          )}
        </Header>

        <NotesContainer>
          <NoteList
            processedNotes={processedNotes}
            searchTargetId={searchTargetId}
            onNoteClick={handleNoteClick}
            noteRefs={noteRefs}
          />
        </NotesContainer>

        {/* 노트 생성 팝업 */}
        {addOpen && (
          <div className="absolute right-81 w-[300px] rounded-lg border border-[#CBCBCB]">
            <AddNote
              setOpen={setAddOpen}
              pinInfo={pinInfo}
              projectId={projectId}
              blueprintVersionId={blueprintVersionId}
            />
          </div>
        )}

        {/* 검색창 */}
        {isSearching && (
          <div className="absolute top-10 w-full bg-white z-20 flex flex-col">
            <NoteSearch
              onSelect={handleSearchSelect}
              onClose={() => {
                setIsSearching(false);
                setSearchTargetId(null); // 검색창 닫으면 하이라이트 해제
              }}
            />
          </div>
        )}
      </Container>
    </Draggable>
  );
}

export default memo(PinNotePopup);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 0.0625rem solid #cbcbcb;
  background-color: #f5f5f5;
  height: 350px;
  width: 320px;
  z-index: 99;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 2.5px;
  height: 40px;
  border-bottom: 1px solid #cbcbcb;
  background-color: #ffffff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const NotesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.75rem;
  max-height: calc(100% - 3rem);
  box-sizing: border-box;
`;

const DateSeparator = styled.div`
  font-size: 0.875rem;
  font-weight: bold;
  color: #555;
  padding: 0.5rem 0;
  border-top: 1px solid #ddd;
`;

const NoData = styled.div`
  font-size: 1rem;
  color: #999;
  text-align: center;
`;
