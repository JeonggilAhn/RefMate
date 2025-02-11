import React, { useState, useEffect } from 'react';
import { get } from '../../api';
import Icon from '../common/Icon';

function NoteSearch({ onSelect, onClose }) {
  const [keyword, setKeyword] = useState('');
  const [notes, setNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 노트 검색 함수
  const searchNotes = async () => {
    try {
      const response = await get(`notes/search?keyword=${keyword}`);
      setNotes(response.data.content.note_list); // 응답에서 노트 리스트 가져오기

      // 목업 테스트
      const mockNotes = [
        {
          note_id: 5845445,
          note_writer: {
            user_id: 8937565865589817,
            user_email: 'Olin.Paucek@yahoo.com',
            profile_url: 'https://avatars.githubusercontent.com/u/617429',
            signup_date: '2025-02-07T08:01:26.458Z',
            role: 'nisi mollit quis sit',
          },
          note_title: 'puzzled hmph blond except disposer quash than',
          created_at: '2025-02-06T20:42:30.148Z',
          is_editable: false,
          is_present_image: true,
          read_users: [
            {
              user_id: 4569878562513893,
              user_email: 'Antonio63@yahoo.com',
              profile_url: 'https://avatars.githubusercontent.com/u/4951571',
              signup_date: '2025-02-07T08:01:26.459Z',
              role: 'in sit',
            },
          ],
        },
        {
          note_id: -74623705,
          note_writer: {
            user_id: 6202887093682253,
            user_email: 'Amara91@gmail.com',
            profile_url: 'https://avatars.githubusercontent.com/u/76738418',
            signup_date: '2025-02-07T08:01:26.468Z',
            role: 'proident enim fugiat',
          },
          note_title: 'mmm obnoxiously twin brr case',
          created_at: '2025-02-07T02:51:01.877Z',
          is_editable: true,
          is_present_image: true,
          read_users: [
            {
              user_id: 5152745109732729,
              user_email: 'Justyn.Padberg@hotmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/73429758',
              signup_date: '2025-02-07T08:01:26.469Z',
              role: 'aliqua velit amet enim',
            },
            {
              user_id: 6441004563989400,
              user_email: 'Bernadine11@hotmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/79590346',
              signup_date: '2025-02-07T08:01:26.470Z',
              role: 'tempor',
            },
          ],
        },
        {
          note_id: -746237051,
          note_writer: {
            user_id: 6202887093682253,
            user_email: 'Amara91@gmail.com',
            profile_url: 'https://avatars.githubusercontent.com/u/76738418',
            signup_date: '2025-02-07T08:01:26.468Z',
            role: 'proident enim fugiat',
          },
          note_title: 'mmm obnoxiously twin brr case',
          created_at: '2025-02-07T02:51:01.877Z',
          is_editable: true,
          is_present_image: true,
          read_users: [
            {
              user_id: 5152745109732729,
              user_email: 'Justyn.Padberg@hotmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/73429758',
              signup_date: '2025-02-07T08:01:26.469Z',
              role: 'aliqua velit amet enim',
            },
            {
              user_id: 6441004563989400,
              user_email: 'Bernadine11@hotmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/79590346',
              signup_date: '2025-02-07T08:01:26.470Z',
              role: 'tempor',
            },
          ],
        },
        {
          note_id: -746237052,
          note_writer: {
            user_id: 6202887093682253,
            user_email: 'Amara91@gmail.com',
            profile_url: 'https://avatars.githubusercontent.com/u/76738418',
            signup_date: '2025-02-07T08:01:26.468Z',
            role: 'proident enim fugiat',
          },
          note_title: 'mmm obnoxiously twin brr case',
          created_at: '2025-02-07T02:51:01.877Z',
          is_editable: true,
          is_present_image: true,
          read_users: [
            {
              user_id: 5152745109732729,
              user_email: 'Justyn.Padberg@hotmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/73429758',
              signup_date: '2025-02-07T08:01:26.469Z',
              role: 'aliqua velit amet enim',
            },
            {
              user_id: 6441004563989400,
              user_email: 'Bernadine11@hotmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/79590346',
              signup_date: '2025-02-07T08:01:26.470Z',
              role: 'tempor',
            },
          ],
        },
        {
          note_id: -746237053,
          note_writer: {
            user_id: 6202887093682253,
            user_email: 'Amara91@gmail.com',
            profile_url: 'https://avatars.githubusercontent.com/u/76738418',
            signup_date: '2025-02-07T08:01:26.468Z',
            role: 'proident enim fugiat',
          },
          note_title: 'mmm obnoxiously twin brr case',
          created_at: '2025-02-07T02:51:01.877Z',
          is_editable: true,
          is_present_image: true,
          read_users: [
            {
              user_id: 5152745109732729,
              user_email: 'Justyn.Padberg@hotmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/73429758',
              signup_date: '2025-02-07T08:01:26.469Z',
              role: 'aliqua velit amet enim',
            },
            {
              user_id: 6441004563989400,
              user_email: 'Bernadine11@hotmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/79590346',
              signup_date: '2025-02-07T08:01:26.470Z',
              role: 'tempor',
            },
          ],
        },
        {
          note_id: -1746237053,
          note_writer: {
            user_id: 6202887093682253,
            user_email: 'Amara91@gmail.com',
            profile_url: 'https://avatars.githubusercontent.com/u/76738418',
            signup_date: '2025-02-07T08:01:26.468Z',
            role: 'proident enim fugiat',
          },
          note_title: 'mmm obnoxiously twin brr case',
          created_at: '2025-02-07T02:51:01.877Z',
          is_editable: true,
          is_present_image: true,
          read_users: [
            {
              user_id: 5152745109732729,
              user_email: 'Justyn.Padberg@hotmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/73429758',
              signup_date: '2025-02-07T08:01:26.469Z',
              role: 'aliqua velit amet enim',
            },
            {
              user_id: 6441004563989400,
              user_email: 'Bernadine11@hotmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/79590346',
              signup_date: '2025-02-07T08:01:26.470Z',
              role: 'tempor',
            },
          ],
        },
        {
          note_id: -7462237053,
          note_writer: {
            user_id: 6202887093682253,
            user_email: 'Amara91@gmail.com',
            profile_url: 'https://avatars.githubusercontent.com/u/76738418',
            signup_date: '2025-02-07T08:01:26.468Z',
            role: 'proident enim fugiat',
          },
          note_title: 'mmm obnoxiously twin brr case',
          created_at: '2025-02-07T02:51:01.877Z',
          is_editable: true,
          is_present_image: true,
          read_users: [
            {
              user_id: 5152745109732729,
              user_email: 'Justyn.Padberg@hotmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/73429758',
              signup_date: '2025-02-07T08:01:26.469Z',
              role: 'aliqua velit amet enim',
            },
            {
              user_id: 6441004563989400,
              user_email: 'Bernadine11@hotmail.com',
              profile_url: 'https://avatars.githubusercontent.com/u/79590346',
              signup_date: '2025-02-07T08:01:26.470Z',
              role: 'tempor',
            },
          ],
        },
      ];

      setNotes(mockNotes); // 응답에서 노트 리스트 가져오기
      setCurrentIndex(0); // 검색 후 첫 번째 노트로 초기화

      onSelect(notes); // 검색된 노트를 부모로 전달
    } catch (error) {
      console.error('API 호출 오류:', error);
    }
  };

  // 이전 노트로 이동
  const goToPreviousNote = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 다음 노트로 이동
  const goToNextNote = () => {
    if (currentIndex < notes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // 검색된 노트로 이동 및 하이라이팅
  useEffect(() => {
    if (notes.length > 0) {
      // 이전에 하이라이팅된 노트 제거
      const previousNoteElement = document.getElementById(
        notes[currentIndex - 1]?.note_id,
      );
      if (previousNoteElement) {
        previousNoteElement.classList.remove('bg-yellow-200');
      }

      // 현재 선택된 노트 하이라이팅
      const targetNote = notes[currentIndex];
      const noteElement = document.getElementById(targetNote.note_id);
      if (noteElement) {
        noteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        noteElement.classList.add('bg-yellow-200');
      }
    }
  }, [currentIndex, notes]);

  return (
    <div className="p-4 border">
      <div className="flex items-center space-x-4 justify-between">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="키워드"
          className="border w-30"
        />

        <div className="flex gap-2">
          {notes.length > 0 && (
            <div className="text-center">
              {currentIndex + 1} / {notes.length}
            </div>
          )}

          {notes.length > 0 && (
            <>
              <button onClick={goToPreviousNote} disabled={currentIndex === 0}>
                <Icon
                  name="IconGoChevronPrev"
                  width={20}
                  height={20}
                  color={currentIndex === 0 ? '#ccc' : '#000'}
                />
              </button>
              <button
                onClick={goToNextNote}
                disabled={currentIndex === notes.length - 1}
              >
                <Icon
                  name="IconGoChevronNext"
                  width={20}
                  height={20}
                  color={currentIndex === notes.length - 1 ? '#ccc' : '#000'}
                />
              </button>
            </>
          )}
          <button onClick={onClose}>
            <Icon name="IconCgClose" width={20} height={20} />
          </button>
          <button onClick={searchNotes}>
            <Icon name="IconTbSearch" width={20} height={20} />
          </button>
        </div>
      </div>
      {/* {notes.length > 0 && (
        <div className="border p-4">
          <h3>{notes[currentIndex].note_title}</h3>
          <p>{notes[currentIndex].note_writer.user_email}</p>
          <p>{new Date(notes[currentIndex].created_at).toLocaleDateString()}</p>
        </div>
      )} */}
    </div>
  );
}

export default NoteSearch;
