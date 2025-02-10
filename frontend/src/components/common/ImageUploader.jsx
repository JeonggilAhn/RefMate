import React, { useState } from 'react';
import { post } from '../../api';

const ImageUploader = ({ onImageSelect, projectId }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const fileType = file.type.toLowerCase();
      const fileExtension = file.name.split('.').pop().toLowerCase();

      // 허용된 파일 형식 검사
      if (
        fileType.startsWith('image/') ||
        fileExtension === 'pdf' ||
        fileExtension === 'dwg'
      ) {
        setError(null);
        setFileName(file.name);

        // PreSign URL 요청
        const response = await post('uploads/pre-signed-url', {
          project_id: projectId,
          files: [
            {
              file_name: file.name,
              file_type: fileType,
              file_size: file.size,
              file_x: file.width,
              file_y: file.height,
            },
          ],
        });
        const files = response.data.content.files;
        console.log(files);
        console.log(files[0]);
        const presigned_url = files[0].presigned_url;
        const public_url = files[0].public_url;

        const uploadResponse = await fetch(presigned_url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': fileType,
          },
        });

        if (!uploadResponse.ok) {
          setError('파일 업로드에 실패했습니다.');
          return;
        }

        // 이미지 파일인 경우에만 미리보기 생성
        if (fileType.startsWith('image/')) {
          const previewUrl = URL.createObjectURL(file);
          setPreviewUrl(previewUrl);
        } else {
          setPreviewUrl(null);
        }

        onImageSelect(public_url);
      } else {
        setError(
          '지원되지 않는 파일 형식입니다. (이미지, PDF, DWG 파일만 가능)',
        );
        setPreviewUrl(null);
        setFileName(null);
        onImageSelect(null);
      }
    }
  };

  return (
    <div>
      <div className="mb-2">업로드</div>
      <label className="cursor-pointer block">
        <div className="border border-gray-200 rounded-md mb-2 p-2 bg-blue-100 text-center hover:bg-blue-200 transition-colors">
          {fileName ? '파일 변경' : '블루프린트 선택'}
        </div>
        <input
          type="file"
          accept="image/*,.pdf,.dwg"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {fileName && !previewUrl && (
        <div className="mb-2 text-center">
          <p className="text-gray-600">{fileName}</p>
        </div>
      )}

      {previewUrl && (
        <div className="mb-2">
          <img
            src={previewUrl}
            alt="미리보기"
            className="max-w-full h-auto rounded-md"
          />
        </div>
      )}

      {error ? (
        <div className="text-red-500 text-center text-sm">{error}</div>
      ) : (
        <div className="text-center text-sm text-gray-600">
          이미지, PDF, DWG 파일을 업로드할 수 있습니다.
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
