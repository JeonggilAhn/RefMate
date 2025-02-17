export const isMyNote = (note, user) => {
  if (!note || !user) return false;
  return (
    note.type === 'note' &&
    (user?.user_email === note.note_writer?.user_email ||
      user?.user_email === note.user_email)
  );
};
