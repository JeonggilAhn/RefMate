import React, { useEffect, useState } from 'react';
import { get } from '../../api';
import ImportantNoteList from './ImportantNoteList';
import { Skeleton } from '@/components/ui/skeleton';

import { useRecoilState } from 'recoil';
import { importantNotesState } from '../../recoil/blueprint';

const ImportantNoteSection = ({ detailPin, setDetailNote, projectId }) => {
  const [notes, setNotes] = useRecoilState(importantNotesState);
  const [loading, setLoading] = useState(true);

  const pinId = detailPin?.pin_id || null;
  const validProjectId = projectId || null;

  useEffect(() => {
    if (!pinId || !validProjectId) {
      console.warn('필수 데이터 누락: detailPin 또는 projectId가 없습니다.');
      return;
    }

    console.log('ImportantNoteSection - Received pinId:', detailPin.pin_id);
    console.log('ImportantNoteSection - Received projectId:', projectId);

    setNotes([]); // 새로운 핀 클릭 시 초기화

    const fetchNotes = async () => {
      try {
        setLoading(true);
        const apiUrl = `pins/${pinId}/notes/bookmark`;
        const params = {
          project_id: validProjectId,
        };
        const response = await get(apiUrl, params);

        console.log('API 응답:', response.data);

        if (response.data?.content?.note_list) {
          const fetchedNotes =
            response.data.content.note_list
              .filter((note) => note.type === 'note')
              .reverse() || [];

          console.log('정렬된된 Notes:', fetchedNotes); // 여기서 확인

          setNotes(fetchedNotes);
        } else {
          setNotes([]); // 새로운 핀 클릭 시 초기화
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [pinId, validProjectId, setNotes]);

  const handleNoteClick = (note) => {
    setDetailNote((prevNote) =>
      prevNote?.note_id !== note.note_id ? note : prevNote,
    );
  };

  if (!pinId || !validProjectId) {
    return (
      <div className="text-red-500 text-sm">⚠️ 필수 데이터가 없습니다.</div>
    );
  }
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

  return (
    <div className="w-full border border-[#CBCBCB] rounded-lg shadow-md bg-white">
      <h2 className="text-center p-2 border-b border-[#CBCBCB] rounded-t-lg bg-[#F5F5F5]">
        중요한 노트
      </h2>
      <div className="h-40 overflow-y-auto">
        {console.log('ImportantNoteSection - Notes:', notes)}{' '}
        <ImportantNoteList notes={notes} onNoteClick={handleNoteClick} />
      </div>
    </div>
  );
};

export default ImportantNoteSection;
