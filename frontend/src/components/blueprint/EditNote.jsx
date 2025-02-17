import React, { useState } from 'react';
import { put } from '../../api';
import { useToast } from '@/hooks/use-toast';
import TextButton from '../common/TextButton';
import Icon from '../common/Icon';

const EditNote = ({
  noteId,
  initialTitle,
  initialContent,
  closeModal,
  onUpdate,
}) => {
  const [noteTitle, setNoteTitle] = useState(initialTitle);
  const [noteContent, setNoteContent] = useState(initialContent || '');
  const { toast } = useToast(20);
  const handleUpdate = async () => {
    if (!noteTitle.trim()) {
      return;
    }

    try {
      const response = await put(`notes/${noteId}`, {
        note_title: noteTitle,
        note_content: noteContent,
      });

      if (response.status === 200) {
        onUpdate({ note_title: noteTitle, note_content: noteContent });
        toast({
          title: '노트 수정이 완료되었습니다.',
          description: String(new Date()),
        });
        closeModal(); // 수정 완료 후 창 닫기
      } else {
        toast({
          title: '노트 수정에 실패했습니다.',
          description: String(new Date()),
        });
      }
    } catch (error) {
      toast({
        title: '노트 수정에 문제가 발생했습니다다.',
        description: String(new Date()),
      });
    }
  };

  return (
    <div className="fixed right-90 w-80 bg-gray-200 border border-gray-300 z-1 rounded-md shadow-md">
      {/* 헤더 */}
      <div className="border-b border-[#CBCBCB]">
        <div className="flex justify-between items-center px-3 p-2 bg-white rounded-t-md">
          <div className="text-md">노트 수정</div>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <Icon name="IconCgClose" width={20} height={20} />
          </button>
        </div>
      </div>

      <div className="p-2 pt-3 bg-[#F5F5F5] rounded-b-md">
        {/* 제목 입력 */}
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
          className="w-full h-46 border border-gray-300 rounded-md p-2 text-sm focus:ring-0 outline-none resize-none mb-1 bg-[#ffffff]"
        />

        {/* 버튼 영역 */}
        <div className="flex justify-end">
          <TextButton disabled={!noteTitle.trim()} onClick={handleUpdate}>
            저장
          </TextButton>
        </div>
      </div>
    </div>
  );
};

export default EditNote;
