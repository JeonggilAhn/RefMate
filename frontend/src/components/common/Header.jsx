import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Login from '../main/Login'; // Login 컴포넌트 import
import alarmIcon from '../../assets/icons/alarm.svg'; // alarm.png 파일 import

function Header() {
  const [isLoggedIn] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false); // 로그인 팝업 상태 관리

  const handleOpenLogin = () => {
    setIsLoginVisible(true);
  };

  const handleCloseLogin = () => {
    setIsLoginVisible(false);
  };

  return (
    <>
      <HeaderContainer>
        <StyledLink to="/">
          {/* 로고와 아이콘 누르면 home으로 */}
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
              <ProfileImage alt="프로필" />
            </ProfileIcon>
          </LoggedInSection>
        ) : (
          <StartButton onClick={handleOpenLogin}>시작하기</StartButton>
        )}
      </HeaderContainer>
      <Login isVisible={isLoginVisible} onClose={handleCloseLogin} />
    </>
  );
}

export default Header;

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  height: 48px;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: white;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
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
  font-size: 1.25rem; /* 20px */
  font-weight: bold;
  color: #87b5fa;
  margin-right: 0.5rem; /* 8px */
`;

const Name = styled.div`
  font-size: 1.125rem; /* 18px */
  font-weight: bold;
  color: #333;
`;

const StartButton = styled.button`
  height: 2rem; /* 32px */
  padding: 0.5rem 1.25rem; /* 8px 20px */
  font-size: 0.875rem; /* 14px */
  background-color: #7ba8ec;
  color: white;
  border: none;
  border-radius: 0.3125rem; /* 5px */
  cursor: pointer;

  &:hover {
    background-color: #6589bf;
  }
`;

const LoggedInSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; /* 16px */
`;

const NotificationIcon = styled.div`
  position: relative;
  cursor: pointer;

  img {
    width: 2rem; /* 32px */
    height: 2rem; /* 32px */
  }
`;

const ProfileIcon = styled.div`
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 1.5rem; /* 24px */
  height: 1.5rem; /* 24px */
  border-radius: 50%;
  border: 0.0625rem solid #ddd; /* 1px */
`;
