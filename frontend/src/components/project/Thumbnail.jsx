import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import UpdateProjectName from './UpdateProjectName';
import { useSetRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';
import EditOption from './EditOption';
import { del } from '../../api';

const Thumbnail = ({ projects, setProjects }) => {
  const [imageLoaded, setImageLoaded] = useState({});
  const navigate = useNavigate();
  const setModal = useSetRecoilState(modalState);

  const handleImageLoad = (id) => {
    setImageLoaded((prevState) => ({ ...prevState, [id]: true }));
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
          setProjectName={(updatedTitle) => {
            setProjects((prevProjects) =>
              prevProjects.map((project) =>
                project.project_id === projectId
                  ? { ...project, project_title: updatedTitle }
                  : project,
              ),
            );
          }}
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
          await del(`projects/${projectId}`);
          alert('삭제 완료');
          setProjects((prev) => prev.filter((p) => p.project_id !== projectId));
          setModal(null);
        } catch (error) {
          alert('삭제 중 오류 발생');
          console.error(error);
        }
      },
    });
  };

  return (
    <Components>
      {projects.map((project) => (
        <ProjectCard
          key={project.project_id}
          onClick={() => handleProjectClick(project.project_id)}
        >
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
                  <MoreImages>+{project.preview_images.length - 4}</MoreImages>
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
              <Title>{project.project_title}</Title>
              <EditOption
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
              <FileCount>
                {project.blueprints_count} blueprints{' '}
                <span className="px-2">·</span>
              </FileCount>
              <CreatedAt>
                {new Date(project.created_at).toLocaleDateString()}
              </CreatedAt>
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
  text-align: center;
  word-break: break-all;
  visibility: ${(props) => (props.$isImageLoaded ? 'hidden' : 'visible')};
`;

const MoreImages = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 4px;
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
  font-size: 20px;
  margin-bottom: 5px;
`;

const ProjectFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FileCount = styled.span`
  color: #888;
  font-size: 13px;
`;

const CreatedAt = styled.div`
  font-size: 13px;
  color: #888;
`;

const FileInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
`;
