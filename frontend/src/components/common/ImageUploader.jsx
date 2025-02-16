import React, { useState, useRef, useEffect } from 'react';
import { post } from '../../api';
import Icon from '../common/Icon';

const ImageUploader = ({ onImageSelect, projectId, type = 'blueprint' }) => {
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState(null);
  const [fileNames, setFileNames] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [contextMenuIndex, setContextMenuIndex] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({});

  const imagesPerPage = 3;
  const totalPages = Math.ceil(previewUrls.length / imagesPerPage);

  const getCurrentPageImages = () => {
    const start = currentPage * imagesPerPage;
    const end = start + imagesPerPage;
    const currentImages = previewUrls.slice(start, end);

    // 3개가 되도록 빈 항목 추가
    while (currentImages.length < imagesPerPage) {
      currentImages.push(null);
    }
    return currentImages;
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);

    // blueprint 타입인 경우 한 개의 파일만 허용
    if (type === 'blueprint' && files.length > 1) {
      setError('블루프린트는 한 개의 파일만 업로드할 수 있습니다.');
      return;
    }

    const validFiles = files.filter((file) => {
      const fileType = file.type.toLowerCase();
      const fileExtension = file.name.split('.').pop().toLowerCase();

      // note 타입인 경우 이미지만 허용
      if (type === 'note') {
        return fileType.startsWith('image/');
      }

      // blueprint 타입인 경우 이미지, PDF, DWG 허용
      return (
        fileType.startsWith('image/') ||
        fileExtension === 'pdf' ||
        fileExtension === 'dwg'
      );
    });

    if (validFiles.length !== files.length) {
      setError(
        type === 'blueprint'
          ? '지원되지 않는 파일이 포함되어 있습니다. (이미지, PDF, DWG 파일만 가능)'
          : '지원되지 않는 파일이 포함되어 있습니다. (이미지 파일만 가능)',
      );
      return;
    }

    setError(null);

    // note 타입일 경우 기존 파일 이름에 새 파일 이름 추가
    if (type === 'note') {
      setFileNames([...fileNames, ...validFiles.map((file) => file.name)]);
    } else {
      setFileNames(validFiles.map((file) => file.name));
    }

    try {
      // 이미지 파일의 크기 정보 가져오기
      const filesWithDimensions = await Promise.all(
        validFiles.map(async (file) => {
          if (file.type.startsWith('image/')) {
            return new Promise((resolve) => {
              const img = new Image();
              img.onload = () => {
                resolve({
                  file,
                  width: img.width,
                  height: img.height,
                });
              };
              img.src = URL.createObjectURL(file);
            });
          }
          return { file, width: 0, height: 0 };
        }),
      );

      // PreSign URL 요청을 위한 파일 정보 준비
      const filesInfo = filesWithDimensions.map(({ file, width, height }) => {
        // DWG 파일인 경우 application/acad MIME 타입 설정
        const fileType = file.name.toLowerCase().endsWith('.dwg')
          ? 'application/acad'
          : file.type.toLowerCase();

        return {
          file_name: file.name,
          file_type: fileType,
          file_size: file.size,
          file_x: width,
          file_y: height,
        };
      });

      console.log(filesInfo);

      const response = await post('uploads/pre-signed-url', {
        project_id: projectId,
        files: filesInfo,
      });

      const uploadedFiles = response.data.content.files;
      console.log(uploadedFiles);

      // 이미지 미리보기 설정 (즉시)
      const newPreviewUrls = await Promise.all(
        validFiles.map((file) =>
          file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        ),
      );

      if (type === 'note') {
        const startIndex = previewUrls.length;
        setPreviewUrls([...previewUrls, ...newPreviewUrls]);

        // 각 파일 개별적으로 업로드 시도
        const results = await Promise.allSettled(
          uploadedFiles.map(async (fileInfo, index) => {
            try {
              await fetch(fileInfo.presigned_url, {
                method: 'PUT',
                body: validFiles[index],
                headers: {
                  'Content-Type': validFiles[index].type,
                },
              });
              return {
                index: startIndex + index,
                status: 'success',
                url: fileInfo.public_url,
              };
            } catch (error) {
              return { index: startIndex + index, status: 'error' };
            }
          }),
        );

        // 업로드 상태 업데이트
        const newUploadStatus = { ...uploadStatus };
        const successUrls = [];

        results.forEach((result) => {
          if (result.value) {
            newUploadStatus[result.value.index] = result.value.status;
            if (result.value.status === 'success') {
              successUrls.push(result.value.url);
            }
          }
        });

        setUploadStatus(newUploadStatus);
        onImageSelect([...previewUrls, ...successUrls]);
      } else {
        setPreviewUrls(newPreviewUrls);
        await fetch(uploadedFiles[0].presigned_url, {
          method: 'PUT',
          body: validFiles[0],
          headers: {
            'Content-Type': filesInfo[0].file_type,
          },
        });
        onImageSelect(uploadedFiles[0].public_url);
      }
    } catch (error) {
      setError('파일 업로드에 실패했습니다.');
      console.error('Upload error:', error);
    }
  };

  const handleContextMenu = (e, index) => {
    e.preventDefault();
    setContextMenuIndex(index);
  };

  const handleRemoveImage = (index) => {
    const realIndex = currentPage * imagesPerPage + index;
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(realIndex, 1);
    setPreviewUrls(newPreviewUrls);
    setContextMenuIndex(null);

    // 파일 이름도 함께 삭제
    const newFileNames = [...fileNames];
    newFileNames.splice(realIndex, 1);
    setFileNames(newFileNames);

    // 현재 페이지의 모든 이미지가 삭제되고, 이전 페이지가 존재하면 이전 페이지로 이동
    const newTotalPages = Math.ceil(newPreviewUrls.length / imagesPerPage);
    if (currentPage >= newTotalPages && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }

    // 부모 컴포넌트에 변경된 URL 목록 전달
    const publicUrls = newPreviewUrls.filter((url) => url); // null 값 제거
    onImageSelect(type === 'blueprint' ? publicUrls[0] : publicUrls);
    console.log(publicUrls[0]);
  };

  // 컨텍스트 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = () => setContextMenuIndex(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div>
      {type === 'blueprint' ? (
        <>
          <div className="mb-2">업로드</div>
          <label className="cursor-pointer block">
            <div className="border border-gray-200 rounded-md mb-2 p-2 bg-blue-100 text-center hover:bg-blue-200 transition-colors">
              {fileNames.length > 0 ? '파일 변경' : '블루프린트 선택'}
            </div>
            <input
              type="file"
              accept={type === 'blueprint' ? 'image/*,.pdf,.dwg' : 'image/*'}
              onChange={handleFileChange}
              className="hidden"
              multiple={type === 'note'}
            />
          </label>
        </>
      ) : (
        <>
          {previewUrls.length > 0 && (
            <div className="mb-4 relative group min-h-[5rem]">
              {previewUrls.length > 3 && (
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-1 pointer-events-none">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className={`pointer-events-auto p-1.5 rounded-full bg-black/70 hover:bg-black/80 text-white shadow-lg backdrop-blur-sm border border-white/20 
                      ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon name="IconTbChevronLeft" width={20} height={20} />
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages - 1}
                    className={`pointer-events-auto p-1.5 rounded-full bg-black/70 hover:bg-black/80 text-white shadow-lg backdrop-blur-sm border border-white/20
                      ${currentPage >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon name="IconTbChevronRight" width={20} height={20} />
                  </button>
                </div>
              )}
              <div className="flex justify-center gap-2">
                {getCurrentPageImages().map((url, index) => {
                  const realIndex = currentPage * imagesPerPage + index;
                  return (
                    <div
                      key={index}
                      className={
                        url
                          ? 'relative flex-none w-20 h-20 border border-gray-200 rounded-md overflow-hidden shadow-sm'
                          : 'flex-none w-20'
                      }
                    >
                      {url && (
                        <>
                          <img
                            src={url}
                            alt={`미리보기 ${index + 1}`}
                            className={`w-full h-full object-cover ${uploadStatus[realIndex] === 'error' ? 'opacity-50' : ''}`}
                            onContextMenu={(e) => handleContextMenu(e, index)}
                          />
                          {uploadStatus[realIndex] === 'error' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <div className="text-white text-xs bg-red-500 px-2 py-1 rounded">
                                업로드 실패
                              </div>
                            </div>
                          )}
                          {contextMenuIndex === index && (
                            <div
                              className="absolute right-0 top-0 bg-white shadow-lg rounded-md py-1 z-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="w-full px-4 py-1 text-sm text-red-600 hover:bg-gray-100 text-left"
                                onClick={() => handleRemoveImage(index)}
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="inline-block bg-[#ffffff]">
            <label className="cursor-pointer">
              <span className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50">
                <Icon name="IconTbPhoto" width={20} height={20} />
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
            </label>
          </div>
        </>
      )}

      {type === 'blueprint' && (
        <>
          {fileNames.length > 0 && (
            <div className="mb-2 text-center">
              {fileNames.map((name, index) => (
                <p key={index} className="text-gray-600">
                  {name}
                </p>
              ))}
            </div>
          )}

          <div className="mb-2 grid grid-cols-2 gap-2">
            {previewUrls.map(
              (url, index) =>
                url && (
                  <div key={index}>
                    <img
                      src={url}
                      alt={`미리보기 ${index + 1}`}
                      className="max-w-full h-auto rounded-md"
                    />
                  </div>
                ),
            )}
          </div>

          {!error && (
            <div className="text-center text-sm text-gray-600">
              이미지, PDF, DWG 파일을 업로드할 수 있습니다.
            </div>
          )}
        </>
      )}

      {error && <div className="text-red-500 text-center text-sm">{error}</div>}
    </div>
  );
};

export default ImageUploader;
