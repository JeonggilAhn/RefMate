export const processNotes = (noteList, prevLastDate = '') => {
  if (!Array.isArray(noteList))
    return { notesWithSeparators: [], lastDate: prevLastDate };

  const notesWithSeparators = [];
  let lastDate = prevLastDate;
  let lastInsertedIndex = -1; // 날짜 구분선이 들어갈 위치

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

    // 날짜가 변경된 경우, 해당 날짜 **이전 날짜의 첫 번째 노트 위에 구분선 삽입**
    if (noteDate !== lastDate) {
      if (lastInsertedIndex !== -1) {
        notesWithSeparators.splice(lastInsertedIndex, 0, {
          type: 'date-separator',
          date: lastDate,
        });
      }
      lastInsertedIndex = notesWithSeparators.length; // 날짜 구분선이 들어갈 위치 업데이트
      lastDate = noteDate;
    }

    notesWithSeparators.push(note);
  });

  // 마지막 남은 날짜에 대한 구분선 추가
  if (lastInsertedIndex !== -1) {
    notesWithSeparators.splice(lastInsertedIndex, 0, {
      type: 'date-separator',
      date: lastDate,
    });
  }

  return { notesWithSeparators, lastDate };
};
