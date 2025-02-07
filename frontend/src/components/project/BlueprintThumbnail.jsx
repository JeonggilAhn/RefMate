import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { get } from '../../api';
import { useNavigate } from 'react-router-dom';
import EditButton from '../common/EditButton';
import VersionHistorySidebar from './VersionHistorySidebar';

const BlueprintThumbnail = ({ projectId }) => {
  const [blueprints, setBlueprints] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBlueprintId, setSelectedBlueprintId] = useState(null);
  const [selectedBlueprintTitle, setSelectedBlueprintTitle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlueprints = async () => {
      try {
        const response = await get(`projects/${projectId}/blueprints`);
        setBlueprints(response.data.content);
      } catch (error) {
        console.error('API 호출 오류:', error);
      }
    };

    fetchBlueprints();
  }, [projectId]);

  const handleViewLatest = (blueprintId) => {
    navigate(`/blueprint`);
    // navigate(`/blueprint/${blueprintId}`);
  };

  const handleViewAll = (blueprintId, blueprintTitle) => {
    setSelectedBlueprintId(blueprintId);
    setSelectedBlueprintTitle(blueprintTitle);
    setIsSidebarOpen(true);
  };

  return (
    // <Container>
    <BlueprintWrapper>
      {blueprints.map((blueprint) => (
        <BlueprintItem key={blueprint.blueprint_id}>
          <Image
            src={blueprint.preview_image}
            alt={blueprint.blueprint_title}
          />
          <Footer>
            <Title>{blueprint.blueprint_title}</Title>
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
              ]}
            />
          </Footer>

          <CreatedAt>
            {new Date(blueprint.created_at).toLocaleDateString()}
          </CreatedAt>

          <HoverButtons>
            <button onClick={() => handleViewLatest(blueprint.blueprint_id)}>
              최신 시안 보기
            </button>
            <button
              onClick={() =>
                handleViewAll(blueprint.blueprint_id, blueprint.blueprint_title)
              }
            >
              전체 시안 보기
            </button>
          </HoverButtons>
        </BlueprintItem>
      ))}
      {isSidebarOpen && (
        <VersionHistorySidebar
          blueprintId={selectedBlueprintId}
          blueprintTitle={selectedBlueprintTitle}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
    </BlueprintWrapper>

    // </Container>
  );
};

const BlueprintWrapper = styled.div`
  width: 100%;
  gap: 1rem;
  padding: 1.5rem;
  display: grid;
  overflow-y: auto;
  grid-template-columns: repeat(3, 1fr);
  max-height: calc(100vh - 200px);
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  aspect-ratio: 4 / 3;
`;

const CreatedAt = styled.div`
  font-size: 0.5rem;
  color: #888;
  text-align: left;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
`;

const Title = styled.h3`
  font-size: 0.5rem;
  margin-bottom: 5px;
`;

const HoverButtons = styled.div`
  position: absolute;
  display: flex;
  top: 50%; /* 세로 중앙 */
  left: 50%; /* 가로 중앙 */
  transform: translate(-50%, -50%); /* 중앙 정렬 */
  gap: 0.5rem;
  visibility: hidden;
  flex-direction: column;

  button {
    flex: 1; /* 버튼을 네모로 늘리기 */
    padding: 0.5rem;
    font-size: 0.8rem;
    background-color: rgba(215, 215, 215);
    cursor: pointer;
  }
`;

const BlueprintItem = styled.div`
  border: 1px solid #ccc;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  position: relative; /* 자식 요소인 HoverButtons가 절대 위치를 가질 수 있도록 */

  &:hover ${HoverButtons} {
    opacity: 1; /* 호버 시 버튼들이 보이도록 설정 */
    visibility: visible;
  }
`;

export default BlueprintThumbnail;
