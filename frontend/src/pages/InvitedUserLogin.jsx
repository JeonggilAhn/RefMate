import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LoginContent from '../components/main/LoginContent';

const InvitedUserLogin = () => {
  const [query] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const grantToken = query.get('grant_token');

    if (grantToken) {
      document.cookie = `grant_token=${grantToken}; path=/; max-age=3600; Secure;`;
      console.log('쿠키: ', document.cookie);

      // navigate('/projects'); // grant_token이 있으면 /projects로 이동
    } else {
      navigate('/'); // 없으면 메인으로 이동
    }
  }, [query, navigate]);

  return (
    <Overlay>
      <Popup>
        <LoginContent />
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
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
