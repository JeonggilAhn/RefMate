import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { get } from '../../api';
import { useNavigate } from 'react-router-dom';
import VersionHistorySidebar from './VersionHistorySidebar';
import { useSetRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';
import TextButton from '../common/TextButton';
import EditOption from './EditOption';
import UpdateBlueprintName from './UpdateBlueprintName';

const BlueprintThumbnail = ({ projectId, filterType, searchQuery }) => {
  const [blueprints, setBlueprints] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBlueprintId, setSelectedBlueprintId] = useState(null);
  const [selectedBlueprintTitle, setSelectedBlueprintTitle] = useState(null);
  const navigate = useNavigate();
  const setModal = useSetRecoilState(modalState);

  useEffect(() => {
    const fetchBlueprints = async () => {
      try {
        const response = await get(`projects/${projectId}/blueprints`);
        const filteredProjects = response.data.content;
        console.log(filteredProjects);
        console.log(searchQuery);
        const searchedBlueprints = searchQuery
          ? filteredProjects.filter((blueprint) =>
              blueprint.blueprint_title
                ? blueprint.blueprint_title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                : false,
            )
          : filteredProjects;

        console.log(searchedBlueprints === filteredProjects);
        setBlueprints(searchedBlueprints);
      } catch (error) {
        console.error('API 호출 오류:', error);
      }
    };

    fetchBlueprints();
  }, [projectId, filterType, searchQuery]);

  const handleViewLatest = (blueprintId) => {
    navigate(`/blueprint`);
    // navigate(`/blueprint/${blueprintId}`);
  };

  const handleViewAll = (blueprintId, blueprintTitle) => {
    setSelectedBlueprintId(blueprintId);
    setSelectedBlueprintTitle(blueprintTitle);
    setIsSidebarOpen(true);
  };

  const handleUpdateBlueprintName = (blueprintId, blueprintTitle) => {
    setModal({
      type: 'modal',
      title: '프로젝트 수정',
      content: (
        <UpdateBlueprintName
          blueprintId={blueprintId}
          blueprintTitle={blueprintTitle}
          setBlueprintName={(updatedTitle) => {
            setBlueprints((prevBlueprints) =>
              prevBlueprints.map((blueprint) =>
                blueprint.blueprint_id === blueprintId
                  ? { ...blueprint, blueprint_title: updatedTitle }
                  : blueprint,
              ),
            );
          }}
          setModal={setModal}
        />
      ),
    });
  };

  return (
    // <Container>
    <BlueprintWrapper>
      {blueprints.map((blueprint) => (
        <BlueprintItem key={blueprint.blueprint_id}>
          <ImageWrapperHover>
            <Image
              src={blueprint.preview_image}
              alt={blueprint.blueprint_title}
            />
            <HoverButtons>
              <TextButton
                onClick={() => handleViewLatest(blueprint.blueprint_id)}
              >
                최신 시안 보기
              </TextButton>
              <TextButton
                onClick={() =>
                  handleViewAll(
                    blueprint.blueprint_id,
                    blueprint.blueprint_title,
                  )
                }
              >
                전체 시안 보기
              </TextButton>
            </HoverButtons>
          </ImageWrapperHover>
          <Footer>
            <Title>{blueprint.blueprint_title}</Title>
            <EditOption
              actions={[
                {
                  name: '수정',
                  handler: () =>
                    handleUpdateBlueprintName(
                      blueprint.blueprint_id,
                      blueprint.blueprint_title,
                    ),
                },
              ]}
            />
          </Footer>

          <CreatedAt>
            {new Date(blueprint.created_at).toLocaleDateString()}
          </CreatedAt>
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
  display: block;
`;

const CreatedAt = styled.div`
  font-size: 0.5rem;
  color: #888;
  text-align: left;
  padding: 5px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
`;

const Title = styled.h3`
  font-size: 0.8rem;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  top: 0;
  left: 0;
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
  z-index: 2;

  button {
    flex: 1; /* 버튼을 네모로 늘리기 */
    cursor: pointer;
  }
`;

const BlueprintItem = styled.div`
  border: 1px solid #ccc;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  position: relative; /* 자식 요소인 HoverButtons가 절대 위치를 가질 수 있도록 */
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden; /* 이미지 크기 유지 */

  /* 검은 배경 오버레이 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0); /* 기본적으로 투명 */
    transition: background-color 0.3s ease;
    z-index: 1;
  }

  /* hover 시 검은 배경 표시 */
  &:hover::after {
    background-color: rgba(0, 0, 0, 0.5);
  }

  /* hover 시 HoverButtons 표시 */
  &:hover ${HoverButtons} {
    visibility: visible;
  }
`;

const ImageWrapperHover = styled(ImageWrapper)`
  &:hover ${HoverButtons} {
    visibility: visible;
  }
`;

export default BlueprintThumbnail;
