import React from 'react';
import EmailInput from './EmailInput';

const InviteUsers = ({ validEmails, handleRemoveEmail, handleAddEmail }) => {
  return (
    <div>
      <div className="mt-2 mb-4 text-md text-gray-700">초대 이메일</div>

      {/* 이메일 태그 영역 */}
      <div className="border border-gray-200 mb-4 rounded-md p-2 flex flex-wrap gap-2 min-h-[40px] items-center">
        {validEmails.map(({ email, isValid }, index) => (
          <span
            key={index}
            className={`px-2 py-1 rounded-lg flex items-center gap-1 text-sm ${
              isValid ? 'bg-blue-200 text-blue-800' : 'bg-red-200 text-red-800'
            }`}
          >
            {email}
            <button
              type="button"
              onClick={() => handleRemoveEmail(email)}
              className="text-red-600 font-bold text-xs"
            >
              ✖
            </button>
          </span>
        ))}

        {/* 이메일 입력창 */}
        <EmailInput onAddEmail={handleAddEmail} />
      </div>
    </div>
  );
};

export default InviteUsers;
