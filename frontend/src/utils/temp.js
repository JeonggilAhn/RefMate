export const processNotes = (noteList, prevLastDate = '') => {
  if (!Array.isArray(noteList))
    return { notesWithSeparators: [], lastDate: prevLastDate };

  const notesWithSeparators = [];
  let lastInsertedDate = null; // 마지막으로 추가된 날짜 구분선 확인

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

    notesWithSeparators.push(note);

    // 날짜가 변경되었고, 새로운 날짜라면 해당 노트에 구분선 추가
    if (noteDate !== lastInsertedDate) {
      notesWithSeparators.push({ type: 'date-separator', date: noteDate });
      lastInsertedDate = noteDate;
    }
  });

  return { notesWithSeparators, lastDate: lastInsertedDate };
};
