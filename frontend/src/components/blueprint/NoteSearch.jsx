import React, { useState } from 'react';
import { get } from '../../api';
import Search from '../../assets/icons/Search.svg';
import ArrowPrev from '../../assets/icons/ArrowPrev.svg';
import ArrowNext from '../../assets/icons/ArrowNext.svg';

function NoteSearch() {
  const [keyword, setKeyword] = useState('');
  const [notes, setNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 노트 검색 함수
  const searchNotes = async () => {
    try {
      const response = await get(`notes/search?keyword=${keyword}`);
      setNotes(response.data.content[0].note_list); // 응답에서 노트 리스트 가져오기
      setCurrentIndex(0); // 검색 후 첫 번째 노트로 초기화
    } catch (error) {
      console.error('API 호출 오류:', error);
    }
  };

  // 이전 노트로 이동
  const goToPreviousNote = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 다음 노트로 이동
  const goToNextNote = () => {
    if (currentIndex < notes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="p-4 border">
      <div className="flex items-center space-x-4 mb-4 justify-between">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="키워드"
          className="border w-30"
        />

        <div className="flex gap-2">
          {notes.length > 0 && (
            <div className="text-center">
              {currentIndex + 1} / {notes.length}
            </div>
          )}

          {notes.length > 0 && (
            <>
              <button onClick={goToPreviousNote} disabled={currentIndex === 0}>
                <img src={ArrowPrev} alt="이전" />
              </button>
              <button
                onClick={goToNextNote}
                disabled={currentIndex === notes.length - 1}
              >
                <img src={ArrowNext} alt="다음" />
              </button>
            </>
          )}

          <button onClick={searchNotes}>
            <img src={Search} alt="검색" />
          </button>
        </div>
      </div>

      {notes.length > 0 && (
        <div className="border p-4">
          <h3>{notes[currentIndex].note_title}</h3>
          <p>{notes[currentIndex].note_writer.user_email}</p>
          <p>{new Date(notes[currentIndex].created_at).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}

export default NoteSearch;
