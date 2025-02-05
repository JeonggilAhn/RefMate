import React, { useState } from 'react';
import { post } from '../../api';

const CreateProject = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validEmails, setValidEmails] = useState([]); // 유효한 이메일을 저장하는 배열
  const [emailBorderColor, setEmailBorderColor] = useState(''); // 이메일 입력칸의 테두리 색

  const handleInputChange = (event) => {
    setProjectTitle(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleEmailValidation = () => {
    // 이메일 유효성 검사
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isValid = emailPattern.test(email);

    // 이메일 유효성 검사 후 상태 변경
    setEmailBorderColor(isValid ? 'blue' : 'red'); // 유효한 이메일일 경우 파란색 테두리, 아니면 빨간색

    // 이메일을 배열에 추가 (유효성 검사와 관계없이)
    setValidEmails((prevEmails) => [...prevEmails, { email, isValid }]);

    setEmail(''); // 이메일 입력칸을 비움
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

  const handleEmailKeyDown = (event) => {
    // 엔터키를 눌렀을 때 이메일 유효성 검사 실행
    if (event.key === 'Enter') {
      event.preventDefault(); // 기본 엔터키 동작 방지
      handleEmailValidation();
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    // 이메일 삭제
    setValidEmails((prevEmails) =>
      prevEmails.filter((emailObj) => emailObj.email !== emailToRemove),
    );
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
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onKeyDown={handleEmailKeyDown} // 엔터 키 이벤트
                disabled={isSubmitting}
                style={{
                  borderColor: emailBorderColor, // 유효성 검사에 따라 테두리 색상 적용
                }}
              />
            </div>
          </div>
          <div>
            <ul>
              {validEmails.map(({ email, isValid }, index) => (
                <li
                  key={index}
                  className="border"
                  style={{ borderColor: isValid ? 'blue' : 'red' }}
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)} // X 버튼 클릭 시 이메일 삭제
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'red',
                      marginLeft: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
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
