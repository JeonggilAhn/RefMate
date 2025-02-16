export const processNotes = (noteList) => {
  if (!Array.isArray(noteList))
    return { notesWithSeparators: [], lastDate: '' };

  const notesWithSeparators = [];
  let lastDate = '';

  noteList.forEach((note) => {
    if (!note.created_at) return; // created_at이 없는 경우 제외

    const dateObj = new Date(note.created_at);
    if (isNaN(dateObj.getTime())) return; // 유효하지 않은 날짜 필터링

    const noteDate = dateObj.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });

    // 새로운 날짜가 등장하면, 구분선을 삽입
    if (noteDate !== lastDate) {
      notesWithSeparators.push({ type: 'date-separator', date: noteDate });
      lastDate = noteDate;
    }

    notesWithSeparators.push(note);
  });

  return { notesWithSeparators, lastDate };
};
