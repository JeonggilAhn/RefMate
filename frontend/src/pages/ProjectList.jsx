import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import ProjectTabs from '../components/project/ProjectTabs';
import Thumbnail from '../components/project/Thumbnail';
import ProjectSubHeader from '../components/project/ProjectSubHeader';
import { get } from '../api/index';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await get('projects');
        setProjects(response.data.content);
      } catch (error) {
        console.error('프로젝트 목록을 불러오는데 실패했습니다.', error);
      }
    };

    fetchProjects();
  }, []);

  // 필터 및 검색 적용
  const filteredProjects = projects.filter((project) => {
    if (filterType === 'mine' && !project.is_mine) return false;
    if (filterType === 'shared' && project.is_mine) return false;
    if (
      searchQuery &&
      !project.project_title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <Wrapper>
      <Header />
      <ContentWrapper>
        <ProjectSubHeader setProjects={setProjects} />
        <ProjectTabs
          actions={[
            { name: '모든 프로젝트', type: 'all' },
            { name: '내 프로젝트', type: 'mine' },
            { name: '공유 프로젝트', type: 'shared' },
          ]}
          setFilterType={setFilterType}
          setSearchQuery={setSearchQuery}
        />
        <Thumbnail projects={filteredProjects} setProjects={setProjects} />
      </ContentWrapper>
      <BackButton />
    </Wrapper>
  );
}

export default ProjectList;

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 48px; // 헤더자리
  height: calc(100vh - 48px);
  overflow: hidden; /* Wrapper에는 스크롤을 적용하지 않음 */
`;

const ContentWrapper = styled.div`
  padding: 25px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  flex-grow: 1;
`;
