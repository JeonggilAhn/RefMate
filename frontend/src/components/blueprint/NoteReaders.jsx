import React from 'react';
import styled from 'styled-components';

const NoteReaders = ({ read_users }) => {
  return (
    <div className="absolute left-70">
      <div className="flex flex-col gap-2 border border-gray-300 bg-white text-sm rounded-md shadow p-2 w-40">
        {read_users.map((user) => (
          <div key={user.user_id} className="flex items-center gap-2">
            <ProfileImage src={user.profile_url} alt={user.user_email} />
            <div className="text-sm font-medium truncate max-w-[100px]">
              {user.user_email.split('@')[0]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteReaders;

const ProfileImage = styled.img`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  flex-shrink: 0;
`;
