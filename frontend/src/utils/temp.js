export const processNotes = (noteList, prevLastDate = '') => {
  if (!Array.isArray(noteList))
    return { notesWithSeparators: [], lastDate: prevLastDate };

  const notesWithSeparators = [];
  let lastDate = prevLastDate;

  // 날짜별로 정렬된 리스트 유지
  const sortedNotes = [...noteList].sort((a, b) => b.note_id - a.note_id); // 최신이 아래로 가도록 정렬

  sortedNotes.forEach((note) => {
    if (!note.created_at) return; // created_at이 없는 경우 제외

    const dateObj = new Date(note.created_at);
    if (isNaN(dateObj.getTime())) return; // 유효하지 않은 날짜 필터링

    const noteDate = dateObj.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });

    // 날짜가 변경되면 해당 날짜 위에 date-separator 추가
    if (noteDate !== lastDate) {
      notesWithSeparators.push({ type: 'date-separator', date: noteDate });
      lastDate = noteDate;
    }

    notesWithSeparators.push(note);
  });

  return { notesWithSeparators, lastDate };
};
