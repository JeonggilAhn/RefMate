import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import NoteButton from './NoteButton';
import NoteSearch from './NoteSearch';
import NoteDetail from './NoteDetail';
import Icon from '../common/Icon';

import { useRecoilState, useRecoilValue } from 'recoil';
import { pinState } from '../../recoil/blueprint';
import { userState } from '../../recoil/common/user';
import { isMyNote } from '../../utils/isMyNote';
import { processNotes } from '../../utils/temp';
import AddNote from './AddNote';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PinNoteSection = ({
  pinInfo,
  onClose,
  pinId,
  detailNote,
  setDetailNote,
  projectId,
  blueprintVersionId,
  isDetailSidebarOpen,
}) => {
  if (detailNote) {
    return (
      <NoteDetail
        noteId={detailNote.note_id}
        onBack={() => setDetailNote(null)}
        isDetailSidebarOpen={isDetailSidebarOpen}
        pinName={pinInfo.pin_name} // pinName props 추가
      />
    );
  }
  const [pins, setPins] = useRecoilState(pinState);
  const [data, setData] = useState({
    pinDetailNotes: [],
  });
  const [open, setOpen] = useState(false);

  const user = useRecoilValue(userState); // 로그인한 유저 정보 가져오기
  console.log(`pinInfo :`, pinInfo);

  useEffect(() => {
    const pin = pins.find((item) => item.pin_id === pinId) || {
      pinDetailNotes: [],
    };
    setData(pin);
  }, [pinId, pins]);

  const processedNotes = useMemo(
    () => processNotes(data.pinDetailNotes),
    [data.pinDetailNotes],
  );

  // 노트 검색
  const [isSearching, setIsSearching] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTargetId, setSearchTargetId] = useState(null); // 검색된 노트 ID 저장
  const noteRefs = useRef({}); // 노트별 ref 저장
  const [highlightedNoteId, setHighlightedNoteId] = useState(null);

  const handleIconClick = () => {
    setIsSearching((prev) => !prev);
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  const handleBack = () => {
    setSelectedNote(null);
  };

  // 검색된 노트 목록 업데이트
  const handleSearchSelect = (note_id) => {
    setSearchTargetId(note_id);
  };

  useEffect(() => {
    console.log('searchTargetId 변경:', searchTargetId);
    if (searchTargetId && noteRefs.current[searchTargetId]) {
      console.log('노트 찾음:', noteRefs.current[searchTargetId]);

      // 현재 노트 스크롤
      noteRefs.current[searchTargetId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      setHighlightedNoteId(searchTargetId);
    }
  }, [searchTargetId]);

  // pin_id가 현재 null
  if (!pinInfo.pin_id) {
    return null;
  }

  return (
    <Container>
      {selectedNote ? (
        <NoteDetail
          noteId={selectedNote.note_id}
          note={detailNote}
          onBack={handleBack}
          isDetailSidebarOpen={isDetailSidebarOpen}
          pinName={pinInfo.pin_name} // pinName props 추가
        />
      ) : (
        <>
          <Header>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger
                asChild
                className="p-0 focus-visible:outline-none focus-visible:ring-0"
              >
                <Button variant="none" className="pl-2">
                  <Icon name="IconIoIosAddCircleOutline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="left"
                align="start"
                alignOffset={0}
                sideOffset={14}
                className="w-80 bg-white border border-gray-300 rounded-md shadow-md z-10 p-0"
              >
                <AddNote
                  setOpen={setOpen}
                  pinInfo={pinInfo}
                  projectId={projectId}
                  blueprintVersionId={blueprintVersionId}
                />
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center justify-center flex-grow gap-2">
              <div>노트</div>
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
            {processedNotes.notesWithSeparators.length === 0 ? (
              <NoData>등록된 노트가 없습니다.</NoData>
            ) : (
              processedNotes.notesWithSeparators.map((note, index) =>
                note.type === 'date-separator' ? (
                  <DateSeparator key={index}>{note.date}</DateSeparator>
                ) : (
                  <div
                    key={note.note_id}
                    ref={(el) => (noteRefs.current[note.note_id] = el)}
                    className={`p-2 ${
                      highlightedNoteId === note.note_id ||
                      searchTargetId === note.note_id
                        ? 'bg-yellow-200'
                        : ''
                    } ${isMyNote(note, user) ? 'items-end' : 'items-start'}`}
                  >
                    <NoteButton
                      note={note}
                      onClick={() => handleNoteClick(note)}
                    />
                  </div>
                ),
              )
            )}
          </NotesContainer>
          {isSearching && (
            <div className="absolute h-auto w-full top-10 bg-white z-20 flex flex-col">
              <NoteSearch
                projectId={projectId}
                pinId={pinId}
                onSelect={handleSearchSelect}
                onClose={() => {
                  setIsSearching(false); // 검색 상태를 false로 설정
                  setSearchTargetId(null); // 하이라이트를 제거하기 위해 searchTargetId를 null로 설정
                  setHighlightedNoteId(null);
                }}
              />
            </div>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 0.0625rem solid #cbcbcb;
  background-color: #ffffff;
  height: 20.5rem;
  width: 100%;
  z-index: 99;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2.5px;
  border-bottom: 1px solid #cbcbcb;
  background-color: #f5f5f5;
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

export default PinNoteSection;
