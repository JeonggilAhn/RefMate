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
import { useNavigate } from 'react-router-dom';

function Profile({
  profileUrl,
  userEmail,
  signupDate,
  onClose,
  setIsLoggedIn,
}) {
  const [, setModal] = useRecoilState(modalState);
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 추가

  const handleAccountDeletion = () => {
    setModal({
      type: 'confirm',
      message: '정말 회원 탈퇴하시겠습니까?',
      onConfirm: () => {
        const apiUrl = '/users/me';
        const headers = {
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        };
        del(apiUrl, { headers })
          .then(() => {
            // 회원 탈퇴 성공 시 로그아웃 처리
            sessionStorage.removeItem('access_token');
            setIsLoggedIn(false);

            // / 회원 탈퇴 후 알림 표시
            setModal({
              type: 'alert',
              message: '회원 탈퇴가 완료되었습니다.',
            });

            // 메인 페이지('/')로 이동 + 알림 닫기
            setTimeout(() => {
              navigate('/');
              setModal(null);
            }, 0);
          })
          .catch((error) => {
            console.error('회원 탈퇴 실패:', error);
            setModal({
              type: 'alert',
              message: '회원 탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.',
            });
          });
      },
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '4rem',
        right: '1rem',
        zIndex: 10,
        backgroundColor: 'white',
      }}
    >
      <Card style={{ textAlign: 'center', padding: '1.5rem' }}>
        <CardHeader>
          <img
            src={profileUrl}
            alt="프로필 이미지"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              margin: '0 auto',
            }}
          />
          <CardTitle style={{ marginTop: '1rem' }}>{userEmail}</CardTitle>
          <CardDescription style={{ marginBottom: '1rem' }}>
            가입일: {signupDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}
          >
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#e0e0e0',
                fontSize: '14px',
              }}
            >
              닫기
            </button>
            <button
              onClick={handleAccountDeletion}
              style={{
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#ff4d4d',
                color: 'white',
                fontSize: '14px',
              }}
            >
              회원 탈퇴
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
