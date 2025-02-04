import React from 'react';
import styled from 'styled-components';
import googleLogo from '../../assets/icons/google_logo.svg';
import naverLogo from '../../assets/icons/Naver_logo.svg';
import kakaoLogo from '../../assets/icons/Kakao_logo.svg';

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const Login = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const handleLogin = (provider) => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <Overlay>
      <Popup>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>
          <PinIcon>📌</PinIcon> DAWN에 오신 것을 환영합니다.
        </Title>
        <ButtonGroup>
          <LoginButton onClick={() => handleLogin('google')}>
            <Logo src={googleLogo} alt="Google Logo" />
            구글로 시작하기
          </LoginButton>
          <LoginButton onClick={() => handleLogin('naver')}>
            <Logo src={naverLogo} alt="Naver Logo" />
            네이버로 시작하기
          </LoginButton>
          <LoginButton onClick={() => handleLogin('kakao')}>
            <Logo src={kakaoLogo} alt="Kakao Logo" />
            카카오로 시작하기
          </LoginButton>
        </ButtonGroup>
      </Popup>
    </Overlay>
  );
};

export default Login;
