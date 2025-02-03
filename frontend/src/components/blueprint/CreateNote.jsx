import React, { useState } from 'react';
import { post } from '../../api'; // api 호출을 위한 post 함수

const CreateNote = ({ pinId, closeModal }) => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [imageUrls, setImageUrls] = useState([]);

  const handleSubmit = async () => {
    try {
      const response = await post(`pins/${pinId}/notes`, {
        blueprint_version_id: 0, // 예시
        project_id: 0, // 예시
        note_title: noteTitle,
        note_content: noteContent,
        image_url_list: imageUrls, // 이미지 URL 목록
      });

      if (response.status === 201) {
        alert('노트 생성 성공');
        closeModal();
      } else {
        alert('노트 생성 실패');
      }
    } catch (error) {
      console.error('노트 생성 중 오류 발생:', error);
      alert('노트 생성 실패');
    }
  };

  return (
    <div className="fixed right-80 border bg-white ">
      <div className="create-note-header flex justify-between">
        <div>새 노트</div>
        <button onClick={closeModal} className="close-button">
          X
        </button>
      </div>

      <div className="border">
        <label></label>
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="노트 제목"
        />
      </div>

      <div className="border">
        <label></label>
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="노트 내용"
        />
      </div>

      <div className="flex justify-between">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              const urls = files.map((file) => URL.createObjectURL(file));
              setImageUrls(urls);
            }}
          />
        </div>

        <button onClick={handleSubmit} className="save-button border">
          저장
        </button>
      </div>
    </div>
  );
};

export default CreateNote;
