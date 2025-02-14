import React, { useState } from 'react';
import { put } from '../../api';

const EditNote = ({
  noteId,
  initialTitle,
  initialContent,
  closeModal,
  onUpdate,
}) => {
  const [noteTitle, setNoteTitle] = useState(initialTitle);
  const [noteContent, setNoteContent] = useState(initialContent || '');

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

        closeModal(); // 수정 완료 후 창 닫기
      } else {
        alert('노트 수정에 실패했습니다.');
      }
    } catch (error) {
      alert('노트 수정 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="fixed right-80 w-80 bg-white border border-gray-300 z-1 rounded-md shadow-md p-4">
      {/* 헤더 */}
      <div className="flex justify-between items-center border-b pb-2 mb-3">
        <div className="text-lg font-semibold">노트 수정</div>
        <button
          onClick={closeModal}
          className="text-gray-500 hover:text-gray-700"
        >
          ✖
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

      {/* 버튼 영역 */}
      <div className="flex justify-between">
        <button
          onClick={closeModal}
          className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
        >
          취소
        </button>
        <button
          onClick={handleUpdate}
          className={`px-4 py-2 text-white rounded-md ${
            noteTitle.trim()
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-300 cursor-not-allowed opacity-50'
          }`}
          disabled={!noteTitle.trim()}
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default EditNote;
