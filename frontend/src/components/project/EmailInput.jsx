import React, { useState } from 'react';

const EmailInput = ({ onAddEmail, onRemoveEmail }) => {
  const [email, setEmail] = useState('');
  const [emailBorderColor, setEmailBorderColor] = useState(''); // 이메일 입력칸의 테두리 색

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleEmailValidation = () => {
    // 이메일 유효성 검사
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isValid = emailPattern.test(email);

    setEmailBorderColor(isValid ? 'blue' : 'red'); // 유효한 이메일일 경우 파란색 테두리, 아니면 빨간색

    // 이메일을 유효성 검사 후 부모 컴포넌트로 전달
    onAddEmail(email, isValid);

    setEmail(''); // 이메일 입력칸을 비움
  };

  const handleEmailKeyDown = (event) => {
    // 엔터키를 눌렀을 때 이메일 유효성 검사 실행
    if (event.key === 'Enter') {
      event.preventDefault(); // 기본 엔터키 동작 방지
      handleEmailValidation();
    }
  };

  return (
    <div>
      <div>초대 이메일</div>
      <div className="border">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          onKeyDown={handleEmailKeyDown} // 엔터 키 이벤트
          style={{
            borderColor: emailBorderColor, // 유효성 검사에 따라 테두리 색상 적용
          }}
        />
      </div>
    </div>
  );
};

export default EmailInput;
