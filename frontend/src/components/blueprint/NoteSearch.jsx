import React, { useState, useEffect } from 'react';
import { get } from '../../api';
import Icon from '../common/Icon';

function NoteSearch({ onSelect, onClose }) {
  const [keyword, setKeyword] = useState('');
  const [notes, setNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSearched, setIsSearched] = useState(false);

  // 노트 검색 함수
  const searchNotes = async () => {
    // 검색어가 비어있는지 확인
    if (!keyword.trim()) {
      alert('검색어를 입력하세요!');
      return;
    }

    try {
      const response = await get(`notes/search?keyword=${keyword}`);
      const noteList = response.data.content.note_list || [];

      setNotes(noteList);
      setCurrentIndex(0);
      setIsSearched(true);
    } catch (error) {
      console.error('API 호출 오류:', error);
    }
  };

  useEffect(() => {
    // notes가 변경될 때마다 실행
    if (notes.length > 0) {
      console.log('노트가 변경됨:', notes);
      onSelect(notes[0].note_id); // 상태가 변경되면 onSelect 호출
    }
  }, [notes]);

  // 이전 노트로 이동
  const goToPreviousNote = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      console.log(notes[newIndex].note_id);
      onSelect(notes[newIndex].note_id); // 부모로 노트 ID 전달
    }
  };

  // 다음 노트로 이동
  const goToNextNote = () => {
    if (currentIndex < notes.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      console.log(notes[newIndex].note_id);
      onSelect(notes[newIndex].note_id); // 부모로 노트 ID 전달
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchNotes();
    }
  };

  return (
    <div className="p-2 border border-gray-300 rounded w-85">
      <div className="flex items-center space-x-4 justify-between">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="search"
          className="w-40 focus:outline-none focus:ring-0 border-none"
        />

        <div className="flex gap-2">
          {isSearched && notes.length == 0 && (
            <div className="text-center text-gray-500">결과 없음</div>
          )}

          {notes.length > 0 && (
            <div className="text-center text-gray-500">
              {currentIndex + 1} / {notes.length}
            </div>
          )}

          {notes.length > 0 && (
            <>
              <button onClick={goToPreviousNote} disabled={currentIndex === 0}>
                <Icon
                  name="IconGoChevronPrev"
                  width={20}
                  height={20}
                  color={currentIndex === 0 ? '#ccc' : '#000'}
                />
              </button>
              <button
                onClick={goToNextNote}
                disabled={currentIndex === notes.length - 1}
              >
                <Icon
                  name="IconGoChevronNext"
                  width={20}
                  height={20}
                  color={currentIndex === notes.length - 1 ? '#ccc' : '#000'}
                />
              </button>
            </>
          )}
          <button onClick={onClose}>
            <Icon name="IconCgClose" width={20} height={20} />
          </button>
          <button onClick={searchNotes}>
            <Icon name="IconTbSearch" width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteSearch;
