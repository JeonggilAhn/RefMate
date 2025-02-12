import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';
import { projectState } from '../../recoil/common/project';
import { useNavigate } from 'react-router-dom';
import CreateBlueprintVersion from './CreateBlueprintVersion';
import { get } from '../../api/index';

const BlueprintVersions = ({
  blueprint_id,
  blueprints,
  setBlueprints,
  closeModal,
}) => {
  const [project, setProject] = useRecoilState(projectState);
  const { projectId, projectTitle } = project;
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleViewBlueprint = (blueprint_version_id) => {
    closeModal();
    navigate(
      `/projects/${projectId}/blueprints/${blueprint_id}/${blueprint_version_id}`,
      { replace: true },
    );
  };

  const refetchBlueprints = async () => {
    const bpsRes = await get(`blueprints/${blueprint_id}`);
    if (bpsRes.status === 200) {
      const newContent = bpsRes.data.content.map((item, index) => ({
        ...item,
        index,
      }));
      setBlueprints(newContent);
    }
  };

  // 시간 내림차순
  const sortedVersions = blueprints.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  setBlueprints(sortedVersions);

  // 블루프린트 생성 로직 추가
  const setModal = useSetRecoilState(modalState);
  const handleCreateBlueprint = () => {
    setModal({
      type: 'modal',
      title: '새 블루프린트',
      content: (
        <CreateBlueprintVersion
          setModal={setModal}
          projectId={projectId}
          blueprintId={blueprint_id}
          blueprints={blueprints}
          setBlueprints={setBlueprints}
          refetchBlueprints={refetchBlueprints}
        />
      ),
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="h-[40rem] w-[60rem] bg-white p-4 relative border">
        <div className="flex justify-between border mb-4">
          <div className="flex">
            <h2 className="text-left">{projectTitle}</h2>
            <p>|</p>
            <h2 className="text-left">
              {blueprints[blueprints.length - 1].blueprint_version_name}
            </h2>
          </div>
          <button onClick={closeModal}>
            <Icon name="IconCgClose" width={24} height={24} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="border flex relative">
            <div className="aspect-[4/3]">
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Icon
                  name="IconIoIosAddCircleOutline"
                  onClick={handleCreateBlueprint}
                />
              </div>
            </div>
            <div className="absolute bottom-0 left-0">새 블루프린트 업로드</div>
          </div>

          {blueprints.map((version) => (
            <div key={version.blueprint_version_id} className="p-2 border">
              {!imageLoaded && (
                <div className="flex flex-col space-y-3">
                  <Skeleton className="h-55 w-100" />
                </div>
              )}
              <div
                className="flex flex-col"
                onClick={() =>
                  handleViewBlueprint(version.blueprint_version_id)
                }
              >
                <img
                  src={version.preview_image}
                  alt={version.blueprint_version_name}
                  className="mb-2 aspect-[4/3]"
                  onLoad={() => setImageLoaded(true)}
                />
                <div className="flex justify-between">
                  <div>{version.blueprint_version_name}</div>
                  <div>{new Date(version.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlueprintVersions;
