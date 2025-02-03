import React from 'react';
import styled from 'styled-components';

const NoteReaders = ({ read_users }) => {
  return (
    <div className="absolute">
      <div className="flex flex-col gap-2 border bg-white text-xs">
        {read_users.map((user) => (
          <div key={user.user_id} className="flex items-center gap-2">
            <ProfileImage
              src={user.profile_url}
              alt={user.user_email}
              className="w-8 h-8"
            />
            <div className="flex flex-col text-xs">
              <div>{user.user_email.split('@')[0]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteReaders;

const ProfileImage = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  flex-shrink: 0;
`;
