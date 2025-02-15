import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import UpdateProjectName from './UpdateProjectName';
import { useSetRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';
import EditOption from './EditOption';
import { del } from '../../api';
import { useToast } from '@/hooks/use-toast';

const Thumbnail = ({ projects, setProjects }) => {
  const [imageLoaded, setImageLoaded] = useState({});
  const [expandedProjects, setExpandedProjects] = useState({});
  const navigate = useNavigate();
  const setModal = useSetRecoilState(modalState);
  const { toast } = useToast(20);

  // projects가 로드되면 모든 프로젝트를 펼친 상태로 설정
  useEffect(() => {
    if (projects.length > 0) {
      const initialExpandedState = projects.reduce(
        (acc, project) => ({
          ...acc,
          [project.project_id]: true,
        }),
        {},
      );
      setExpandedProjects(initialExpandedState);
    }
  }, [projects]);

  const handleImageLoad = (id) => {
    setImageLoaded((prevState) => ({ ...prevState, [id]: true }));
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}/blueprints`);
  };

  const handleBlueprintClick = (projectId, blueprintId, blueprintVersionId) => {
    navigate(
      `/projects/${projectId}/blueprints/${blueprintId}/${blueprintVersionId}`,
    );
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
          toast({
            title: '프로젝트가 삭제되었습니다.',
            description: String(new Date()),
          });
          setProjects((prev) => prev.filter((p) => p.project_id !== projectId));
          setModal(null);
        } catch (error) {
          toast({
            title: '프로젝트가 삭제 중 오류가 발생했습니다.',
            description: String(new Date()),
          });
          console.error(error);
        }
      },
    });
  };

  const toggleProject = (projectId, event) => {
    event.stopPropagation();
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  return (
    <Components>
      {projects.map((project) => (
        <ProjectCard key={project.project_id}>
          <ProjectDetails>
            <ProjectHeader
              onClick={() => handleProjectClick(project.project_id)}
            >
              <Title>{project.project_title}</Title>
              <div onClick={(event) => event.stopPropagation()}>
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
              </div>
            </ProjectHeader>
            <ProjectInfo>
              <FileInfoWrapper
                onClick={(e) => toggleProject(project.project_id, e)}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  <FileCount>
                    {project.blueprints_count} blueprints{' '}
                    <span className="px-2">·</span>
                  </FileCount>
                  <CreatedAt>
                    {new Date(project.created_at).toLocaleDateString()}
                  </CreatedAt>
                </div>
                <ToggleButton
                  $isExpanded={expandedProjects[project.project_id]}
                >
                  {expandedProjects[project.project_id] ? '접기' : '펼치기'}
                </ToggleButton>
              </FileInfoWrapper>
            </ProjectInfo>
          </ProjectDetails>

          <ImageContainer $isExpanded={expandedProjects[project.project_id]}>
            {project.preview_images.map((image, index) => (
              <ImageWrapper
                key={index}
                onClick={() =>
                  handleBlueprintClick(
                    project.project_id,
                    image.blueprint_id,
                    image.blueprint_version_id,
                  )
                }
              >
                <PreviewImage
                  src={image.preview_image}
                  alt={image.blueprint_title}
                  onLoad={() => handleImageLoad(index)}
                />
                <BlueprintTitle>{image.blueprint_title}</BlueprintTitle>
              </ImageWrapper>
            ))}
          </ImageContainer>
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
  display: flex;
  flex-direction: column;
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
  gap: 1rem;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  transition: max-height 0.3s ease-in-out;
  overflow: hidden;
  max-height: ${(props) => (props.$isExpanded ? '2000px' : '0')};
  opacity: ${(props) => (props.$isExpanded ? 1 : 0)};
  transition: all 0.3s ease-in-out;
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

const ProjectDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h3`
  font-size: 20px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;

  &::after {
    content: '▼';
    transform: ${(props) =>
      props.$isExpanded ? 'rotate(180deg)' : 'rotate(0)'};
    transition: transform 0.3s ease;
  }
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
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 8px;
  background-color: #f5f5f5;
  cursor: pointer;

  &:hover {
    background-color: #eeeeee;
  }
`;
