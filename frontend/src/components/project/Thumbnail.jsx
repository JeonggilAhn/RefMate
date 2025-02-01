import React, { useState } from 'react';
import styled from 'styled-components';
import { MdMoreHoriz } from 'react-icons/md';

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // 기본 날짜 형식 (yyyy/mm/dd)
};

const Thumbnail = ({ userId }) => {
  const [projects, setProjects] = useState(mockData); // 목업 데이터를 상태로 설정

  // 실제 API 호출 부분 (목업 데이터 대신 실제 API를 호출할 때는 이 부분을 사용)
  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       const response = await get(`/api/projects?userId=${userId}`);
  //       if (response?.content) {
  //         setProjects(response.content);
  //       }
  //     } catch (error) {
  //       console.error('프로젝트 목록을 불러오는데 실패했습니다.', error);
  //     }
  //   };
  //   fetchProjects();
  // }, [userId]);

  return (
    <Components>
      {projects.map((project) => (
        <ProjectCard key={project.project_id}>
          <ImageContainer>
            {project.preview_images.slice(0, 4).map((image, index) => (
              <ImageWrapper key={index}>
                <PreviewImage
                  src={image.preview_image}
                  alt={image.blueprint_title}
                />
                <BlueprintTitle>{image.blueprint_title}</BlueprintTitle>
                {/* 4번째 이미지 위에 + 표시 */}
                {index === 3 && project.preview_images.length > 4 && (
                  <MoreImages>+{project.preview_images.length - 4}</MoreImages>
                )}
              </ImageWrapper>
            ))}
            {/* 기본 이미지 채우기 (회색 상자) */}
            {project.preview_images.length < 4 &&
              Array.from({ length: 4 - project.preview_images.length }).map(
                (_, idx) => (
                  <ImageWrapper key={idx}>
                    <PlaceholderImage />
                  </ImageWrapper>
                ),
              )}
          </ImageContainer>
          <ProjectDetails>
            <ProjectFooter>
              <Title>{project.project_title}</Title>
              <EditIcon />
            </ProjectFooter>
            <FileInfoWrapper>
              <FileCount>{project.blueprints_count} blueprints ·</FileCount>
              <CreatedAt>{formatDate(project.created_at)}</CreatedAt>
            </FileInfoWrapper>
          </ProjectDetails>
        </ProjectCard>
      ))}
    </Components>
  );
};

export default Thumbnail;

const Components = styled.div`
  flex-grow: 1;
  width: 100%;
  overflow-y: auto; /* 스크롤 가능 */
  max-height: calc(100vh - 200px); /* Header, SubHeader, Tab을 제외한 영역 */
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 한 줄에 3개 */
  gap: 10px;
  padding: 20px;
  box-sizing: border-box;
`;

const ProjectCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(
    2,
    1fr
  ); /* 2개씩 배치, 총 4개의 칸에 배치할 예정 */
  gap: 10px;
  margin-bottom: 10px;
