export const isMyNote = (note, user) => {
  if (!note || !user || typeof user.user_email !== 'string') return false;
  if (!note.note_writer || typeof note.note_writer.user_email !== 'string')
    return false;

  return user.user_email === note.note_writer.user_email;
};
