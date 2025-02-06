import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { get, del } from '../../api';
import { useNavigate } from 'react-router-dom';
import EditButton from '../common/EditButton';
import UpdateProjectName from './UpdateProjectName';
import { useSetRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const Thumbnail = ({ userId, filterType, searchQuery }) => {
  const [projects, setProjects] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(true);

  const navigate = useNavigate();

  const setModal = useSetRecoilState(modalState);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await get(`projects?user_id=${userId}`);
        const filteredProjects = response.data.content.filter((project) => {
          if (filterType === 'mine') return project.is_mine;
          if (filterType === 'shared') return !project.is_mine;
          return true;
        });

        // 검색어가 있을 경우만 필터링 추가
        console.log(searchQuery);
        const searchedProjects = searchQuery
          ? filteredProjects.filter((project) =>
              project.project_title
                ? project.project_title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                : false,
            )
          : filteredProjects;

        console.log(filteredProjects === searchedProjects);

        setProjects(searchedProjects);
        setImageLoaded(new Array(searchedProjects.length).fill(false));
      } catch (error) {
        console.error('프로젝트 목록을 불러오는데 실패했습니다.', error);
      }
    };

    if (userId) {
      fetchProjects();
    }
  }, [userId, filterType, searchQuery]);

  const handleImageLoad = (index) => {
    setImageLoaded((prevState) => {
      const updated = [...prevState];
      updated[index] = true;
      return updated;
    });
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}/blueprints`);
  };

  const handleUpdateProjectName = (projectId, projectTitle) => {
    setModal({
      type: 'modal',
      title: '프로젝트 수정',
      content: (
        <UpdateProjectName
          projectId={projectId}
          projectTitle={projectTitle}
          setModal={setModal}
        />
      ),
    });
  };

  const handleRemoveProject = async (projectId) => {
    setModal({
      type: 'confirm',
      message: '정말 삭제하시겠습니까?',
      onConfirm: async () => {
        try {
          // 삭제 요청을 보내는 API
          const response = await del(`projects/${projectId}`);

          if (response.status === 200) {
            alert('삭제 완료');

            // 프로젝트 목록에서 해당 프로젝트 제거
            setProjects((prevProjects) =>
              prevProjects.filter(
                (project) => project.project_id !== projectId,
              ),
            );
            setModal(null);
          } else {
            alert('삭제 실패');
          }
        } catch (error) {
          alert('삭제 중 오류가 발생했습니다.');
          console.error('삭제 오류:', error);
        }
      },
    });
  };

  return (
    <Components>
      {Array.isArray(projects) &&
        projects.map((project) => (
          <ProjectCard key={project.project_id}>
            <ImageContainer>
              {project.preview_images.slice(0, 4).map((image, index) => (
                <ImageWrapper key={index}>
                  <PreviewImage
                    src={image.preview_image}
                    alt={image.blueprint_title}
                    onLoad={() => handleImageLoad(index)}
                  />
                  <BlueprintTitle>{image.blueprint_title}</BlueprintTitle>
                  {index === 3 && project.preview_images.length > 4 && (
                    <MoreImages>
                      +{project.preview_images.length - 4}
                    </MoreImages>
                  )}
                </ImageWrapper>
              ))}
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
                <Title onClick={() => handleProjectClick(project.project_id)}>
                  {project.project_title}
                </Title>
                <EditButton
                  actions={[
                    {
                      name: '수정',
                      handler: () =>
                        handleUpdateProjectName(
                          project.project_id,
                          project.project_title,
                        ),
                    },
                    {
                      name: '삭제',
                      handler: () => handleRemoveProject(project.project_id),
                    },
                  ]}
                />
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
  width: 100%;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.8rem;
`;

const BlueprintTitle = styled.div`
  position: absolute;
  font-size: 0.8rem;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    ${BlueprintTitle} {
      opacity: 1;
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
  visibility: ${(props) => (props.$isImageLoaded ? 'hidden' : 'visible')};
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

const CreatedAt = styled.div`
  font-size: 0.5rem;
  color: #888;
`;

const FileInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
`;
