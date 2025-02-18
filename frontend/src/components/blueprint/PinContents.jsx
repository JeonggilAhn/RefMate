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
import { isMyNote } from '../../utils/isMyNote';

import Icon from '../common/Icon';
import NoteDetail from './NoteDetail';
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
    return (
      <div className="relative w-full h-full">
        <button
          className="absolute top-4 left-4 z-10 p-2 hover:text-gray-200 flex items-center gap-2"
          onClick={() => {
            setSelectedImage(null);
            setSelectedIndex(0);
          }}
        >
          <Icon name="IconTbLogout2" width={24} height={24} color="#000000" />
        </button>

        {/* 이전 이미지 버튼 */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full"
          onClick={handlePrevImage}
        >
          <Icon
            name="IconTbChevronLeft"
            width={24}
            height={24}
            color="#000000"
          />
        </button>

        {/* 다음 이미지 버튼 */}
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full"
          onClick={handleNextImage}
        >
          <Icon
            name="IconTbChevronRight"
            width={24}
            height={24}
            color="#000000"
          />
        </button>

        <img
          src={selectedImage.image_preview}
          alt="selected"
          className="w-full h-full object-contain p-4"
        />
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <div className={`w-full grid grid-cols-${gridCols} gap-2`}>
        {allImages.slice(0, imagesToShow).map((image, index) => (
          <div
            key={image.image_id}
            className="relative aspect-square cursor-pointer hover:opacity-90"
            onClick={() => handleImageSelect(image, index)}
          >
            <img
              src={image.image_preview}
              alt="reference"
              className="w-full h-full object-cover rounded-md"
            />
            {image.is_bookmark && (
              <div
                className="absolute top-0 right-0 w-4 h-4 clip-triangle"
                style={{ backgroundColor: '#87b5fa' }}
              />
            )}
          </div>
        ))}
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
        const isMine = isMyNote(note, user);

        return (
          <div
            key={note.note_id}
            ref={(el) => (noteRefs.current[note.note_id] = el)}
            className={`p-2 ${
              searchTargetId === note.note_id ? 'bg-yellow-200' : ''
            } ${isMine ? 'items-end' : 'items-start'}`}
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
    setSelectedNote(note);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedNote(null);
    setDetailNote && setDetailNote(null);
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

  if (!pinInfo.pin_id || !currentPin) {
    return null;
  }

  if (selectedNote) {
    return (
      <Draggable nodeRef={draggableRef}>
        <Container
          ref={draggableRef}
          style={{ width: '320px', minWidth: '320px' }}
        >
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
    <>
      <Draggable
        nodeRef={draggableRef}
        onStart={(e) => {
          e.stopPropagation();
        }}
        cancel=".no-drag"
      >
        <Container
          ref={draggableRef}
          data-pin-contents="true"
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          style={{ touchAction: 'none' }}
        >
          <Header backgroundColor={pinInfo.pin_group.pin_group_color_light}>
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
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: pinInfo.pin_group.pin_group_color }}
              />
              <div>{pinInfo.pin_name}</div>
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
                <NotesContainer>
                  <NoteListWrapper>
                    <NoteList
                      processedNotes={processedNotes}
                      searchTargetId={searchTargetId}
                      onNoteClick={handleNoteClick}
                      noteRefs={noteRefs}
                      user={user}
                    />
                  </NoteListWrapper>
                  <AddNoteButton onClick={handleAddNoteClick}>
                    <Icon
                      name="IconIoIosAddCircleOutline"
                      width={20}
                      height={20}
                      color="#414141"
                    />
                    <span>노트 추가</span>
                  </AddNoteButton>
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
                detailPinImages={detailPinImages}
                setDetailPinImages={setDetailPinImages}
              />
            </AddNoteWrapper>
          )}
        </Container>
      </Draggable>
    </>
  );
}

export default memo(PinContents);

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border: 0.0625rem solid #cbcbcb;
  background-color: #f5f5f5;
  height: 350px;
  width: auto;
  min-width: 320px;
  z-index: 99;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  overflow: visible;
  transition: width 0.3s ease;
  animation: scaleUp 0.2s ease-out;
  transform-origin: 0 0;

  @keyframes scaleUp {
    from {
      transform: scale(0);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
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
  padding: 1rem;
  gap: 0.75rem;
  height: 100%;
  position: relative;
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
  margin-bottom: 60px;
`;

const AddNoteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  width: calc(100% - 2rem);
  background-color: #ffffff;
  border: 1px solid #cbcbcb;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: absolute;
  bottom: 1rem;
  left: 1rem;

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
  width: ${(props) => (props.selectedCount > 1 ? '640px' : '320px')};
  transition: width 0.3s ease;
  height: calc(100% - 40px);
  overflow: hidden;
`;

const ContentSection = styled.div`
  flex: 0 0 320px;
  width: 320px;
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
