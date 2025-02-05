import React from 'react';
import styled from 'styled-components';
import googleLogo from '../../assets/icons/google_logo.svg';
import naverLogo from '../../assets/icons/Naver_logo.svg';
import kakaoLogo from '../../assets/icons/Kakao_logo.svg';
import TextButton from '../common/TextButton';

const Login = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const handleLogin = (provider) => {
    window.location.href = `http://i12a807.p.ssafy.io:8000/oauth2/authorization/${provider}`;
  };

  return (
    <Overlay>
      <Popup>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>
          <PinIcon>📌</PinIcon> Ref Mate에 오신 것을 환영합니다.
        </Title>
        <ButtonGroup>
          <TextButton
            type="content"
            onClick={() => handleLogin('google')}
            className="flex items-center gap-3"
          >
            <Logo src={googleLogo} alt="Google Logo" />
            구글로 시작하기
          </TextButton>
          <TextButton
            type="content"
            onClick={() => handleLogin('naver')}
            className="flex items-center gap-3"
          >
            <Logo src={naverLogo} alt="Naver Logo" />
            네이버로 시작하기
          </TextButton>
          <TextButton
            type="content"
            onClick={() => handleLogin('kakao')}
            className="flex items-center gap-3"
          >
            <Logo src={kakaoLogo} alt="Kakao Logo" />
            카카오로 시작하기
          </TextButton>
        </ButtonGroup>
      </Popup>
    </Overlay>
  );
};

export default Login;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const Popup = styled.div`
  background-color: #fff;
  width: 25rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.625rem rgba(0, 0, 0, 0.1);
  position: relative;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const PinIcon = styled.span`
  font-size: 1rem;
  color: #5b92e5;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Logo = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;
