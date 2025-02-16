export const processNotes = (noteList, prevLastDate = '') => {
  if (!Array.isArray(noteList))
    return { notesWithSeparators: [], lastDate: prevLastDate };

  const notesWithSeparators = [];
  let lastDate = prevLastDate;
  let lastInsertedIndex = null; // 날짜 구분선이 들어갈 위치 저장

  noteList.forEach((note) => {
    if (!note.created_at) return;

    const dateObj = new Date(note.created_at);
    if (isNaN(dateObj.getTime())) return;

    const noteDate = dateObj.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });

    // 날짜가 바뀌었으면, 이전 날짜 구분선 추가 (최초 노트는 제외)
    if (noteDate !== lastDate && lastInsertedIndex !== null) {
      notesWithSeparators.splice(lastInsertedIndex, 0, {
        type: 'date-separator',
        date: lastDate,
      });
    }

    lastInsertedIndex = notesWithSeparators.length; // 현재 노트의 위치 저장
    lastDate = noteDate;
    notesWithSeparators.push(note);
  });

  // 마지막 남은 날짜 구분선 추가
  if (lastInsertedIndex !== null) {
    notesWithSeparators.splice(lastInsertedIndex, 0, {
      type: 'date-separator',
      date: lastDate,
    });
  }

  return { notesWithSeparators, lastDate };
};
