import React, { useEffect } from 'react';
import styled from 'styled-components';
import TextButton from '../components/common/TextButton';
import Icon from '../components/common/Icon';
import { useSearchParams, useNavigate } from 'react-router-dom';

const InvitedUserLogin = () => {
  const [query] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const grantToken = query.get('grant_token');

    if (grantToken) {
      document.cookie = `grant_token=${grantToken}; path=/; max-age=3600; Secure; HttpOnly;`;
      console.log('쿠키: ', document.cookie);

      // navigate('/projects'); // grant_token이 있으면 /projects로 이동
    } else {
      navigate('/'); // 없으면 메인으로 이동
    }
  }, [query, navigate]);

  const handleLogin = (provider) => {
    const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <Overlay>
      <Popup>
        <Title>
          <PinIcon>📌</PinIcon> Ref Mate에 오신 것을 환영합니다.
        </Title>
        <ButtonGroup>
          <TextButton
            type="content"
            onClick={() => handleLogin('google')}
            className="flex items-center gap-3"
          >
            <Icon name="IconGoogleLogo" width={24} height={24} />
            구글로 시작하기
          </TextButton>
          <TextButton
            type="content"
            onClick={() => handleLogin('naver')}
            className="flex items-center gap-3"
          >
            <Icon name="IconNaverLogo" width={24} height={24} />
            네이버로 시작하기
          </TextButton>
          <TextButton
            type="content"
            onClick={() => handleLogin('kakao')}
            className="flex items-center gap-3"
          >
            <Icon name="IconKakaoLogo" width={24} height={24} />
            카카오로 시작하기
          </TextButton>
        </ButtonGroup>
      </Popup>
    </Overlay>
  );
};

export default InvitedUserLogin;

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
  z-index: 15;
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
