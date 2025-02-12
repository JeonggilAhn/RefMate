import React, { useState } from 'react';
import { post } from '../../api';
import ImageUploader from '../common/ImageUploader';
import { useParams } from 'react-router-dom';

const CreateBlueprintVersion = ({
  setModal,
  projectId,
  blueprintId,
  blueprints,
  setBlueprints,
  refetchBlueprints,
}) => {
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

      const response = await post(`blueprints/${blueprintId}`, {
        blueprint_title: blueprintTitle,
        origin_file: selectedImage,
      });

      const newBlueprint = {
        blueprint_version_id: response.data.content.blueprint_version_id,
        blueprint_version_name: blueprintTitle,
        preview_image: selectedImage,
        created_at: new Date(),
        index: blueprints.length - 1,
        blueprint_version_seq: null,
      };

      setBlueprints((prevBlueprints) => {
        return [
          {
            ...newBlueprint,
          },
          ...prevBlueprints,
        ];
      });

      console.log('블루프린트 버전 생성 성공:', response.data);
      await refetchBlueprints();

      alert('생성 완료');
      setModal(null);
    } catch (error) {
      console.error('블루프린트 생성 실패:', error);
    }
  };

  return (
    <div className="p-4 w-150">
      <form onSubmit={handleSubmit}>
        <div>
          <div className="mb-2">
            <label htmlFor="blueprintTitle">이름</label>
          </div>
          <div className="border border-gray-200 mb-8 rounded-md p-2 flex flex-wrap gap-2 min-h-[40px] items-center">
            <input
              type="text"
              id="blueprintTitle"
              value={blueprintTitle}
              onChange={handleInputChange}
              placeholder="블루프린트 이름을 입력하세요."
              className="w-auto flex-grow border-none focus:ring-0 outline-none text-sm p-1"
            />
          </div>
        </div>

        <ImageUploader onImageSelect={setSelectedImage} projectId={projectId} />

        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-4 py-2 mt-2 text-white rounded ${
              blueprintTitle.trim() && selectedImage
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 cursor-not-allowed opacity-50'
            }`}
            disabled={!blueprintTitle.trim() || !selectedImage}
          >
            완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlueprintVersion;
