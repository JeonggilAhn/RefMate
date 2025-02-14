import React, { useState, useEffect } from 'react';
import { post } from '../../api';
import Icon from '../common/Icon';
import ImageUploader from '../common/ImageUploader';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const CreateNote = ({ pinId, isSidebar, closeModal }) => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [notes, setNotes] = useRecoilState(NoteState);
  const { toast } = useToast();

  const { projectId, blueprint_version_id } = useParams(); // projectId 가져오기

  const handleImageSelect = (urls) => {
    setImageUrls(urls);
  };

  const handleSubmit = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    try {
      const response = await post(`pins/${pinId}/notes`, {
        blueprint_version_id: blueprint_version_id,
        project_id: projectId,
        note_title: noteTitle,
        note_content: noteContent,
        image_url_list: imageUrls,
      });

      setNotes((prevNotes) => {
        return [
          ...prevNotes,
          {
            ...response.data.content.note,
            note_id: Number(response.data.content.note.note_id),
          },
        ];
      });

      if (response.status === 201) {
        toast({
          title: '노트 생성에 성공했습니다.',
          description: String(new Date()),
        });
        closeModal();
      } else {
        toast({
          title: '노트 생성에 실패했습니다.',
          description: String(new Date()),
        });
      }
    } catch (error) {
      console.error('노트 생성 중 오류 발생:', error);
      toast({
        title: '노트 생성에 실패했습니다.',
        description: String(new Date()),
      });
    }
  };

  return (
    <Draggable disabled={isSidebar}>
      <div className="w-80 bg-white border border-gray-300 rounded-md shadow-md p-4 z-10">
        {/* 헤더 */}
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <div className="text-lg font-semibold">새 노트</div>
          <button
            onClick={closeModal}
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
            projectId={projectId}
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
      </div>
    </Draggable>
  );
};

export default CreateNote;
