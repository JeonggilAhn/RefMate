import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import NoteButton from './NoteButton';
import NoteSearch from './NoteSearch';
import NoteDetail from './NoteDetail';
import Icon from '../common/Icon';
import Draggable from 'react-draggable';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { post } from '../../api';
import { useParams } from 'react-router-dom';
import ImageUploader from '../common/ImageUploader';
import { processNotes } from '../../utils/temp';
import { useRecoilState } from 'recoil';
import { pinState } from '../../recoil/blueprint';

const PinNotes = ({ pinInfo, onClose, isSidebar, pinId }) => {
  const [pins, setPins] = useRecoilState(pinState);
  const [data, setData] = useState({
    pinDetailNotes: [],
  });

  useEffect(() => {
    const pin = pins.find((item) => item.pin_id === pinId) || {
      pinDetailNotes: [],
    };
    setData(pin);
  }, [pinId, pins]);

  // 노트 추가
  const { projectId: project_id, blueprint_version_id: blueprint_version_id } =
    useParams(); // projectId 가져오기
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [open, setOpen] = useState(false);

  // 노트 검색
  const [isSearching, setIsSearching] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTargetId, setSearchTargetId] = useState(null); // 검색된 노트 ID 저장
  const noteRefs = useRef({}); // 노트별 ref 저장

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
    }
  }, [searchTargetId]);

  // pin_id가 현재 null
  if (!pinInfo.pin_id) {
    return null;
  }

  const handleImageSelect = (urls) => {
    setImageUrls(urls);
  };

  // 노트 생성 로직
  const handleSubmit = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    try {
      const response = await post(`pins/${pinInfo.pin_id}/notes`, {
        blueprint_version_id: blueprint_version_id,
        project_id: project_id,
        note_title: noteTitle,
        note_content: noteContent,
        image_url_list: imageUrls,
      });

      const newNote = {
        note_id: null,
        note_writer: {
          user_id: 1,
          user_email: '',
          profile_url: '',
          signup_date: '',
          role: '',
        },
        note_title: noteTitle,
        is_bookmark: false,
        created_at: new Date(),
        is_editable: true,
        is_present_image: true,
        read_users: [],
      };

      setPins((prev) => {
        return prev.map((item) => {
          if (item.pin_id === pinInfo.pin_id) {
            return {
              ...item,
              pinDetailNotes: processNotes([
                ...item.pinDetailNotes[0].notes,
                { ...newNote, note_id: Number(response.data.content.note_id) },
              ]),
            };
          }

          return item;
        });
      });

      if (response.status === 201) {
        alert('노트 생성 성공');
        setOpen(false);
        setNoteTitle('');
        setNoteContent('');
      } else {
        alert('노트 생성 실패');
      }
    } catch (error) {
      console.error('노트 생성 중 오류 발생:', error);
      alert('노트 생성 실패');
    }
  };

  const handleOpen = () => {
    setNoteTitle('');
    setNoteContent('');
    setOpen(true);
  };

  return (
    <Draggable disabled={isSidebar}>
      <Container>
        {selectedNote ? (
          <NoteDetail note={selectedNote} onBack={handleBack} />
        ) : (
          <>
            <Header>
              <DropdownMenu open={open} modal={false}>
                <DropdownMenuTrigger
                  asChild
                  className="p-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  <Button variant="none" onClick={handleOpen}>
                    <Icon name="IconIoIosAddCircleOutline" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="left"
                  align="start"
                  sideOffset={30}
                  className="w-80 bg-white border border-gray-300 rounded-md shadow-md z-10"
                >
                  {/* 헤더 */}
                  <div className="flex justify-between items-center border-b pb-2 mb-3">
                    <div className="text-lg font-semibold">새 노트</div>
                    <button
                      onClick={() => setOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Icon name="IconCgClose" width={24} height={24} />
                    </button>
                  </div>

                  {/* 제목 입력 */}
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="노트 제목"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-0 outline-none mb-3"
                  />

                  {/* 내용 입력 */}
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="노트 내용"
                    className="w-full h-24 border border-gray-300 rounded-md p-2 text-sm focus:ring-0 outline-none resize-none mb-3"
                  />

                  <div className="relative">
                    <ImageUploader
                      onImageSelect={handleImageSelect}
                      projectId={project_id}
                      type="note"
                    />
                    <div className="absolute bottom-0 right-0">
                      <button
                        onClick={handleSubmit}
                        className={`px-4 py-2 text-white rounded-md ${
                          noteTitle.trim() && noteContent.trim()
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-gray-300 cursor-not-allowed opacity-50'
                        }`}
                        disabled={!noteTitle.trim() || !noteContent.trim()}
                      >
                        저장
                      </button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center justify-center flex-grow gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: pinInfo.pin_group.pin_group_color }}
                ></div>
                <div>{pinInfo.pin_name}</div>
              </div>

              {!onClose && (
                <button onClick={handleIconClick}>
                  <Icon name="IconTbSearch" width={20} height={20} />
                </button>
              )}
              {onClose && (
                <button onClick={onClose} className="text-gray-500">
                  <Icon name="IconCgClose" width={24} height={24} />
                </button>
              )}
            </Header>
            <NotesContainer>
              {data.pinDetailNotes.length === 0 ? (
                <NoData>등록된 노트가 없습니다.</NoData>
              ) : (
                data.pinDetailNotes.map(({ date, notes }) => (
                  <React.Fragment key={date}>
                    <DateSeparator>{date}</DateSeparator>
                    {notes.map((note) => (
                      <NoteWithPinWrapper
                        key={note.note_id}
                        ref={(el) => (noteRefs.current[note.note_id] = el)} // ref 설정
                        id={note.note_id} // id 추가 (하이라이트를 위해 필요)
                        className={`p-2 ${searchTargetId === note.note_id ? 'bg-yellow-200' : ''}`}
                      >
                        <NoteButton
                          note={note}
                          onClick={() => handleNoteClick(note)}
                        />
                      </NoteWithPinWrapper>
                    ))}
                  </React.Fragment>
                ))
              )}
            </NotesContainer>
            {isSearching && (
              <div className="absolute h-auto w-full top-14 bg-white z-20 flex flex-col">
                <NoteSearch
                  onSelect={handleSearchSelect}
                  onClose={() => {
                    setIsSearching(false); // 검색 상태를 false로 설정
                    setSearchTargetId(null); // 하이라이트를 제거하기 위해 searchTargetId를 null로 설정
                  }}
                />
              </div>
            )}
          </>
        )}
      </Container>
    </Draggable>
  );
};

export default PinNotes;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 0.0625rem solid #e0e0e0;
  background-color: #fff;
  height: 20rem;
  width: 100%;
  z-index: 99;
  border-radius: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  border-radius: 10px;
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

const NoteWithPinWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const NoData = styled.div`
  font-size: 1rem;
  color: #999;
  text-align: center;
`;
