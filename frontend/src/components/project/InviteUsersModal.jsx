import React, { useState } from 'react';
import { post } from '../../api';
import InviteUsers from './InviteUsers';

const InviteUsersModal = ({ setModal }) => {
  const [validEmails, setValidEmails] = useState([]); // 유효한 이메일을 저장하는 배열

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

    // 모든 이메일을 문자열 배열로 변환
    const inviteEmailList = validEmails.map((emailObj) => emailObj.email);

    if (inviteEmailList.length === 0) {
      alert('초대할 이메일을 입력해주세요.');
      return;
    }

    try {
      const response = await post('projects/{project_id}/users', {
        invite_user_list: inviteEmailList, // 모든 이메일 포함
      });

      console.log('초대한 이메일:', inviteEmailList);
      alert('사용자 초대 성공');
      setModal(null);
    } catch (error) {
      console.error('사용자 초대 성공 실패:', error);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <InviteUsers
          validEmails={validEmails}
          handleRemoveEmail={handleRemoveEmail}
          handleAddEmail={handleAddEmail}
        />
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

export default InviteUsersModal;
