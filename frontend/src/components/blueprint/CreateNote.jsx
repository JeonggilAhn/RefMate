import React, { useState } from 'react';
import { post } from '../../api';
import Icon from '../common/Icon';

const CreateNote = ({ pinId, closeModal }) => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [imageUrls, setImageUrls] = useState([]);

  const handleSubmit = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return; // 제목이 없으면 실행 안 함

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
    <div className="fixed right-80 w-80 bg-white border border-gray-300 rounded-md shadow-md p-4">
      {/* 헤더 */}
      <div className="flex justify-between items-center border-b pb-2 mb-3">
        <div className="text-lg font-semibold">새 노트</div>
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

      {/* 이미지 업로드 & 저장 버튼 */}
      <div className="flex justify-between items-center">
        {/* 이미지 업로드 버튼 */}
        <label className="cursor-pointer">
          <span className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md text-gray-500">
            <Icon name="IconTbPhoto" width={24} height={24} />
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              const urls = files.map((file) => URL.createObjectURL(file));
              setImageUrls(urls);
            }}
          />
        </label>

        {/* 저장 버튼 */}
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 text-white rounded-md ${
            noteTitle.trim() && noteContent.trim()
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

export default CreateNote;
