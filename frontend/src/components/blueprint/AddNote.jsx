import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { pinState } from '../../recoil/blueprint';
import { post } from '../../api';
import TextButton from '../common/TextButton';
import ImageUploader from '../common/ImageUploader';
import Icon from '../common/Icon';
import { useToast } from '@/hooks/use-toast';

const AddNote = ({ setOpen, blueprintVersionId, projectId, pinInfo }) => {
  const [pins, setPins] = useRecoilState(pinState);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [imageUrls, setImageUrls] = useState([]);

  const { toast } = useToast(20);

  const handleImageSelect = (urls) => {
    setImageUrls(urls);
  };

  // 노트 생성 로직
  const handleSubmit = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    try {
      const response = await post(`pins/${pinInfo.pin_id}/notes`, {
        blueprint_version_id: blueprintVersionId,
        project_id: projectId,
        note_title: noteTitle,
        note_content: noteContent,
        image_url_list: imageUrls,
      });

      setPins((prev) => {
        return prev.map((item) => {
          if (item.pin_id === pinInfo.pin_id) {
            console.log(response);
            return {
              ...item,
              pinDetailNotes: [
                ...item.pinDetailNotes,
                {
                  ...response.data.content.note,
                  note_id: Number(response.data.content.note.note_id),
                },
              ],
            };
          }

          return item;
        });
      });

      if (response.status === 201) {
        toast({
          title: '노트를 생성했습니다.',
          description: String(new Date()),
        });
        setOpen(false);
        setNoteTitle('');
        setNoteContent('');
      } else {
        toast({
          title: '노트를 생성에 실패했습니다.',
          description: String(new Date()),
        });
      }
    } catch (error) {
      console.error('노트 생성 중 오류 발생:', error);
      toast({
        title: '노트를 생성에 실패했습니다.',
        description: String(new Date()),
      });
    }
  };

  return (
    <>
      {/* 헤더 */}
      <div className="border-b border-[#CBCBCB]">
        <div className="flex justify-between items-center px-3 p-2 bg-white rounded-t-md">
          <div className="text-md">새 노트</div>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Icon name="IconCgClose" width={20} height={20} />
          </button>
        </div>
      </div>

      {/* 제목 입력 */}
      <div className="p-2 pt-3 bg-[#F5F5F5] rounded-b-md">
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="노트 제목"
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-0 outline-none mb-3 bg-[#ffffff]"
        />

        {/* 내용 입력 */}
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="노트 내용"
          className="w-full h-46 border border-gray-300 rounded-md p-2 text-sm focus:ring-0 outline-none resize-none mb-3 bg-[#ffffff]"
        />

        <div className="relative">
          <ImageUploader
            onImageSelect={handleImageSelect}
            projectId={projectId}
            type="note"
          />
          <div className="absolute bottom-0 right-0">
            <TextButton
              type="start"
              disabled={!noteTitle.trim() || !noteContent.trim()}
              onClick={handleSubmit}
            >
              저장
            </TextButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNote;
