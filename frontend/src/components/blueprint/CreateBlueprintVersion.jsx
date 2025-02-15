import React, { useState } from 'react';
import { post } from '../../api';
import ImageUploader from '../common/ImageUploader';
import TextButton from '../common/TextButton';
import { useSetRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';
import { useToast } from '@/hooks/use-toast';

const CreateBlueprintVersion = ({
  blueprintVersionNumber,
  projectId,
  blueprintId,
  blueprints,
  setBlueprints,
  refetchBlueprints,
}) => {
  const setModal = useSetRecoilState(modalState);
  const [blueprintTitle, setBlueprintTitle] = useState(
    `시안 ${Number(blueprintVersionNumber) + 1}`,
  );

  const [selectedImage, setSelectedImage] = useState(null);
  const { toast } = useToast(20);

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
        blueprint_version_name: blueprintTitle,
        origin_file: selectedImage,
      });

      setBlueprints((prevBlueprints) => {
        return [
          {
            ...response.data.content.blueprint_version,
          },
          ...prevBlueprints,
        ];
      });

      // console.log(
      //   '블루프린트 버전 생성 성공:',
      //   response.data.content.blueprint_version.blueprint_version_id,
      // );
      const newVersionId =
        response.data.content.blueprint_version.blueprint_version_id;

      await refetchBlueprints();

      toast({
        title: '블루프린트 버전 생성에 성공했습니다.',
        description: String(new Date()),
      });
      setModal(null);

      window.location.href = `/projects/${projectId}/blueprints/${blueprintId}/${newVersionId}`;
    } catch (error) {
      console.error('블루프린트 생성 실패:', error);
    }
  };

  return (
    <div className="p-4 w-full">
      <form>
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
          <TextButton
            type="submit"
            disabled={!blueprintTitle.trim() || !selectedImage}
            onClick={handleSubmit}
          >
            완료
          </TextButton>
        </div>
      </form>
    </div>
  );
};

export default CreateBlueprintVersion;
