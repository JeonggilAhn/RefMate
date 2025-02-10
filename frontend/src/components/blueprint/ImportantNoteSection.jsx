import React, { useEffect, useState } from 'react';
import { get } from '../../api';
import ImportantNoteList from './ImportantNoteList';
import NoteDetail from './NoteDetail';
import { Skeleton } from '@/components/ui/skeleton';

const ImportantNoteSection = () => {
  const pinId = 70281145; // 고정된 핀 ID
  const [notes, setNotes] = useState([]); // 노트 목록 상태
  const [selectedNote, setSelectedNote] = useState(null); // 선택된 노트 상태
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await get(`pins/${pinId}/notes/bookmark`);
        if (
          response.data &&
          response.data.content &&
          Array.isArray(response.data.content.note_list)
        ) {
          const sortedNotes = response.data.content.note_list
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .reverse();
          setNotes(sortedNotes);
        } else {
          setNotes([]);
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleNoteClick = (note) => {
    setSelectedNote(note); // 선택된 노트 설정
  };

  const handleBack = () => {
    setSelectedNote(null); // 상세보기 닫기
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-4 border border-gray-300 rounded-lg bg-white">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          중요한 노트
        </h2>
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto p-2">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-5 rounded-md bg-gray-200"
              />
            ))}
        </div>
      </div>
    );
  }

  return selectedNote ? (
    <div className="w-full max-w-md mx-auto p-4 border border-blue-500 rounded-lg bg-gray-100">
      <NoteDetail note={selectedNote} onBack={handleBack} />
    </div>
  ) : (
    <div className="w-full max-w-md mx-auto p-4 border border-gray-300 rounded-lg bg-white">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        중요한 노트
      </h2>
      <ImportantNoteList notes={notes} onNoteClick={handleNoteClick} />
    </div>
  );
};

export default ImportantNoteSection;
