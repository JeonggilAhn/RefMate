import React, { useState, useEffect } from 'react';
import { get, del } from '../../api';
import Icon from '../common/Icon';
import TextButton from '../common/TextButton';
import UpdateProjectName from './UpdateProjectName';
import { useSetRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';
import { useNavigate } from 'react-router-dom';
import EditOption from './EditOption';
import CreateBlueprint from './CreateBlueprint';
import InviteUsersModal from './InviteUsersModal';

const BlueprintListSubHeader = ({ userId, projectId }) => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const setModal = useSetRecoilState(modalState);

  const handleCreateBlueprint = () => {
    setModal({
      type: 'modal',
      title: '새 블루프린트',
      content: <CreateBlueprint setModal={setModal} projectId={projectId} />,
    });
  };

  const handleToggleInvite = () => {
    setModal({
      type: 'modal',
      title: '프로젝트 초대하기',
      content: <InviteUsersModal setModal={setModal} />,
    });
  };

  useEffect(() => {
    const fetchProjectName = async () => {
      if (projectId) {
        try {
          const response = await get(`projects/${projectId}`);
          setProjectName(response.data.content.project_title);
          console.log(projectName);
        } catch (error) {
          console.error('프로젝트 이름을 가져오는데 실패했습니다.', error);
        }
      }
    };

    fetchProjectName();
  }, [userId, projectId]);

  const handleUpdateProjectName = (projectId, projectTitle) => {
    setModal({
      type: 'modal',
      title: '프로젝트 수정',
      content: (
        <UpdateProjectName
          projectId={projectId}
          projectTitle={projectTitle}
          setProjectName={setProjectName}
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

            navigate('/projects');
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
    <div className="flex justify-between items-center w-full px-5 py-2.5">
      <div className="flex items-center gap-4">
        <div className="text-xl font-semibold">{projectName}</div>
        <EditOption
          actions={[
            {
              name: '수정',
              handler: () => handleUpdateProjectName(projectId, projectName),
            },
            {
              name: '삭제',
              handler: () => handleRemoveProject(projectId),
            },
          ]}
        />
      </div>
      <div className="flex gap-4">
        <button onClick={handleToggleInvite}>
          <Icon name="IconTbShare" width={25} height={25}></Icon>
        </button>
        <TextButton onClick={handleCreateBlueprint}>
          새 블루프린트 만들기 +
        </TextButton>
      </div>
    </div>
  );
};

export default BlueprintListSubHeader;
