import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { get, del, patch } from '../../api';
import { useRecoilState } from 'recoil';
import { importantNotesState } from '../../recoil/blueprint';
import { modalState } from '../../recoil/common/modal';
import Confirm from '../../components/common/Confirm';
import Icon from '../common/Icon';
import EditNote from './EditNote';
import ImageCarouselPopup from '../blueprint/ImageCarouselPopup';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const NoteDetail = ({ noteId, onBack, isDetailSidebarOpen, pinName }) => {
  const [noteData, setNoteData] = useState(null);
  const [modal, setModal] = useRecoilState(modalState);
  const [isBookmark, setIsBookmark] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const { toast } = useToast(20);
  const [importantNotes, setImportantNotes] =
    useRecoilState(importantNotesState); // 전역 상태 사용

  // 이미지 팝업 상태
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [detailPopupImages, setDetailPopupImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchNote = async () => {
      console.log('noteId : ', noteId);
      try {
        const response = await get(`notes/${noteId}`);
        const note = response.data.content.note;
        const pinGroup = response.data.content.pin_group; // 핀 그룹 정보 추가
        setNoteData({ ...note, pin_group: pinGroup });
        setIsBookmark(note.is_bookmark);
      } catch (error) {
        console.error('Failed to fetch note:', error);
      }
    };

    fetchNote();
  }, [noteId]);

  // 수정된 데이터를 반영하는 함수 (EditNote에서 사용)

  const handleUpdateNote = (updatedNote) => {
    setNoteData((prev) => ({
      ...prev,
      ...updatedNote,
    }));
  };

  // 노트 삭제 기능

  const handleDelete = () => {
    setModal({
      type: 'confirm',
      message: '정말 삭제하시겠습니까?',
      onConfirm: async () => {
        try {
          const response = await del(`notes/${noteId}`);
          if (response.status === 200) {
            toast({
              title: '노트가 삭제되었습니다.',
              description: String(new Date()),
            });
            setNoteData(null);
            onBack();
          } else {
            toast({
              title: '노트 삭제에 실패했습니다.',
              description: String(new Date()),
            });
          }
        } catch (error) {
          console.error('노트 삭제 중 에러 발생:', error);
          toast({
            title: '노트 삭제 중 에러가 발생했습니다.',
            description: String(new Date()),
          });
        }
      },
    });
  };
  // console.log('받은 pinName:', pinName);

  // 북마크 토글 기능

  const toggleBookmark = async () => {
    try {
      const response = await patch(`notes/${noteId}/bookmark`, {
        is_bookmark: !isBookmark,
      });

      if (response.status === 200) {
        setIsBookmark((prev) => !prev);
        // 북마크 추가/삭제 시 `importantNotesState` 업데이트
        setImportantNotes((prevNotes) => {
          if (!isBookmark) {
            return [...prevNotes, noteData]; // 북마크 추가
          } else {
            return prevNotes.filter((note) => note.note_id !== noteId); // 북마크 해제
          }
        });
        toast({
          title: !isBookmark
            ? '중요 노트로 등록했습니다!'
            : '중요 노트를 해제했습니다!',
          description: '',
        });
      } else {
        toast({
          title: '북마크 상태 변경에 실패했습니다.',
          description: '',
        });
      }
    } catch (error) {
      toast({
        title: '북마크 상태 변경 중 문제가 발생했습니다.',
        description: '',
      });
    }
  };

  // 이미지 클릭 시 팝업 열기

  const onClickImage = (imageList, imageIndex) => {
    setDetailPopupImages(imageList);
    setCurrentImageIndex(imageIndex);
    setIsDetailPopupOpen(true);
  };

  if (!noteData) {
    return null;
  }

  const {
    note_writer,
    note_title,
    note_content,
    created_at,
    image_list,
    is_editable,
  } = noteData;

  return (
    <div className="relative">
      {/* 수정 모달 */}
      {editModal && (
        <EditNote
          noteId={noteId}
          initialTitle={note_title}
          initialContent={note_content}
          closeModal={() => setEditModal(false)}
          onUpdate={handleUpdateNote} // 수정 즉시 반영
        />
      )}

      {/* 이미지 미리보기 모달 */}
      {isDetailPopupOpen && (
        <ImageCarouselPopup
          images={detailPopupImages}
          initialIndex={currentImageIndex}
          isOpen={isDetailPopupOpen}
          onClickCloseButton={() => setIsDetailPopupOpen(false)}
        />
      )}

      <NoteDetailWrapper>
        <Header
          style={{
            backgroundColor:
              noteData?.pin_group?.pin_group_color_light || 'transparent',
          }}
        >
          <BackButton onClick={onBack}>
            <Icon name="IconGoChevronPrev" width={20} height={20} />
          </BackButton>
          <div className="flex items-center justify-center flex-grow gap-2">
            {!isDetailSidebarOpen && (
              <>
                <Icon
                  name="IconTbPinFill"
                  width={20}
                  height={20}
                  color={noteData?.pin_group?.pin_group_color || 'transparent'}
                />
                <div className="text-sm font-semibold">
                  {pinName || '디폴트값'}
                </div>
              </>
            )}
          </div>

          <HeaderButtons>
            <IconButton onClick={toggleBookmark}>
              <Icon
                name={isBookmark ? 'IconTbFlag3Fill' : 'IconTbFlag3Stroke'}
                width={20}
                height={20}
              />
            </IconButton>
            {is_editable && (
              <>
                <IconButton onClick={() => setEditModal(true)}>
                  <Icon name="IconTbEdit" width={20} height={20} />
                </IconButton>
                <IconButton onClick={handleDelete}>
                  <Icon name="IconFiTrash" width={20} height={20} />
                </IconButton>
              </>
            )}
          </HeaderButtons>
        </Header>
        <MainSection>
          <div className="text-center font-bold text-xl leading-none mb-4">
            {note_title}
          </div>

          <ProfileSection>
            <div className="flex justify-center gap-3 items-center">
              <Avatar className="w-7 h-7 border border-gray-300 rounded-full">
                <AvatarImage
                  src={note_writer?.profile_url || ''}
                  alt="프로필"
                />
                <AvatarFallback>
                  {note_writer?.user_email?.slice(0, 2).toUpperCase() || 'NA'}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                {note_writer?.user_email?.split('@')[0]}
              </div>
            </div>
            <div className="text-xs pr-1">
              {new Date(created_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </ProfileSection>
          <NoteContent>
            <NoteText>{note_content}</NoteText>
            {/* 이미지 목록 */}
            {image_list?.length > 0 && (
              <NoteImage imageList={image_list} onClickImage={onClickImage} />
            )}
          </NoteContent>
        </MainSection>
      </NoteDetailWrapper>

      <Confirm />
    </div>
  );
};

export default NoteDetail;

const NoteImage = ({ imageList, onClickImage }) => {
  return (
    <div className="grid gap-0.5 mt-2 grid-cols-3 place-items-center overflow-y-auto max-h-[200px]">
      {imageList.map((image, idx) => (
        <div
          key={image.image_id}
          className="relative w-[6.1rem] h-[6.1rem]"
          onClick={() => onClickImage(imageList, idx)}
        >
          <img
            src={image.image_preview}
            alt="노트 이미지"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      ))}
    </div>
  );
};

const NoteDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: none;
  border-radius: 0.3rem;
  background-color: #cbcbcb;
  width: 100%;
  max-width: 37.5rem;
  height: 20rem;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #cbcbcb;
  background-color: #f5f5f5;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 10px;
  padding-right: 2px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const MainSection = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 0.5rem;
  background-color: #fff;
`;

const ProfileSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
  margin-bottom: 0.5rem;
`;

const NoteContent = styled.div`
  margin-bottom: 1rem;
`;

const NoteText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
`;
