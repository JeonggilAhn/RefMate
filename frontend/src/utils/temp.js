export const processNotes = (
  noteList,
  prevLastDate = '',
  isPagination = false,
) => {
  if (!Array.isArray(noteList)) {
    return { notesWithSeparators: [], lastDate: prevLastDate };
  }

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

    // 날짜가 변경되었을 때 처리 방식 구분
    if (noteDate !== lastDate && lastInsertedIndex !== null) {
      if (isPagination) {
        // 페이지네이션 시: 최신 노트 아래에 날짜 구분선 추가
        notesWithSeparators.push({ type: 'date-separator', date: lastDate });
      } else {
        // 최초 렌더링 시: 가장 오래된 노트 위에 날짜 구분선 추가
        notesWithSeparators.splice(lastInsertedIndex, 0, {
          type: 'date-separator',
          date: lastDate,
        });
      }
    }

    notesWithSeparators.push(note);
    lastInsertedIndex = notesWithSeparators.length; // 현재 노트의 위치 저장
    lastDate = noteDate;
  });

  // 리스트 끝에 남아 있는 마지막 날짜의 구분선 추가
  if (lastInsertedIndex !== null) {
    notesWithSeparators.push({
      type: 'date-separator',
      date: lastDate,
    });
  }

  return { notesWithSeparators, lastDate };
};
