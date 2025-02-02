import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NoteButton = ({ noteId }) => {
  const [noteData, setNoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (noteId) {
      axios
        .get(`${API_BASE_URL}/api/notes/${noteId}`)
        .then((response) => {
          setNoteData(response.data.content.note);
        })
        .catch((error) => {
          console.error('Error fetching note details:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [noteId, API_BASE_URL]);

  const formatCreatedAt = (time) => {
    const now = new Date();
    const created = new Date(time);
    const diffMs = now - created;

    if (diffMs < 3600000) {
      return `${Math.floor(diffMs / 60000)}분 전`;
    } else if (diffMs < 86400000) {
      return `${Math.floor(diffMs / 3600000)}시간 전`;
    } else {
      return `${Math.floor(diffMs / 86400000)}일 전`;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!noteData) return <div>노트를 찾을 수 없습니다.</div>;

  const {
    note_writer: { profile_url, user_email },
    note_title,
    created_at,
    is_present_image,
  } = noteData;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.625rem',
        border: '0.0625rem solid #ccc',
        borderRadius: '0.25rem',
        marginBottom: '0.5rem',
        cursor: 'pointer',
      }}
    >
      {profile_url && (
        <img
          src={profile_url}
          alt="프로필"
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            marginRight: '0.625rem',
          }}
        />
      )}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '0.875rem',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          {`핀 이름: ${noteData.pin_name || '알 수 없음'}`}
        </div>
        <div
          style={{
            fontSize: '0.875rem',
            color: '#666',
            margin: '0.25rem 0',
          }}
        >
          {note_title}
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#999',
          }}
        >
          {user_email.split('@')[0]}
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#999',
          }}
        >
          {formatCreatedAt(created_at)}
        </div>
      </div>
      {is_present_image && (
        <div
          style={{
            marginLeft: 'auto',
            fontSize: '1.5rem',
            color: '#666',
          }}
        >
          📷
        </div>
      )}
    </div>
  );
};

export default NoteButton;
