import React, { useState } from 'react';
import { post } from '../../api';
import InviteUsers from './InviteUsers';
import TextButton from '../common/TextButton';
import { useRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';

const CreateProject = ({ setProjects }) => {
  const [modal, setModal] = useRecoilState(modalState);
  const [projectTitle, setProjectTitle] = useState('');
  const [validEmails, setValidEmails] = useState([]);

  const handleInputChange = (event) => {
    setProjectTitle(event.target.value);
  };

  const handleAddEmail = (email, isValid) => {
    setValidEmails((prevEmails) => [...prevEmails, { email, isValid }]);
  };

  const handleRemoveEmail = (emailToRemove) => {
    setValidEmails((prevEmails) =>
      prevEmails.filter((emailObj) => emailObj.email !== emailToRemove),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await post('projects', {
        project_title: projectTitle,
      });

      const project = response.data.content.project;
      const projectId = project.project_id;

      if (!projectId) {
        throw new Error('프로젝트 ID를 가져오지 못했습니다.');
      }

      const newProject = {
        project_id: project.project_id,
        project_title: project.project_title,
        created_at: new Date(),
        preview_images: [],
        is_mine: true,
        blueprints_count: 0,
      };

      setProjects((prevProjects) => [
        ...prevProjects,
        { ...newProject, project_id: Number(projectId) },
      ]);
      console.log('프로젝트 생성 성공:', projectId);

      if (validEmails.length > 0) {
        const inviteEmailList = validEmails.map((emailObj) => emailObj.email);

        try {
          await post(`projects/${projectId}/users`, {
            invite_user_list: inviteEmailList,
          });

          console.log('초대한 이메일:', inviteEmailList);
        } catch (inviteError) {
          console.error('사용자 초대 실패:', inviteError);
          alert('사용자 초대 중 오류 발생');
        }
      }

      alert('생성 완료');
      setModal(null);
    } catch (error) {
      console.error('프로젝트 생성 실패:', error);
      alert('프로젝트 생성 중 오류 발생');
    }
  };

  return (
    <div className="p-4 w-full">
      <form>
        <div>
          <div className="mb-2">
            <label htmlFor="projectTitle">이름</label>
          </div>
          <div className="border border-gray-200 mb-8 rounded-md p-2 flex flex-wrap gap-2 min-h-[40px] items-center">
            <input
              type="text"
              id="projectTitle"
              value={projectTitle}
              onChange={handleInputChange}
              placeholder="프로젝트 이름을 입력하세요."
              className="w-auto flex-grow border-none focus:ring-0 outline-none text-sm p-1"
            />
          </div>
          <InviteUsers
            validEmails={validEmails}
            handleRemoveEmail={handleRemoveEmail}
            handleAddEmail={handleAddEmail}
          />
        </div>
        <div className="flex justify-end">
          <TextButton
            type="submit"
            disabled={!projectTitle.trim()}
            onClick={handleSubmit}
          >
            완료
          </TextButton>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
