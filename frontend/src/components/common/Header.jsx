import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Login from '../main/Login';
import alarmIcon from '../../assets/icons/alarm.svg';
import logoutIcon from '../../assets/icons/Logout.svg';
import { get, post } from '../../api';
import Profile from './Profile';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 기본 비로그인 상태
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
          setProfileUrl(data?.profile_url || 'https://via.placeholder.com/24');
          setUserEmail(data?.user_email || 'N/A');
          setSignupDate(
            new Date(data?.signup_date).toLocaleDateString() || 'N/A',
          );
        })
        .catch((error) => console.error('Failed to fetch user data:', error));
    }
  }, [isLoggedIn, userId]);

  const handleOpenLogin = () => {
    setIsLoginVisible(true);
  };

  const handleCloseLogin = () => {
    setIsLoginVisible(false);
  };

  const handleLoginSuccess = (id) => {
    setIsLoggedIn(true);
    setUserId(id);
  };

  const handleLogout = () => {
    post('auth/logout')
      .then(() => {
        setIsLoggedIn(false);
        setUserId(null);
        setProfileUrl('');
        setUserEmail('');
        setSignupDate('');
      })
      .catch((error) => console.error('Logout failed:', error));
  };

  return (
    <>
      <HeaderContainer>
        <StyledLink to="/">
          <Icon>
            <Logo>@</Logo>
            <Name>DAWN</Name>
          </Icon>
        </StyledLink>
        {isLoggedIn ? (
          <LoggedInSection>
            <NotificationIcon>
              <img src={alarmIcon} alt="알림" />
            </NotificationIcon>
            <ProfileIcon>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <ProfileImage src={profileUrl} alt="프로필" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                  >
                    프로필
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogoutIcon src={logoutIcon} alt="로그아웃 아이콘" />{' '}
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ProfileIcon>
          </LoggedInSection>
        ) : (
          <StartButton onClick={handleOpenLogin}>시작하기</StartButton>
        )}
      </HeaderContainer>
      {isProfileOpen && isLoggedIn && (
        <Profile
          profileUrl={profileUrl}
          userEmail={userEmail}
          signupDate={signupDate}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
      <Login
        isVisible={isLoginVisible}
        onClose={handleCloseLogin}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default Header;

// 스타일 정의
const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  height: 48px;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: white;
  border-bottom: 1px solid #ddd;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #87b5fa;
  margin-right: 0.5rem;
`;

const Name = styled.div`
  font-size: 1.125rem;
  font-weight: bold;
  color: #333;
`;

const LoggedInSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NotificationIcon = styled.div`
  position: relative;
  cursor: pointer;

  img {
    width: 2rem;
    height: 2rem;
  }
`;

const ProfileIcon = styled.div`
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 0.0625rem solid #ddd;
`;

const LogoutIcon = styled.img`
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
`;

const StartButton = styled.button`
  height: 2rem;
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  background-color: #7ba8ec;
  color: white;
  border: none;
  border-radius: 0.3125rem;
  cursor: pointer;

  &:hover {
    background-color: #6589bf;
  }
`;
