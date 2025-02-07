import React, { useState } from 'react';
import { post } from '../../api';
import InviteUsers from './InviteUsers';

const CreateProject = ({ setModal }) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [validEmails, setValidEmails] = useState([]); // 유효한 이메일을 저장하는 배열

  const handleInputChange = (event) => {
    setProjectTitle(event.target.value);
  };

  const handleAddEmail = (email, isValid) => {
    // 이메일을 배열에 추가 (유효성 검사와 관계없이)
    setValidEmails((prevEmails) => [...prevEmails, { email, isValid }]);
  };

  const handleRemoveEmail = (emailToRemove) => {
    // 이메일 삭제
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

      setModal(null);
    } catch (error) {
      console.error('프로젝트 생성 실패:', error);
      alert('프로젝트 생성 중 오류 발생');
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="projectTitle">이름</label>
          <div className="border">
            <input
              type="text"
              id="projectTitle"
              value={projectTitle}
              onChange={handleInputChange}
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
            className="px-4 py-2 mt-2 bg-blue-500 text-white rounded"
          >
            완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
