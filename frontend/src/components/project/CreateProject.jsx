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
        // 이메일 전달?
      });
      console.log('프로젝트 생성 성공:', response.data);
      alert('생성 완료');
      setModal(null);
    } catch (error) {
      console.error('프로젝트 생성 실패:', error);
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
