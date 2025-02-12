export const processNotes = (noteList) => {
  if (!Array.isArray(noteList)) {
    throw new Error('note_list 데이터가 배열 형식이 아닙니다.');
  }

  const groupedByDate = noteList.reduce((acc, note) => {
    const date = new Date(note.created_at).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(note);
    return acc;
  }, {});

  return Object.entries(groupedByDate)
    .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
    .map(([date, notes]) => ({
      date,
      notes: notes.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      ),
    }));
};
