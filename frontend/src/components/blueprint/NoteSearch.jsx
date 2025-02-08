import React, { useState, useEffect } from 'react';
import { get } from '../../api';
import Icon from '../common/Icon';

function NoteSearch({ onSelect, onClose }) {
  const [keyword, setKeyword] = useState('');
  const [notes, setNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSearched, setIsSearched] = useState(false);

  // 노트 검색 함수
  const searchNotes = async () => {
    try {
      const response = await get(`notes/search?keyword=${keyword}`);
      const noteList = response.data.content[0].note_list || [];
      setNotes(noteList);
      setCurrentIndex(0);
      setIsSearched(true);

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
      // 목업 테스트
    } catch (error) {
      console.error('API 호출 오류:', error);
    }
  };

  useEffect(() => {
    // notes가 변경될 때마다 실행
    if (notes.length > 0) {
      console.log('노트가 변경됨:', notes);
      onSelect(notes[0].note_id); // 상태가 변경되면 onSelect 호출
    }
  }, [notes]);

  // 이전 노트로 이동
  const goToPreviousNote = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      console.log(notes[newIndex].note_id);
      onSelect(notes[newIndex].note_id); // 부모로 노트 ID 전달
    }
  };

  // 다음 노트로 이동
  const goToNextNote = () => {
    if (currentIndex < notes.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      console.log(notes[newIndex].note_id);
      onSelect(notes[newIndex].note_id); // 부모로 노트 ID 전달
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded w-85">
      <div className="flex items-center space-x-4 justify-between">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="search"
          className="w-35 focus:outline-none focus:ring-0 border-none"
        />

        <div className="flex gap-2">
          {isSearched && notes.length == 0 && (
            <div className="text-center text-gray-500">결과 없음</div>
          )}

          {notes.length > 0 && (
            <div className="text-center text-gray-500">
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
    </div>
  );
}

export default NoteSearch;
