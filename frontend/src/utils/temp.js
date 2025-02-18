export const processNotes = (noteList, prevLastDate = '') => {
  if (!Array.isArray(noteList)) {
    return { notesWithSeparators: [], lastDate: prevLastDate };
  }

  const notesWithSeparators = [];
  let lastDate = prevLastDate;

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

    // 노트를 먼저 추가
    notesWithSeparators.push(note);

    // 이전 날짜와 다르고, 마지막 요소가 `date-separator`가 아닐 때만 추가
    if (noteDate !== lastDate) {
      const lastItem = notesWithSeparators[notesWithSeparators.length - 1];
      if (lastItem?.type !== 'date-separator') {
        notesWithSeparators.push({ type: 'date-separator', date: noteDate });
      }
    }

    lastDate = noteDate;
  });

  return { notesWithSeparators, lastDate };
};

export const historyProcessNotes = (noteList, prevLastDate = '') => {
  if (!Array.isArray(noteList))
    return { notesWithSeparators: [], lastDate: prevLastDate };

  const notesWithSeparators = [];
  let lastDate = prevLastDate;
  let lastInsertedIndex = null; // 마지막으로 날짜 구분선이 들어간 위치 저장

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

    // 날짜가 바뀌었으면 **바뀌기 직전의 마지막 노트 아래에 구분선 추가**
    if (noteDate !== lastDate && lastInsertedIndex !== null) {
      notesWithSeparators.push({
        type: 'date-separator',
        date: lastDate,
      });
    }

    notesWithSeparators.push(note);
    lastInsertedIndex = notesWithSeparators.length; // 가장 마지막 노트 위치 저장
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
