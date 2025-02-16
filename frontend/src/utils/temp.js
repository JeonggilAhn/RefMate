export const processNotes = (noteList, prevLastDate = '') => {
  if (!Array.isArray(noteList))
    return { notesWithSeparators: [], lastDate: prevLastDate };

  const notesWithSeparators = [];
  let lastDate = prevLastDate;
  let lastInsertedDateIndex = -1; // 마지막으로 추가된 날짜 구분선 인덱스 저장

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

    // 날짜 변경 감지
    if (noteDate !== lastDate) {
      // 새로운 날짜가 나오면, 이전 날짜가 아직 구분선으로 추가되지 않았다면 추가
      if (lastInsertedDateIndex !== -1) {
        notesWithSeparators.splice(lastInsertedDateIndex, 0, {
          type: 'date-separator',
          date: lastDate,
        });
      }
      lastInsertedDateIndex = notesWithSeparators.length; // 새로운 날짜 구분선이 들어갈 위치
      lastDate = noteDate;
    }

    notesWithSeparators.push(note);
  });

  // 마지막 구분선 추가
  if (lastInsertedDateIndex !== -1) {
    notesWithSeparators.splice(lastInsertedDateIndex, 0, {
      type: 'date-separator',
      date: lastDate,
    });
  }

  return { notesWithSeparators, lastDate };
};
