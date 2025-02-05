import React, { useState } from 'react';
import { post } from '../../api';

const CreateProject = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    setProjectTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await post('projects', {
        project_title: projectTitle,
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
          <div>
            <div>초대 이메일</div>
            <div className="border">
              <input></input>
            </div>
          </div>
        </div>
        <div>
          <button type="submit" className="border">
            완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
