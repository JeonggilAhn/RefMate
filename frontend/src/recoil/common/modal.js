import { atom } from 'recoil';

export const modalState = atom({
  key: 'modalState',
  default: null, // null일 경우 아무 팝업도 표시하지 않음
});
