import React from 'react';

const InviteUsers = ({ validEmails, handleRemoveEmail }) => {
  return (
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
  );
};

export default InviteUsers;
