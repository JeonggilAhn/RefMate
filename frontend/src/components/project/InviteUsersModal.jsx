import React, { useState } from 'react';
import { post } from '../../api';
import InviteUsers from './InviteUsers';

const InviteUsersModal = ({ setModal, projectId }) => {
  const [validEmails, setValidEmails] = useState([]); // 이메일 리스트 관리

  const handleAddEmail = (email, isValid) => {
    setValidEmails((prevEmails) => {
      // 중복 이메일 체크
      if (prevEmails.some((emailObj) => emailObj.email === email)) {
        alert('이미 추가된 이메일입니다.');
        return prevEmails;
      }
      return [...prevEmails, { email, isValid }];
    });
  };

  const handleRemoveEmail = (emailToRemove) => {
    setValidEmails((prevEmails) =>
      prevEmails.filter((emailObj) => emailObj.email !== emailToRemove),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 유효한 이메일만 서버로 전송
    const inviteEmailList = validEmails
      .filter((emailObj) => emailObj.isValid) // 유효한 이메일만 필터링
      .map((emailObj) => emailObj.email);

    if (inviteEmailList.length === 0) {
      alert('유효한 이메일을 입력해주세요.');
      return;
    }

    try {
      const response = await post(`projects/${projectId}/users`, {
        invite_user_list: inviteEmailList,
      });

      console.log('초대한 이메일:', inviteEmailList);
      alert('사용자 초대 성공');
      setModal(null);
    } catch (error) {
      console.error('사용자 초대 실패:', error);
      alert('사용자 초대 실패');
    }
  };

  return (
    <div className="p-4 w-150">
      <form onSubmit={handleSubmit}>
        <InviteUsers
          validEmails={validEmails}
          handleRemoveEmail={handleRemoveEmail}
          handleAddEmail={handleAddEmail}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            // className="px-4 py-2 mt-2 bg-blue-500 text-white rounded"
            className={`px-4 py-2 mt-2 text-white rounded ${
              validEmails.length > 0
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 cursor-not-allowed opacity-50'
            }`}
            disabled={validEmails.length === 0}
          >
            완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default InviteUsersModal;
