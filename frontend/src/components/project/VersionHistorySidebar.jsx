import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { get } from '../../api';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

const VersionHistorySidebar = ({ projectId, blueprintId }) => {
  const [versions, setVersions] = useState([]);
  const navigate = useNavigate();

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

  // 클릭 이벤트를 여기서 처리
  const handleClickVersions = (blueprint_version_id) => {
    console.log(blueprint_version_id);
    navigate(
      `/projects/${projectId}/blueprints/${blueprintId}/${blueprint_version_id}`,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {versions.map((version) => (
        <VersionItemComponent
          key={version.blueprint_version_id}
          version={version}
          handleClickVersions={handleClickVersions} // handleClickVersions를 전달
        />
      ))}
    </div>
  );
};

// VersionItemComponent를 별도의 컴포넌트로 분리
const VersionItemComponent = ({ version, handleClickVersions }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <VersionItem>
      {!imageLoaded && (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-55 w-50" />
        </div>
      )}
      <div
        className="flex flex-col"
        onClick={() => handleClickVersions(version.blueprint_version_id)} // 여기서 handleClickVersions를 호출
      >
        <PreviewImage
          src={version.preview_image}
          alt={version.blueprint_version_name}
          onLoad={() => setImageLoaded(true)}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
        <div className="rounded-lg">
          <div className="flex justify-between p-2">
            <VersionName>{version.blueprint_version_name}</VersionName>
            <CreatedAt>
              {new Date(version.created_at).toLocaleDateString()}
            </CreatedAt>
          </div>
        </div>
      </div>
    </VersionItem>
  );
};

const VersionItem = styled.div`
  align-items: center;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 8px;
  overflow: hidden;

  &:hover {
    background: #e9ecef;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  display: flex;
  object-fit: cover;
`;

const VersionName = styled.div`
  font-size: 0.9rem;
`;

const CreatedAt = styled.div`
  font-size: 0.8rem;
  color: gray;
`;

export default VersionHistorySidebar;
