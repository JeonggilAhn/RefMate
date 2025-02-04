import React, { useState, useEffect } from 'react';
import Close from '../../assets/icons/Close.svg';
import { get } from '../../api';

const BlueprintVersions = ({ blueprintId, blueprintTitle, closeModal }) => {
  const [versions, setVersions] = useState([]);
  console.log(blueprintTitle);
  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await get(`blueprints/${blueprintId}`);

        // 시간 내림차순
        const sortedVersions = response.data.content.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        setVersions(sortedVersions);
      } catch (error) {
        console.error('API 호출 오류:', error);
      }
    };

    fetchVersions();
  }, [blueprintId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 ">
      <div className="h-[40rem] w-[60rem] bg-white p-4 relative border">
        <div className="flex justify-between border mb-4">
          <h2 className="text-left">{blueprintTitle}</h2>
          <button onClick={closeModal}>
            <img src={Close} alt="닫기" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="border flex relative">
            <div className="aspect-[4/3]">
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                +
              </div>
            </div>
            <div className="absolute bottom-0 left-0">새 블루프린트 업로드</div>
          </div>
          {versions.map((version) => (
            <div key={version.blueprint_version_id} className="p-2 border">
              <div className="flex flex-col">
                <img
                  src={version.preview_image}
                  alt={version.blueprint_version_name}
                  className="mb-2 aspect-[4/3]"
                />
                <div className="flex justify-between">
                  <div>{version.blueprint_version_name}</div>
                  <div>{new Date(version.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlueprintVersions;
