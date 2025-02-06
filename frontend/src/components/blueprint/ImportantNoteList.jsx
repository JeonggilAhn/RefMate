import React, { useEffect, useState } from 'react';
import { get } from '../../api';
import Icon from '../common/Icon';

const ImportantNoteList = ({ pinId, onNoteClick }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

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
  }, [pinId]);

  if (loading) {
    return <div className="text-sm text-left">Loading...</div>;
  }

  if (notes.length === 0) {
    return (
      <div className="text-sm text-left text-gray-500">
        등록된 노트가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto p-2 box-border">
      {notes.map((note) => (
        <div
          key={note.note_id}
          onClick={() => onNoteClick(note.note_id)}
          className="w-full bg-gray-100 rounded-md flex items-center p-2 cursor-pointer border-l-4 border-blue-400 hover:bg-gray-200"
        >
          <div className="flex-1 min-w-0">
            <span className="block text-sm font-bold text-gray-900 truncate max-w-[8rem]">
              {note.note_title.length > 10
                ? `${note.note_title.slice(0, 20)}...`
                : note.note_title}
            </span>
          </div>
          {note.is_present_image && (
            <Icon name="IconTbPhoto" width={18} height={18} />
          )}
          <span className="text-xs text-gray-500 whitespace-nowrap pl-2">
            {formatDate(note.created_at)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ImportantNoteList;
