import React, { useState } from 'react';
import { post } from '../../api';
import ImageUploader from '../common/ImageUploader';
import TextButton from '../common/TextButton';
import { useRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';
import { useParams } from 'react-router-dom';

const CreateBlueprint = ({ setBlueprints }) => {
  const [modal, setModal] = useRecoilState(modalState);
  const { projectId } = useParams();
  const [blueprintTitle, setBlueprintTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleInputChange = (event) => {
    setBlueprintTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('blueprint_title', blueprintTitle);
      if (selectedImage) {
        formData.append('origin_file', selectedImage);
      }

      const response = await post(
        `projects/${projectId}/blueprints`,
        {
          blueprint_title: blueprintTitle,
          origin_file: selectedImage,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log(response.data.content.blueprint);

      setBlueprints((prevBlueprints) => [
        {
          ...response.data.content.blueprint,
          blueprint_id: Number(response.data.content.blueprint.blueprint_id),
          latest_version_id: Number(
            response.data.content.blueprint.latest_version_id,
          ),
        },
        ...prevBlueprints, // 기존 배열을 뒤에 붙임
      ]);

      console.log('블루프린트 생성 성공:', response.data);
      console.log('url : ', selectedImage);
      console.log('--', selectedImage);

      alert('생성 완료');
      setModal(null);
    } catch (error) {
      console.error('블루프린트 생성 실패:', error);
    }
  };

  return (
    <div className="p-4 w-full">
      <div>
        <div className="mb-2">이름</div>
        <div className="border border-gray-200 mb-8 rounded-md p-2 flex flex-wrap gap-2 min-h-[40px] items-center">
          <input
            type="text"
            value={blueprintTitle}
            onChange={handleInputChange}
            placeholder="블루프린트 이름을 입력하세요."
            className="w-auto flex-grow border-none focus:ring-0 outline-none text-sm p-1"
          />
        </div>
      </div>
      <ImageUploader onImageSelect={setSelectedImage} projectId={projectId} />
      <div className="flex justify-end">
        <TextButton
          type="submit"
          disabled={!blueprintTitle.trim() || !selectedImage}
          onClick={handleSubmit}
        >
          완료
        </TextButton>
      </div>
    </div>
  );
};

export default CreateBlueprint;
