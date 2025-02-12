export const processNotes = (noteList) => {
  if (!Array.isArray(noteList))
    return { notesWithSeparators: [], lastDate: '' };

  const sortedNotes = [...noteList].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );

  const notesWithSeparators = [];
  let lastDate = '';

  sortedNotes.forEach((note) => {
    const noteDate = new Date(note.created_at).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });

    if (noteDate !== lastDate) {
      notesWithSeparators.push({ type: 'date-separator', date: noteDate });
      lastDate = noteDate;
    }

    notesWithSeparators.push(note);
  });

  return { notesWithSeparators, lastDate };
};
