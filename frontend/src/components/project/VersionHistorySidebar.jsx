import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { get } from '../../api';

const VersionHistorySidebar = ({ blueprintId, blueprintTitle, onClose }) => {
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await get(`blueprints/${blueprintId}`);
        setVersions(response.data.content);
      } catch (error) {
        console.error('API 호출 오류:', error);
      }
    };

    fetchVersions();
  }, [blueprintId]);

  return (
    <SidebarContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-left">모든 시안</h1>
        <CloseButton onClick={onClose} className="text-xl cursor-pointer">
          ×
        </CloseButton>
      </div>
      <hr className="my-4" />
      <h2 className="text-left">{blueprintTitle}</h2>

      <VersionList>
        {versions.map((version) => (
          <VersionItem key={version.blueprint_version_id}>
            <div className="flex flex-col">
              <PreviewImage
                src={version.preview_image}
                alt={version.blueprint_version_name}
                className="mb-2"
              />
              <div className="flex justify-between p-2">
                <VersionName>{version.blueprint_version_name}</VersionName>
                <CreatedAt>
                  {new Date(version.created_at).toLocaleDateString()}
                </CreatedAt>
              </div>
            </div>
          </VersionItem>
        ))}
      </VersionList>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  width: 20rem;
  height: 100%;
  background: #f8f9fa;
  border-left: 1px solid #ddd;
  padding: 16px;
  overflow-y: auto;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 10;
`;

const VersionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const VersionItem = styled.div`
  align-items: center;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e9ecef;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  display: flex;
  object-fit: cover;
  padding: 0.5rem;
`;

const VersionName = styled.div`
  font-size: 0.9rem;
`;

const CreatedAt = styled.div`
  font-size: 0.8rem;
  color: gray;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  cursor: pointer;
`;

export default VersionHistorySidebar;
