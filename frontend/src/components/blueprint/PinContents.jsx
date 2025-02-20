import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  memo,
} from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { get } from '../../api';
import { pinState } from '../../recoil/blueprint';
import { processNotes } from '../../utils/temp';
import { userState } from '../../recoil/common/user';
import { Resizable } from 're-resizable';

import Icon from '../common/Icon';
import NotePopupDetail from './NotePopupDetail';
import NoteButton from './NoteButton';
import AddNote from './AddNote';

// 탭 컴포넌트
const Tab = memo(function Tab({ active, onClick, children }) {
  return (
    <TabButton active={active} onClick={onClick}>
      {children}
    </TabButton>
  );
});

// 이미지 리스트 컴포넌트
const ImageList = memo(function ImageList({ detailPinImages }) {
  // 이미지가 없는 경우 처리
  if (!detailPinImages.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <NoData>등록된 이미지가 없습니다.</NoData>
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const allImages = detailPinImages.reduce((acc, pin) => {
    return [...acc, ...(pin.image_list || [])];
  }, []);

  // 이미지 개수에 따른 그리드 컬럼 설정
  const gridCols = allImages.length > 4 ? 3 : allImages.length > 1 ? 2 : 1;
  const imagesToShow =
    allImages.length > 4 ? 12 : allImages.length > 4 ? 4 : allImages.length;

  const handleImageSelect = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const handlePrevImage = () => {
    const newIndex =
      selectedIndex > 0 ? selectedIndex - 1 : allImages.length - 1;
    setSelectedIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  const handleNextImage = () => {
    const newIndex =
      selectedIndex < allImages.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  if (selectedImage) {
    const selectedNote = detailPinImages.find((pin) =>
      pin.image_list.some(
        (img) => img.image_preview === selectedImage.image_preview,
      ),
    );
    const selectedNoteTitle = selectedNote
      ? selectedNote.note_title
      : '제목 없음';

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* 제목 표시 */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-md text-ms font-bold w-[70%] text-center whitespace-normal overflow-hidden text-ellipsis max-h-[3rem] leading-tight">
          {selectedNoteTitle}
        </div>

        {/* 로그아웃 버튼 */}
        <button
          className="absolute top-3 left-3 z-10 p-2 hover:text-gray-200 flex items-center gap-2 rounded-md"
          onClick={() => {
            setSelectedImage(null);
            setSelectedIndex(0);
          }}
        >
          <Icon name="IconTbLogout2" width={24} height={24} color="#000000" />
        </button>

        {/* 이미지 컨테이너 */}
        <div className="w-full h-full px-16">
          {' '}
          {/* 좌우 여백 추가 */}
          <img
            src={selectedImage.image_preview}
            alt="selected"
            className="w-full h-full object-contain"
          />
        </div>

        {/* 이전 이미지 버튼 */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full bg-white shadow-md z-10"
          onClick={(e) => {
            e.stopPropagation();
            handlePrevImage();
          }}
        >
          <Icon
            name="IconGoChevronPrev"
            width={24}
            height={24}
            color="#000000"
          />
        </button>

        {/* 다음 이미지 버튼 */}
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full bg-white shadow-md z-10"
          onClick={(e) => {
            e.stopPropagation();
            handleNextImage();
          }}
        >
          <Icon
            name="IconGoChevronNext"
            width={24}
            height={24}
            color="#000000"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 auto-rows-fr">
        {allImages.slice(0, imagesToShow).map((image, index) => {
          // 해당 이미지가 속한 노트를 찾아 note_title 가져오기
          const parentNote = detailPinImages.find((pin) =>
            pin.image_list.some(
              (img) => img.image_preview === image.image_preview,
            ),
          );
          const noteTitle = parentNote ? parentNote.note_title : '제목 없음';

          return (
            <div
              key={image.image_id}
              className="relative aspect-square w-full cursor-pointer hover:opacity-90"
              onClick={() => handleImageSelect(image, index)}
            >
              {/* 이미지 */}
              <img
                src={image.image_preview}
                alt="reference"
                className="w-full h-full object-cover rounded-md"
              />

              {/* 북마크 표시 */}
              {image.is_bookmark && (
                <div
                  className="absolute top-0 right-0 w-4 h-4 clip-triangle"
                  style={{ backgroundColor: '#87b5fa' }}
                />
              )}

              {/* 호버하면 노트 제목 표시 (반투명 배경) */}
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-white text-sm font-semibold p-2 opacity-0 transition-opacity duration-300 hover:opacity-100">
                {noteTitle}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// 노트 리스트 컴포넌트
const NoteList = memo(function NoteList({
  processedNotes,
  searchTargetId,
  onNoteClick,
  noteRefs,
  user,
  selectedNote,
  onBack,
  detailNote,
  pinName,
  scrollRef,
}) {
  // 컴포넌트 마운트 시 최하단으로 스크롤
  useEffect(() => {
    if (scrollRef.current && !selectedNote) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  if (selectedNote) {
    return (
      <div className="h-full overflow-hidden">
        <NotePopupDetail
          noteId={selectedNote.note_id}
          note={detailNote}
          pinName={pinName}
          onBack={onBack}
        />
      </div>
    );
  }

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
            className={`p-2 flex flex-col ${
              searchTargetId === note.note_id ? 'bg-yellow-200' : ''
            } ${
              user?.user_email === note?.note_writer?.user_email
                ? 'items-end'
                : 'items-start'
            }`}
          >
            <NoteButton note={note} onClick={() => onNoteClick(note)} />
          </div>
        );
      })}
    </>
  );
});

function PinContents({
  pinInfo,
  onClose,
  isSidebar,
  pinId,
  detailNote,
  setDetailNote,
  onClickPin,
  scale = 1,
}) {
  const [activeTab, setActiveTab] = useState('note');
  const [detailPinImages, setDetailPinImages] = useState([]);
  const draggableRef = useRef(null);
  const pins = useRecoilValue(pinState);
  const user = useRecoilValue(userState);

  const currentPin = useMemo(() => {
    if (!pinId) return null;
    return pins.find((item) => item.pin_id === pinId) || null;
  }, [pinId, pins]);

  const processedNotes = useMemo(() => {
    return processNotes(currentPin?.pinDetailNotes || []);
  }, [currentPin?.pinDetailNotes]);

  const [addOpen, setAddOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTargetId, setSearchTargetId] = useState(null);
  const noteRefs = useRef({});

  const [selectedTabs, setSelectedTabs] = useState(['note']);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // 새로운 draggable ref 추가
  const addNoteRef = useRef(null);

  // 스크롤 위치 저장을 위한 ref 추가
  const scrollPositionRef = useRef(0);
  const notesContainerRef = useRef(null);

  useEffect(() => {
    async function fetchImgWithPins() {
      try {
        const response = await get(`pins/${pinInfo.pin_id}/images`);
        console.log(pinInfo);
        const { content } = response.data;
        const images = Array.isArray(content) ? content : [];
        setDetailPinImages(images);

        // 이미지가 있으면 이미지 탭도 함께 열기
        if (images.length > 0) {
          setSelectedTabs((prev) => {
            if (!prev.includes('image')) {
              return [...prev, 'image'];
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('핀 및 노트 데이터 로드 실패:', error);
        setDetailPinImages([]);
      }
    }
    if (pinInfo?.pin_id) {
      fetchImgWithPins();
    }
  }, [pinInfo.pin_id]);

  const handleNoteClick = useCallback((note) => {
    // 노트 클릭 시 현재 스크롤 위치 저장
    if (notesContainerRef.current) {
      scrollPositionRef.current = notesContainerRef.current.scrollTop;
    }
    setSelectedNote(note);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedNote(null);
    setDetailNote && setDetailNote(null);

    // 노트 상세에서 돌아올 때 이전 스크롤 위치로 복원
    requestAnimationFrame(() => {
      if (notesContainerRef.current) {
        notesContainerRef.current.scrollTop = scrollPositionRef.current;
      }
    });
  }, [setDetailNote]);

  const handleTabClick = useCallback(
    (tabName) => {
      if (tabName === 'image' && !detailPinImages.length) {
        return;
      }

      setSelectedTabs((prev) => {
        if (prev.includes(tabName)) {
          if (prev.length > 1) {
            return prev.filter((tab) => tab !== tabName);
          }
          return prev;
        }
        return [...prev, tabName];
      });
    },
    [detailPinImages.length],
  );

  useEffect(() => {
    if (!detailPinImages.length) {
      setSelectedTabs((prev) => prev.filter((tab) => tab !== 'image'));
    }
  }, [detailPinImages]);

  const handleAddNoteClick = useCallback(() => {
    setAddOpen(true);
  }, []);

  const handleSidebarClick = useCallback(() => {
    if (onClickPin && onClose) {
      onClickPin(pinInfo);
      onClose();
    }
  }, [onClickPin, onClose, pinInfo]);

  // 스크롤을 최하단으로 이동시키는 함수
  const scrollToBottom = useCallback(() => {
    if (notesContainerRef.current) {
      requestAnimationFrame(() => {
        notesContainerRef.current.scrollTop =
          notesContainerRef.current.scrollHeight;
      });
    }
  }, []);

  if (!pinInfo.pin_id || !currentPin) {
    return null;
  }

  return (
    <>
      <Draggable
        nodeRef={draggableRef}
        onStart={(e) => {
          if (e.target.classList.contains('resize-handle')) {
            return false;
          }
          e.stopPropagation();
        }}
        handle=".handle"
        cancel=".no-drag, .resize-handle"
        scale={scale}
        defaultPosition={{ x: 0, y: 0 }}
        position={null}
      >
        <div ref={draggableRef}>
          <Resizable
            defaultSize={{
              width: selectedTabs.length > 1 ? 640 : 320,
              height: 350,
            }}
            minWidth={selectedTabs.length > 1 ? 640 : 320}
            minHeight={350}
            maxWidth={800}
            maxHeight={600}
            handleClasses={{
              top: 'resize-handle top',
              right: 'resize-handle right',
              bottom: 'resize-handle bottom',
              left: 'resize-handle left',
              topRight: 'resize-handle topRight',
              bottomRight: 'resize-handle bottomRight',
              bottomLeft: 'resize-handle bottomLeft',
              topLeft: 'resize-handle topLeft',
            }}
            enable={{
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }}
          >
            <Container className="prevent-zoom" data-pin-contents>
              <Header
                className="handle"
                backgroundColor={pinInfo.pin_group.pin_group_color_light}
              >
                <TabContainer>
                  <TabIconButton
                    active={selectedTabs.includes('note')}
                    onClick={() => handleTabClick('note')}
                    backgroundColor={pinInfo.pin_group.pin_group_color}
                  >
                    <Icon
                      name="IconTbNotes"
                      width={15}
                      height={15}
                      color={
                        selectedTabs.includes('note')
                          ? pinInfo.pin_group.pin_group_color_light
                          : '#666666'
                      }
                    />
                  </TabIconButton>
                  {detailPinImages.length > 0 && (
                    <TabIconButton
                      active={selectedTabs.includes('image')}
                      onClick={() => handleTabClick('image')}
                      backgroundColor={pinInfo.pin_group.pin_group_color}
                    >
                      <Icon
                        name="IconTbPhoto"
                        width={15}
                        height={15}
                        color={
                          selectedTabs.includes('image')
                            ? pinInfo.pin_group.pin_group_color_light
                            : '#666666'
                        }
                      />
                    </TabIconButton>
                  )}
                </TabContainer>
                <div className="flex items-center justify-center flex-grow gap-2">
                  <div className="relative group flex items-center justify-center flex-1 gap-1">
                    <Icon
                      name="IconTbPinFill"
                      width={25}
                      height={25}
                      color={pinInfo.pin_group.pin_group_color}
                    />
                    <span
                      className={`${
                        selectedTabs.length > 1
                          ? 'max-w-[24rem]'
                          : 'max-w-[8rem]'
                      } text-sm font-medium truncate text-center`}
                    >
                      {pinInfo.pin_name}
                    </span>
                    <div className="absolute hidden group-hover:block left-0 bottom-10 bg-black bg-opacity-75 text-white p-2 rounded-md text-sm whitespace-nowrap z-20">
                      {pinInfo.pin_name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pr-2">
                  <button
                    onClick={handleSidebarClick}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Icon name="IconLuPanelRight" width={20} height={20} />
                  </button>
                  {onClose && (
                    <button
                      onClick={onClose}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Icon name="IconCgClose" width={20} height={20} />
                    </button>
                  )}
                </div>
              </Header>

              <ContentContainer selectedCount={selectedTabs.length}>
                {selectedTabs.includes('note') && (
                  <ContentSection>
                    <NotesContainer hasSelectedNote={!!selectedNote}>
                      <NoteListWrapper
                        hasSelectedNote={!!selectedNote}
                        ref={notesContainerRef}
                      >
                        <NoteList
                          processedNotes={processedNotes}
                          searchTargetId={searchTargetId}
                          onNoteClick={handleNoteClick}
                          noteRefs={noteRefs}
                          user={user}
                          selectedNote={selectedNote}
                          onBack={handleBack}
                          detailNote={detailNote}
                          pinName={pinInfo.pin_name}
                          scrollRef={notesContainerRef}
                        />
                      </NoteListWrapper>
                      {!selectedNote && (
                        <AddNoteButton onClick={handleAddNoteClick}>
                          <Icon
                            name="IconIoIosAddCircleOutline"
                            width={28}
                            height={28}
                            color="#ffffff"
                          />
                          {/* <span>노트 추가</span> */}
                        </AddNoteButton>
                      )}
                    </NotesContainer>
                  </ContentSection>
                )}
                {selectedTabs.includes('image') && (
                  <ContentSection>
                    <ImageList detailPinImages={detailPinImages} />
                  </ContentSection>
                )}
              </ContentContainer>

              {addOpen && (
                <AddNoteWrapper>
                  <AddNote
                    setOpen={setAddOpen}
                    pinInfo={pinInfo}
                    projectId={useParams().projectId}
                    blueprintVersionId={useParams().blueprint_version_id}
                    setDetailPinImages={setDetailPinImages}
                    detailPinImages={detailPinImages}
                    setSelectedTabs={setSelectedTabs}
                    onNoteAdded={scrollToBottom}
                  />
                </AddNoteWrapper>
              )}
            </Container>
          </Resizable>
        </div>
      </Draggable>
    </>
  );
}

export default memo(PinContents);

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  border: 0.0625rem solid #cbcbcb;
  background-color: #f5f5f5;
  z-index: 99;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  overflow: visible;
  transform-origin: 0 0;
  width: 100%;
  height: 100%;

  // 스크롤 이벤트 처리를 위한 클래스 추가
  &.prevent-zoom {
    * {
      // 모든 자식 요소들에 대해서도 적용
      &:hover {
        isolation: isolate;
      }
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 2.5px;
  height: 40px;
  border-bottom: 1px solid #cbcbcb;
  background-color: ${(props) => props.backgroundColor || '#ffffff'};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  padding-left: 8px;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 8px;
  text-align: center;
  background-color: ${(props) => (props.active ? '#f5f5f5' : '#ffffff')};
  border-bottom: ${(props) =>
    props.active ? '2px solid #2563eb' : '2px solid transparent'};
  color: ${(props) => (props.active ? '#2563eb' : '#666666')};
  font-weight: ${(props) => (props.active ? '600' : '400')};
`;

const NotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
  gap: 0.75rem;
  height: 100%;
  position: relative;
  ${(props) =>
    props.hasSelectedNote &&
    `
    overflow: hidden;
    padding: 0;
  `}
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

const NoteListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  ${(props) =>
    props.hasSelectedNote &&
    `
    overflow: hidden;
    height: 100%;
  `}
`;

const AddNoteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px;
  width: 40px;
  height: 40px;
  background-color: #87b5fa;
  border: 1px solid #cbcbcb;
  border-radius: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
  position: absolute;
  bottom: 5px;
  left: 5px;

  &:hover {
    background-color: #f0f0f0;
  }

  span {
    font-size: 14px;
    color: #414141;
  }
`;

const AddNoteWrapper = styled.div`
  position: absolute;
  top: 0;
  left: -310px;
  width: 300px;
  height: 350px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #cbcbcb;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  z-index: 999;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 40px); // Header 높이 40px 제외
  overflow: hidden;
`;

const ContentSection = styled.div`
  flex: 1;
  min-width: 0; // flex item이 너무 작아지는 것 방지
  border-right: 1px solid #cbcbcb;
  overflow-y: auto;
  height: 100%;

  &:last-child {
    border-right: none;
  }
`;

const TabIconButton = styled.button`
  padding: 8px;
  border-radius: 4px;
  background-color: ${(props) =>
    props.active ? props.backgroundColor : 'transparent'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f0f0f0;
  }
`;
