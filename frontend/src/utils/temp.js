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

    // 날짜가 바뀌었으면, 가장 첫 번째 노트 **위**에 구분선 추가
    if (noteDate !== lastDate && lastInsertedIndex !== null) {
      notesWithSeparators.splice(lastInsertedIndex, 0, {
        type: 'date-separator',
        date: noteDate,
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
