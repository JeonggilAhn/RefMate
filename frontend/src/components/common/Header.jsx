import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Login from '../main/Login';
import { get, post } from '../../api';
import Profile from './Profile';
import TextButton from '../common/TextButton';
import Icon from '../common/Icon';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'; // Avatar 컴포넌트 추가

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [profileUrl, setProfileUrl] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [signupDate, setSignupDate] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn && userId) {
      get(`users/${userId}`)
        .then((response) => {
          const data = response.data?.content;
          setProfileUrl(data?.profile_url || 'https://via.placeholder.com/24'); // 프로필 URL
          setUserEmail(data?.user_email || 'N/A'); // 이메일
          setSignupDate(
            new Date(data?.signup_date).toLocaleDateString() || 'N/A',
          ); // 가입 날짜
        })
        .catch((error) => console.error('Failed to fetch user data:', error));
    }
  }, [isLoggedIn, userId]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setProfileUrl('');
    setUserEmail('');
    setSignupDate('');
  };

  return (
    <>
      <header className="flex justify-between items-center w-full h-12 px-5 bg-white border-b border-gray-300 fixed top-0 left-0 z-10">
        {/* 로고 */}
        <Link to="/" className="flex items-center text-gray-800">
          <span className="text-xl font-bold text-blue-400 mr-2">RM</span>
          <span className="text-lg font-bold">Ref Mate</span>
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            {/* 알림 아이콘 */}
            <div className="relative cursor-pointer">
              <Icon name="IconTbBell" width={24} height={24} />
            </div>

            {/* 프로필 드롭다운 */}
            <div className="cursor-pointer">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  {/* Avatar 적용 */}
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
          <TextButton type="start" onClick={() => setIsLoginVisible(true)}>
            시작하기
          </TextButton>
        )}
      </header>

      {/* 프로필 모달 */}
      {isProfileOpen && isLoggedIn && (
        <Profile
          profileUrl={profileUrl}
          userEmail={userEmail}
          signupDate={signupDate}
          onClose={() => setIsProfileOpen(false)}
        />
      )}

      {/* 로그인 모달 */}
      <Login
        isVisible={isLoginVisible}
        onClose={() => setIsLoginVisible(false)}
        onSuccess={(id) => {
          setIsLoggedIn(true);
          setUserId(id);
        }}
      />
    </>
  );
}

export default Header;
