import React, { useState } from 'react';
import { post } from '../../api';
import InviteUsers from './InviteUsers';

const CreateProject = ({ setModal }) => {
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

      const projectId = response.data.content.project_id;

      if (!projectId) {
        throw new Error('프로젝트 ID를 가져오지 못했습니다.');
      }
      console.log('프로젝트 생성 성공:', projectId);

      if (validEmails.length > 0) {
        const inviteEmailList = validEmails.map((emailObj) => emailObj.email);

        try {
          await post(`projects/${projectId}/users`, {
            invite_user_list: inviteEmailList,
          });

          console.log('초대한 이메일:', inviteEmailList);
          alert('사용자 초대 성공');
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
    <div className="p-4 w-150">
      <form onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className={`px-4 py-2 mt-2 text-white rounded ${
              projectTitle.trim()
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 cursor-not-allowed opacity-50'
            }`}
            disabled={!projectTitle.trim()}
          >
            완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
