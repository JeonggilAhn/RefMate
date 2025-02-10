import React, { useState } from 'react';

const EmailInput = ({ onAddEmail }) => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleEmailValidation = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isValid = emailPattern.test(email);

    onAddEmail(email, isValid);
    setEmail(''); // 입력창 초기화
  };

  const handleEmailKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleEmailValidation();
    }
  };

  return (
    <input
      type="email"
      value={email}
      onChange={handleEmailChange}
      onKeyDown={handleEmailKeyDown}
      placeholder="이메일을 입력하세요."
      className="flex-grow border-none focus:ring-0 outline-none text-sm p-1"
    />
  );
};

export default EmailInput;
