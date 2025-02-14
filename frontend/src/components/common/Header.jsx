import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { get } from '../../api';
import Profile from './Profile';
import TextButton from '../common/TextButton';
import Icon from '../common/Icon';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useRecoilState } from 'recoil';
import { userState } from '../../recoil/common/user';
import { modalState } from '../../recoil/common/modal';
import LoginContent from '../main/LoginContent';

function Header() {
  const navigate = useNavigate();
  const [modal, setModal] = useRecoilState(modalState);
  const [userId, setUserId] = useState(null);
  const [profileUrl, setProfileUrl] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [signupDate, setSignupDate] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem('access_token'),
  );
  const [user, setUser] = useRecoilState(userState); // Recoil 상태 관리 추가

  useEffect(() => {
    if (isLoggedIn) {
      get(`users/me`)
        .then((response) => {
          const data = response.data?.content;
          setUser({
            user_id: data?.user_id || null,
            user_email: data?.user_email || '',
            profile_url: data?.profile_url || 'https://via.placeholder.com/24',
            signup_date: data?.signup_date || '',
          });
        })
        .catch((error) =>
          console.error('사용자 정보를 가져오는데 실패했습니다.', error),
        );
    }
  }, [isLoggedIn, setUser]);

  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     localStorage.removeItem('access_token'); // 창이 닫힐 때 access_token 삭제
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('access_token'); // access_token 삭제
    setIsLoggedIn(false);
    setUser({}); // 로그아웃 시 Recoil 상태 초기화
    navigate('/'); // 로그아웃 후 메인 페이지로 이동
  };

  return (
    <>
      <header className="flex justify-between items-center w-full h-12 px-5 bg-white border-b border-gray-300 fixed top-0 left-0 z-10">
        <Link
          to={isLoggedIn ? '/projects' : '/'}
          className="flex items-center text-gray-800"
        >
          <span className="text-xl font-bold text-blue-400 mr-2">RM</span>
          <span className="text-lg font-bold">Ref Mate</span>
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer">
              <Icon name="IconTbBell" width={24} height={24} />
            </div>

            <div className="cursor-pointer">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="w-6 h-6 border border-gray-300">
                    <AvatarImage src={profileUrl} alt="프로필" />
                    <AvatarFallback>
                      {userEmail.slice(0, 2).toUpperCase() || 'NA'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                  >
                    프로필
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <Icon
                      name="IconTbLogout2"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ) : (
          <TextButton
            type="start"
            onClick={() =>
              setModal({
                type: 'modal',
                content: <LoginContent />,
              })
            }
          >
            시작하기
          </TextButton>
        )}
      </header>

      {isProfileOpen && isLoggedIn && (
        <Profile
          profileUrl={user.profile_url}
          userEmail={user.user_email}
          signupDate={user.signup_date}
          onClose={() => setIsProfileOpen(false)}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </>
  );
}

export default Header;
