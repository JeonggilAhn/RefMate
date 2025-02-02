import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { get } from '../../api';
import { useLocation } from 'react-router-dom';

const SubHeader = ({ userId }) => {
  const [userName, setUserName] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await get(`users/${userId}`);
        const email = response.data.content.user_email;
        const name = email.split('@')[0]; // '@' 전까지의 문자열을 추출
        setUserName(name);
      } catch (error) {
        console.error('사용자 이름을 가져오는데 실패했습니다.', error);
      }
    };

    fetchUserName();
  }, [userId]);

  // 'blueprints'가 URL에 포함되면 블루프린트 페이지로 간주
  const isBlueprintListPage = location.pathname.includes('blueprints');

  return (
    <SubHeaderWrapper>
      <h3>{isBlueprintListPage ? '프로젝트 이름' : `${userName}님의 공간`}</h3>
      <div className="border border-black">
        <button>
          {isBlueprintListPage
            ? '새 블루프린트 만들기 +'
            : '새 프로젝트 만들기 +'}
        </button>
      </div>
    </SubHeaderWrapper>
  );
};

const SubHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
`;

export default SubHeader;
