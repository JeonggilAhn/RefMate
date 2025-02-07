import React, { useState } from 'react';
import { put } from '../../api'; // 수정 요청을 위한 API 호출 함수

const EditNote = ({ noteId, initialTitle, initialContent, closeModal }) => {
  const [noteTitle, setNoteTitle] = useState(initialTitle);
  const [noteContent, setNoteContent] = useState(initialContent || '');

  const handleUpdate = async () => {
    if (!noteTitle.trim()) {
      alert('노트 제목은 필수 입력 사항입니다.');
      return;
    }

    try {
      const response = await put(`notes/${noteId}`, {
        note_title: noteTitle,
        note_content: noteContent,
      });

      if (response.status === 200) {
        alert('노트가 성공적으로 수정되었습니다.');
        closeModal(); // 수정 완료 후 창 닫기
      } else {
        alert('노트 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('노트 수정 중 오류 발생:', error);
      alert('노트 수정 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="fixed right-80 border bg-white p-4">
      <div className="edit-note-header flex justify-between">
        <div>노트 수정</div>
        <button onClick={closeModal} className="close-button">
          X
        </button>
      </div>

      <div className="border p-2">
        <label>제목 (필수)</label>
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="노트 제목"
          className="border w-full p-1"
        />
      </div>

      <div className="border p-2">
        <label>내용 (선택)</label>
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="노트 내용"
          className="border w-full p-1"
        />
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={handleUpdate}
          className="border p-2 bg-blue-500 text-white"
        >
          수정
        </button>
        <button onClick={closeModal} className="border p-2">
          취소
        </button>
      </div>
    </div>
  );
};

export default EditNote;
