import { atom } from 'recoil';

export const projectState = atom({
  key: 'projectState',
  default: {
    projectId: null,
    projectTitle: '',
  },
});
