import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { get } from '../../api';
import { MdMoreHoriz } from 'react-icons/md';

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // 기본 날짜 형식 (yyyy/mm/dd)
};

const Thumbnail = ({ userId }) => {
  const [projects, setProjects] = useState([]); // 프로젝트 상태 추가
  const [imageLoaded, setImageLoaded] = useState(true); // 이미지 로딩 상태 추가

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await get(`projects?user_id=${userId}`);
        console.log(response.data); // 응답 데이터 확인
        console.log(response.data.content); // content 배열 확인
        setProjects(response.data.content); // content 배열을 projects에 설정
      } catch (error) {
        console.error('프로젝트 목록을 불러오는데 실패했습니다.', error);
      }
    };

    if (userId) {
      fetchProjects();
    }
  }, [userId]);

  // 이미지 로딩 완료 처리
  const handleImageLoad = (index) => {
    setImageLoaded((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <Components>
      {/* projects가 배열일 때만 map 호출 */}
      {Array.isArray(projects) &&
        projects.map((project) => (
          <ProjectCard key={project.project_id}>
            <ImageContainer>
              {project.preview_images.slice(0, 4).map((image, index) => (
                <ImageWrapper key={index}>
                  <PreviewImage
                    src={image.preview_image}
                    alt={image.blueprint_title}
                    onLoad={() => handleImageLoad(index)} // 이미지 로딩 시 처리
                  />
                  <BlueprintTitle>{image.blueprint_title}</BlueprintTitle>
                  {/* 4번째 이미지 위에 + 표시 */}
                  {index === 3 && project.preview_images.length > 4 && (
                    <MoreImages>
                      +{project.preview_images.length - 4}
                    </MoreImages>
                  )}
                </ImageWrapper>
              ))}
              {/* 기본 이미지 채우기 (회색 상자) */}
              {project.preview_images.length < 4 &&
                Array.from({ length: 4 - project.preview_images.length }).map(
                  (_, idx) => (
                    <ImageWrapper key={idx}>
                      <PlaceholderImage $isImageLoaded={imageLoaded[idx]} />
                    </ImageWrapper>
                  ),
                )}
            </ImageContainer>
            <ProjectDetails>
              <ProjectFooter>
                <Title>{project.project_title}</Title>
                <EditIcon />
              </ProjectFooter>
              <FileInfoWrapper>
                <FileCount>{project.blueprints_count} blueprints ·</FileCount>
                <CreatedAt>{formatDate(project.created_at)}</CreatedAt>
              </FileInfoWrapper>
            </ProjectDetails>
          </ProjectCard>
        ))}
    </Components>
  );
};

export default Thumbnail;

const Components = styled.div`
  flex-grow: 1;
  width: 100%;
  overflow-y: auto; /* 스크롤 가능 */
  max-height: calc(100vh - 200px); /* Header, SubHeader, Tab을 제외한 영역 */
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 한 줄에 3개 */
  gap: 1rem;
  padding: 1.5rem;
  box-sizing: border-box;
`;

const ProjectCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(
    2,
    1fr
  ); /* 2개씩 배치, 총 4개의 칸에 배치할 예정 */
  gap: 0.5rem;
  margin-bottom: 0.8rem;
`;

const BlueprintTitle = styled.div`
  position: absolute;
  font-size: 0.8rem;
  top: 0; /* 상단에 고정 */
  left: 0; /* 좌측에 고정 */
  width: 100%; /* 이미지 영역과 크기 맞추기 */
  height: 100%; /* 이미지 영역과 크기 맞추기 */
  display: flex;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center; /* 수평 중앙 정렬 */
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
  opacity: 0;
  transition: opacity 0.3s ease;
  box-sizing: border-box;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  transition: background-color 0.3s ease; /* 배경색 전환에 부드러운 효과 추가 */

  &:hover {
    background-color: rgba(0, 0, 0, 0.5); /* 이미지 호버 시 색을 어둡게 */
    border-radius: 4px;
    ${BlueprintTitle} {
      opacity: 1; /* 호버 시 제목 표시 */
    }
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

const PlaceholderImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(124, 124, 124);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.2rem;
  text-align: center;
  visibility: ${(props) =>
    props.$isImageLoaded ? 'hidden' : 'visible'}; /* 이 부분을 수정 */
`;

const MoreImages = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 4px;
  font-size: 0.8rem;
  padding: 5px;
  position: absolute;
  top: 50%; /* 4번째 이미지의 중앙에 위치시킬 수 있도록 */
  left: 50%;
  transform: translate(-50%, -50%); /* 정확한 중앙 정렬 */
  width: 100%;
  height: 100%;
`;

const ProjectDetails = styled.div`
  width: 100%;
  text-align: center;
`;

const Title = styled.h3`
  font-size: 0.8rem;
  margin-bottom: 5px;
`;

const ProjectFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
`;

const FileCount = styled.span`
  color: #888;
  font-size: 0.5rem;
`;

const EditIcon = styled(MdMoreHoriz)`
  cursor: pointer;
  font-size: 0.8rem;
  color: #888;
  &:hover {
    color: #7ba8ec;
  }
`;

const CreatedAt = styled.div`
  font-size: 0.5rem;
  color: #888;
`;

const FileInfoWrapper = styled.div`
  display: flex;
  align-items: center; /* 세로 정렬 */
  justify-content: flex-start; /* 왼쪽 정렬 */
  gap: 2px; /* 두 요소 간 간격 */
`;
