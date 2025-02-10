import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { get } from '../api';

const TokenCheck = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');

  useEffect(() => {
    // API 호출하여 토큰 가져오기
    const fetchToken = async () => {
      try {
        const response = await get('auth/issue');

        const accessToken = response.headers; // 백엔드에서 받은 토큰
        console.log(response);
        console.log(accessToken);
        if (accessToken) {
          setToken(accessToken);
          localStorage.setItem('access_token', accessToken); // 로컬 스토리지 저장

          // 5초 후 자동 이동
          setTimeout(() => {
            navigate('/projects');
          }, 5000000);
        } else {
          console.error('서버에서 받은 토큰이 없습니다.');
        }
      } catch (error) {
        console.error('토큰 요청 실패:', error);
      }
    };

    fetchToken();
  }, [navigate]);

  return (
    <Container>
      <Title> 로그인 성공!</Title>
      <Subtitle>OAuth 토큰을 확인 중입니다...</Subtitle>
      {token ? (
        <TokenBox>
          <strong>토큰:</strong> {token}
        </TokenBox>
      ) : (
        <LoadingText>토큰을 가져오는 중...</LoadingText>
      )}
      <RedirectMessage>잠시 후 프로젝트 페이지로 이동합니다...</RedirectMessage>
    </Container>
  );
};

export default TokenCheck;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
`;

const TokenBox = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
  word-break: break-all;
  max-width: 80%;
  text-align: center;
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: #999;
`;

const RedirectMessage = styled.p`
  margin-top: 1.5rem;
  font-size: 1rem;
  color: #555;
`;
