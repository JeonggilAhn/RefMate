import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { del } from '../../api';
import { useRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';

function Profile({ profileUrl, userEmail, signupDate, onClose }) {
  const [, setModal] = useRecoilState(modalState);

  const handleAccountDeletion = () => {
    setModal({
      type: 'confirm',
      message: '정말 회원 탈퇴하시겠습니까?',
      onConfirm: () => {
        del(`users/${6176143282240361}`) // USER_ID를 고정값으로 사용
          .then(() => {
            alert('회원 탈퇴가 완료되었습니다.');
            onClose(); // 카드 닫기
          })
          .catch((error) => {
            console.error('회원 탈퇴 실패:', error);
            alert('회원 탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.');
          });
      },
    });
  };

  return (
    <div
      style={{ position: 'absolute', top: '4rem', right: '1rem', zIndex: 10 }}
    >
      <Card>
        <CardHeader>
          <img
            src={profileUrl}
            alt="프로필 이미지"
            style={{ width: '80px', borderRadius: '50%' }}
          />
          <CardTitle>{userEmail}</CardTitle>
          <CardDescription>가입일: {signupDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <button
            onClick={onClose}
            style={{ marginTop: '1rem', padding: '0.5rem', cursor: 'pointer' }}
          >
            닫기
          </button>
          <button
            onClick={handleAccountDeletion}
            style={{ marginTop: '1rem', padding: '0.5rem', cursor: 'pointer' }}
          >
            회원 탈퇴
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
