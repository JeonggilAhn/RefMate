import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import alarmIcon from '../../assets/icons/alarm.svg'; // alarm.png 파일 import

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
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
        <StartButton>
          <Link to="/projects">프로젝트 페이지</Link>
        </StartButton>
      )}

      {/* 테스트용 상태 변경 버튼 로그인 기능 생성시 제거*/}
      <TestButton onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? '로그아웃' : '로그인'}
      </TestButton>
    </HeaderContainer>
  );
}

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
  z-index: 1000;
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
  font-size: 20px;
  font-weight: bold;
  color: #87b5fa;
  margin-right: 8px;
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const StartButton = styled.button`
  height: 32px;
  padding: 8px 20px;
  font-size: 14px;
  background-color: #7ba8ec;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #6589bf;
  }
`;

const LoggedInSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NotificationIcon = styled.div`
  position: relative;
  cursor: pointer;

  img {
    width: 32px; /* 알림 아이콘 크기*/
    height: 32px;
  }
`;

const ProfileIcon = styled.div`
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 24px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #ddd;
`;

const TestButton = styled.button`
  position: absolute;
  top: 60px; /* 헤더 아래에 위치 */
  right: 20px;
  padding: 8px 16px;
  font-size: 12px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`;

export default Header;
