import React from 'react';
import Icon from '../common/Icon';

const ImportantNoteList = ({ notes, onNoteClick }) => {
  // console.log('ImportantNoteList - Received notes:', notes); // notes 배열 확인

  const safeNotes = Array.isArray(notes) ? notes : [];

  if (safeNotes.length === 0) {
    return (
      <div className="text-sm text-center text-gray-500 p-4">
        중요한 노트가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto max-h-40  p-2 box-border">
      {safeNotes.map((note) => (
        <div
          key={note.note_id}
          onClick={() => onNoteClick(note)}
          className="w-full bg-gray-100 rounded-md flex items-center p-2 pr-3 cursor-pointer border-l-4 border-blue-400 hover:bg-gray-200"
        >
          <div className="flex-1 min-w-0">
            <span className="block text-sm font-bold text-gray-900 truncate max-w-[8rem]">
              {note.note_title.length > 20
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}`;
};