`;

const BlueprintTitle = styled.div`
  position: absolute;
  font-size: 10px;
  top: 0; /* 상단에 고정 */
  left: 0; /* 좌측에 고정 */
  width: 100%; /* 이미지 영역과 크기 맞추기 */
  height: 100%; /* 이미지 영역과 크기 맞추기 */
  display: flex;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center; /* 수평 중앙 정렬 */
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
  opacity: 0;
  transition: opacity 0.3s ease;
  box-sizing: border-box;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  transition: background-color 0.3s ease; /* 배경색 전환에 부드러운 효과 추가 */

  &:hover {
    background-color: rgba(0, 0, 0, 0.5); /* 이미지 호버 시 색을 어둡게 */
    border-radius: 4px;
    ${BlueprintTitle} {
      opacity: 1; /* 호버 시 제목 표시 */
    }
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

const PlaceholderImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(239, 239, 239);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.2rem;
  text-align: center;
  visibility: ${(props) =>
    props.isImageLoaded
      ? 'hidden'
      : 'visible'}; /* 이미지 로딩 상태에 따라 보이기/숨기기 */
`;

const MoreImages = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 4px;
  font-size: 10px;
  padding: 5px;
  position: absolute;
  top: 50%; /* 4번째 이미지의 중앙에 위치시킬 수 있도록 */
  left: 50%;
  transform: translate(-50%, -50%); /* 정확한 중앙 정렬 */
  width: 100%;
  height: 100%;
`;

const ProjectDetails = styled.div`
  width: 100%;
  text-align: center;
`;

const Title = styled.h3`
  font-size: 10px;
  margin-bottom: 5px;
`;

const ProjectFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
`;

const FileCount = styled.span`
  color: #888;
  font-size: 8px;
`;

const EditIcon = styled(MdMoreHoriz)`
  cursor: pointer;
  font-size: 10px;
  color: #888;
  &:hover {
    color: #7ba8ec;
  }
`;

const CreatedAt = styled.div`
  font-size: 8px;
  color: #888;
`;

const FileInfoWrapper = styled.div`
  display: flex;
  align-items: center; /* 세로 정렬 */
  justify-content: flex-start; /* 왼쪽 정렬 */
  gap: 2px; /* 두 요소 간 간격 */
`;

// 목업 데이터
const mockData = [
  {
    project_id: 31428656,
    project_title: 'nihil aspernatur officiis',
    created_at: '2025-01-26T20:49:47.599Z',
    preview_images: [
      {
        blueprint_title: 'doloremque voluptates quae',
        preview_image: 'https://loremflickr.com/640/480/animals',
      },
      {
        blueprint_title: 'consectetur adipisicing',
        preview_image: 'https://loremflickr.com/640/480/nature',
      },
      {
        blueprint_title: 'autem omnis',
        preview_image: 'https://loremflickr.com/640/480/technology',
      },
      {
        blueprint_title: 'exercitationem voluptas',
        preview_image: 'https://loremflickr.com/640/480/business',
      },
      {
        blueprint_title: 'exercitationem voluptas',
        preview_image: 'https://loremflickr.com/640/480/business',
      },
      {
        blueprint_title: 'exercitationem voluptas',
        preview_image: 'https://loremflickr.com/640/480/business',
      },
    ],
    is_mine: false,
    owner_id: 96168794,
    blueprints_count: 6,
  },
  {
    project_id: 31428657,
    project_title: 'voluptatem molestiae',
    created_at: '2025-01-27T15:34:22.112Z',
    preview_images: [
      {
        blueprint_title: 'impedit occaecati',
        preview_image: 'https://loremflickr.com/640/480/sports',
      },
      {
        blueprint_title: 'nobis fugiat',
        preview_image: 'https://loremflickr.com/640/480/city',
      },
    ],
    is_mine: true,
    owner_id: 96168795,
    blueprints_count: 2,
  },
  {
    project_id: 31428658,
    project_title: 'reprehenderit consequatur',
    created_at: '2025-01-28T09:42:16.105Z',
    preview_images: [
      {
        blueprint_title: 'exercitationem amet',
        preview_image: 'https://loremflickr.com/640/480/people',
      },
      {
        blueprint_title: 'reprehenderit rerum',
        preview_image: 'https://loremflickr.com/640/480/abstract',
      },
    ],
    is_mine: false,
    owner_id: 96168796,
    blueprints_count: 2,
  },
  {
    project_id: 31428659,
    project_title: 'et vero voluptatum',
    created_at: '2025-01-29T12:22:08.748Z',
    preview_images: [
      {
        blueprint_title: 'cupiditate similique',
        preview_image: 'https://loremflickr.com/640/480/nightlife',
      },
      {
        blueprint_title: 'dolorum officiis',
        preview_image: 'https://loremflickr.com/640/480/architecture',
      },
    ],
    is_mine: true,
    owner_id: 96168797,
    blueprints_count: 2,
  },
  {
    project_id: 31428660,
    project_title: 'dolores dignissimos',
    created_at: '2025-01-30T17:12:32.582Z',
    preview_images: [
      {
        blueprint_title: 'placeat pariatur',
        preview_image: 'https://loremflickr.com/640/480/transport',
      },
      {
        blueprint_title: 'ratione qui',
        preview_image: 'https://loremflickr.com/640/480/food',
      },
    ],
    is_mine: false,
    owner_id: 96168798,
    blueprints_count: 3,
  },
  {
    project_id: 31428661,
    project_title: 'nihil voluptas cumque',
    created_at: '2025-01-31T11:13:45.733Z',
    preview_images: [
      {
        blueprint_title: 'voluptatibus omnis',
        preview_image: 'https://loremflickr.com/640/480/people',
      },
      {
        blueprint_title: 'autem facilis',
        preview_image: 'https://loremflickr.com/640/480/city',
      },
    ],
    is_mine: true,
    owner_id: 96168799,
    blueprints_count: 2,
  },
  {
    project_id: 31428662,
    project_title: 'eos rerum voluptatum',
    created_at: '2025-02-01T08:22:54.123Z',
    preview_images: [
      {
        blueprint_title: 'velit molestiae',
        preview_image: 'https://loremflickr.com/640/480/nature',
      },
      {
        blueprint_title: 'nobis quia',
        preview_image: 'https://loremflickr.com/640/480/abstract',
      },
    ],
    is_mine: false,
    owner_id: 96168800,
    blueprints_count: 2,
  },
  {
    project_id: 31428663,
    project_title: 'autem eveniet minus',
    created_at: '2025-02-02T14:19:27.814Z',
    preview_images: [
      {
        blueprint_title: 'quae aperiam',
        preview_image: 'https://loremflickr.com/640/480/business',
      },
      {
        blueprint_title: 'ut rerum',
        preview_image: 'https://loremflickr.com/640/480/animals',
      },
    ],
    is_mine: true,
    owner_id: 96168801,
    blueprints_count: 2,
  },
  {
    project_id: 31428664,
    project_title: 'optio qui vero',
    created_at: '2025-02-03T10:39:56.667Z',
    preview_images: [
      {
        blueprint_title: 'qui debitis',
        preview_image: 'https://loremflickr.com/640/480/technology',
      },
      {
        blueprint_title: 'veritatis rem',
        preview_image: 'https://loremflickr.com/640/480/city',
      },
    ],
    is_mine: false,
    owner_id: 96168802,
    blueprints_count: 2,
  },
  {
    project_id: 31428665,
    project_title: 'excepteur voluptatibus',
    created_at: '2025-02-04T12:41:34.915Z',
    preview_images: [
      {
        blueprint_title: 'accusamus dolorum',
        preview_image: 'https://loremflickr.com/640/480/sports',
      },
      {
        blueprint_title: 'ut dolorem',
        preview_image: 'https://loremflickr.com/640/480/abstract',
      },
    ],
    is_mine: true,
    owner_id: 96168803,
    blueprints_count: 2,
  },
];
