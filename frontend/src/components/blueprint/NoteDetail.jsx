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

const NoteDetail = ({ noteId, onBack }) => {
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
        setNoteData(note);
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
        <Header>
          <BackButton onClick={onBack}>
            <Icon name="IconGoChevronPrev" width={20} height={20} />
          </BackButton>
          <TitleWrapper>
            <Title>{note_title}</Title>
          </TitleWrapper>
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
          <ProfileSection>
            <Avatar className="w-7 h-7 border border-gray-300 rounded-full">
              <AvatarImage src={note_writer?.profile_url || ''} alt="프로필" />
              <AvatarFallback>
                {note_writer?.user_email?.slice(0, 2).toUpperCase() || 'NA'}
              </AvatarFallback>
            </Avatar>

            <ProfileInfo>
              <UserName>{note_writer?.user_email?.split('@')[0]}</UserName>
            </ProfileInfo>
            <CreationDate>
              {new Date(created_at).toLocaleDateString()}
            </CreationDate>
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
    <div className="grid gap-0.5 mt-2 grid-cols-3 place-items-center">
      {imageList.slice(0, 3).map((image, idx) => (
        <div
          key={image.image_id}
          className="relative w-[6.1rem] h-[6.1rem]"
          onClick={() => onClickImage(imageList, idx)}
        >
          <img
            src={image.image_preview}
            alt="노트 이미지"
            className="w-full h-full object-cover rounded-md border"
          />
          {idx === 2 && imageList.length > 3 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm font-semibold rounded-md">
              +{imageList.length - 3}
            </div>
          )}
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
  border: 0.0625rem solid #cbcbcb;
  height: 2.4rem;
  border-radius: 0.3rem;
  background-color: #cbcbcb;
  padding: 0 0.5rem;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  gap: 0.5rem;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: 1.2rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 0.5rem;
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
  border: 0.0625rem solid #cbcbcb;
  background-color: #fff;
`;

const ProfileSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
`;

const CreationDate = styled.span`
  font-size: 0.875rem;
  color: #555;
`;

const NoteContent = styled.div`
  margin-bottom: 1rem;
`;

const NoteText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
`;
