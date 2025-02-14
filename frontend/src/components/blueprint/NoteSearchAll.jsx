import React, { useState, useEffect } from 'react';
import { get } from '../../api';
import Icon from '../common/Icon';

function NoteSearchAll({ onSelect, onClose }) {
  const [keyword, setKeyword] = useState('');
  const [notes, setNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSearched, setIsSearched] = useState(false);

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
          className="w-35 focus:outline-none focus:ring-0 border-none"
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

export default NoteSearchAll;
