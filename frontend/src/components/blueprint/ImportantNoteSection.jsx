import React, { useEffect, useState } from 'react';
import { get } from '../../api';
import ImportantNoteList from './ImportantNoteList';
import { Skeleton } from '@/components/ui/skeleton';

import { useRecoilState } from 'recoil';
import { importantNotesState } from '../../recoil/blueprint';

const ImportantNoteSection = ({ detailPin, pinId, setDetailNote }) => {
  const [notes, setNotes] = useRecoilState(importantNotesState); // 전역 상태 사용
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('ImportantNoteSection - Received pinId:', detailPin.pin_id); // pinId 값 확인

    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await get(`pins/${detailPin.pin_id}/notes/bookmark`);
        if (response.data?.content?.note_list) {
          setNotes(response.data.content.note_list.reverse()); // 전역 상태 업데이트
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
  }, [detailPin.pin_id]);

  const handleNoteClick = (note) => {
    setDetailNote((prevNote) =>
      prevNote?.note_id !== note.note_id ? note : prevNote,
    );
  };
  const handleBack = () => {
    setDetailNote(null); // 상세보기 닫기
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
