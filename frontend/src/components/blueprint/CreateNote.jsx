import React, { useState } from 'react';
import { post } from '../../api'; // api 호출을 위한 post 함수

const CreateNote = ({ pinId, closeModal }) => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [imageUrls, setImageUrls] = useState([]);

  const handleSubmit = async () => {
    try {
      const response = await post(`/api/pins/${pinId}/notes`, {
        blueprint_version_id: 0, // 예시로 0을 넣었어. 필요한 값으로 수정해.
        project_id: 0, // 예시로 0을 넣었어. 필요한 값으로 수정해.
        note_title: noteTitle,
        note_content: noteContent,
        image_url_list: imageUrls, // 이미지 URL 목록
      });

      if (response.status.code === 'note-201-1') {
        alert('노트 생성에 성공했습니다!');
        closeModal(); // 모달 닫기
      } else {
        alert('노트 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('노트 생성 중 오류 발생:', error);
      alert('노트 생성에 실패했습니다.');
    }
  };

  return (
    <div className="create-note-modal">
      <div className="flex justify-between">
        <div>새 노트</div>
        {/* 닫기 버튼 */}
        <button onClick={closeModal} className="close-button">
          X
        </button>
      </div>
      {/* 노트 제목 입력 */}
      <div>
        <label>노트 제목</label>
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="노트 제목을 입력하세요"
        />
      </div>

      {/* 노트 내용 입력 */}
      <div>
        <label>노트 내용</label>
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="노트 내용을 입력하세요"
        />
      </div>

      {/* 이미지 첨부 아이콘 */}
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

      {/* 저장 버튼 */}
      <button onClick={handleSubmit} className="save-button">
        저장
      </button>
    </div>
  );
};

export default CreateNote;
