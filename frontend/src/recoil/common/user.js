import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: {}, // 빈 객체로 초기화
});
