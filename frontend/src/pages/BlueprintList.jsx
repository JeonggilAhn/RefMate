import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import BlueprintListSubHeader from '../components/project/BlueprintListSubHeader';
import BlueprintThumbnail from '../components/project/BlueprintThumbnail';
import BlueprintListTabs from '../components/project/BlueprintListTabs';
import { get } from '../api/index';
import { useRecoilState } from 'recoil';
import { projectState } from '../recoil/common/project';

function BlueprintList() {
  const { projectId } = useParams(); // projectId 가져오기
  const [query, setQuery] = useSearchParams(); // query 가져오기
  const [nonMember, setNonMember] = useState(false);

  // presigned 쿼리 파라미터가 있으면 nonMember를 true로 설정
  useEffect(() => {
    const presigned = query.get('presigned');
    if (presigned) {
      setNonMember(true);

      // 로컬 스토리지에 저장
      localStorage.setItem('presigned', presigned);
    } else {
      setNonMember(false);
    }
  }, [query]);

  console.log(projectId);

  const [projectTitle, setProjectTitle] = useState('');
  const [blueprints, setBlueprints] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [project, setProject] = useRecoilState(projectState);

  useEffect(() => {
    const fetchProjectName = async () => {
      if (projectId) {
        try {
          const response = await get(`projects/${projectId}`);
          const title = response.data.content.project_title;
          setProjectTitle(title);

          setProject({
            projectId: projectId,
            projectTitle: title,
          });
        } catch (error) {
          console.error('프로젝트 이름을 가져오는데 실패했습니다.', error);
        }
      }
    };

    const fetchBlueprints = async () => {
      try {
        const response = await get(`projects/${projectId}/blueprints`);
        setBlueprints(response.data.content);
      } catch (error) {
        console.error('API 호출 오류:', error);
      }
    };

    fetchProjectName();
    fetchBlueprints();
  }, [projectId]);

  // 검색 쿼리
  const searchedBlueprints = blueprints.filter((blueprint) => {
    if (
      searchQuery &&
      !blueprint.blueprint_title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <Wrapper>
      <Header />
      <ContentWrapper>
        <BlueprintListSubHeader
          projectTitle={projectTitle}
          projectId={projectId}
          setBlueprints={setBlueprints}
          setProjectTitle={setProjectTitle}
          nonMember={nonMember}
        />
        <BlueprintListTabs
          actions={[{ name: '모든 블루프린트', type: 'all' }]}
          setFilterType={setFilterType}
          setSearchQuery={setSearchQuery}
        ></BlueprintListTabs>
        <BlueprintThumbnail
          projectId={projectId}
          blueprints={searchedBlueprints}
          setBlueprints={setBlueprints}
          nonMember={nonMember}
        />
      </ContentWrapper>
      <BackButton />
    </Wrapper>
  );
}

export default BlueprintList;

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
`;
