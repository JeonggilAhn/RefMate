import React, { useState } from 'react';
import { post } from '../../api';
import InviteUsers from './InviteUsers'; // EmailInput은 이제 InviteUsers에 포함되므로 제거

const CreateProject = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    setIsSubmitting(true);

    try {
      const response = await post('projects', {
        project_title: projectTitle,
        // 이메일 전달?
      });
      console.log('프로젝트 생성 성공:', response.data);
    } catch (error) {
      console.error('프로젝트 생성 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border p-4">
      <div>새 프로젝트</div>
      <form onSubmit={handleSubmit}>
        <div>
          <div>이름</div>
          <label htmlFor="projectTitle">프로젝트 제목</label>
          <div className="border">
            <input
              type="text"
              id="projectTitle"
              value={projectTitle}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          {/* EmailInput을 제거하고 InviteUsers만 사용 */}
          <InviteUsers
            validEmails={validEmails}
            handleRemoveEmail={handleRemoveEmail}
            handleAddEmail={handleAddEmail} // AddEmail을 위한 handler 전달
          />
        </div>
        <div>
          <button type="submit" className="border" disabled={isSubmitting}>
            완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
