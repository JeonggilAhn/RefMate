export const processNotes = (noteList, prevLastDate = '') => {
  if (!Array.isArray(noteList))
    return { notesWithSeparators: [], lastDate: prevLastDate };

  const notesWithSeparators = [];
  let lastDate = prevLastDate;

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

    // **날짜 변경 감지 → 해당 노트 위에 구분선 추가**
    if (noteDate !== lastDate) {
      notesWithSeparators.push({ type: 'date-separator', date: noteDate });
      lastDate = noteDate;
    }

    // 노트 추가 (구분선 이후에 들어감)
    notesWithSeparators.push(note);
  });

  return { notesWithSeparators, lastDate };
};
