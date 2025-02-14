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
  projectId,
  blueprint_id,
  blueprints,
  setBlueprints,
  closeModal,
}) => {
  const [project, setProject] = useRecoilState(projectState);
  const { projectTitle } = project;
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
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
      onClick={() => closeModal()}
    >
      <div
        className="h-[40rem] w-[60rem] bg-white relative rounded-sm border border-[#CBCBCB]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between pt-3 px-3 pb-3 mb-4 border-b border-[#CBCBCB]">
          <div className="flex">
            {/* 프로젝트 타이틀을 달라고 해야할 것 같은데 .. */}
            {/* <h2 className="text-left">{projectTitle}</h2> 
            <p>|</p> */}
            <h2 className="text-left">
              {blueprints[blueprints.length - 1].blueprint_version_name}
            </h2>
          </div>
          <button onClick={closeModal}>
            <Icon name="IconCgClose" width={24} height={24} />
          </button>
        </div>

        <div className="h-[calc(100%-75px)] overflow-y-auto px-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex relative border border-[#CBCBCB] rounded-sm cursor-pointer hover:bg-[#F5F5F5]">
              <div className="aspect-[4/3]">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Icon
                    color="#7BA8EC"
                    name="IconIoIosAddCircleOutline"
                    width={50}
                    height={50}
                    onClick={handleCreateBlueprint}
                  />
                </div>
              </div>
              <div className="absolute bottom-18 left-20 text-[#414141] text-sm">
                새 블루프린트 업로드
              </div>
            </div>

            {blueprints.map((version) => (
              <div
                key={version.blueprint_version_id}
                className="p-2 border border-[#CBCBCB] rounded-sm cursor-pointer hover:bg-[#F5F5F5]"
              >
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
                    className="mb-2 aspect-[4/3] rounded-sm"
                    onLoad={() => setImageLoaded(true)}
                  />
                  <div className="flex justify-between items-center">
                    <div className="w-[200px] truncate">
                      {version.blueprint_version_name}
                    </div>
                    <div className="text-[#898989] text-sm">
                      {new Date(version.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintVersions;
