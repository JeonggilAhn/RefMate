import { atom } from 'recoil';

export const pinState = atom({
  key: 'pinState',
  default: [],
});

export const noteState = atom({
  key: 'noteState',
  default: [],
});

export const importantNotesState = atom({
  key: 'importantNotesState',
  default: [],
});
