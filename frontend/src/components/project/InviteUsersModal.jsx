import React, { useState } from 'react';
import { post } from '../../api';
import InviteUsers from './InviteUsers';
import TextButton from '../common/TextButton';
import { useRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';
import { useToast } from '@/hooks/use-toast';

const InviteUsersModal = ({ projectId }) => {
  const [modal, setModal] = useRecoilState(modalState);
  const [validEmails, setValidEmails] = useState([]); // 이메일 리스트 관리
  const { toast } = useToast(20);

  const handleAddEmail = (email, isValid) => {
    setValidEmails((prevEmails) => {
      // 중복 이메일 체크
      if (prevEmails.some((emailObj) => emailObj.email === email)) {
        toast({
          title: '이미 추가된 이메일입니다.',
        });
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
      toast({
        title: '유효한 이메일을 입력해주세요.',
      });
      return;
    }

    try {
      const response = await post(`projects/${projectId}/users`, {
        invite_user_list: inviteEmailList,
      });

      console.log('초대한 이메일:', inviteEmailList);
      toast({
        title: '사용자 초대에 성공했습니다.',
        description: String(new Date()),
      });
      setModal(null);
    } catch (error) {
      console.error('사용자 초대 실패:', error);
      toast({
        title: '사용자 초대에 실패했습니다.',
        description: String(new Date()),
      });
    }
  };

  return (
    <div className="p-4 w-full">
      <form>
        <InviteUsers
          validEmails={validEmails}
          handleRemoveEmail={handleRemoveEmail}
          handleAddEmail={handleAddEmail}
        />
        <div className="flex justify-end">
          <TextButton
            type="submit"
            disabled={validEmails.length === 0}
            onClick={handleSubmit}
          >
            완료
          </TextButton>
        </div>
      </form>
    </div>
  );
};

export default InviteUsersModal;
