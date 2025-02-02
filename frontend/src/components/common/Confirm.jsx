import React from 'react';
import { useRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';

const Confirm = () => {
  const [modal, setModal] = useRecoilState(modalState);

  if (!modal || modal.type !== 'confirm') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg min-w-[300px]">
        <div className="mb-4">{modal.message}</div>
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => {
              modal.onConfirm();
              setModal(null);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            확인
          </button>
          <button
            onClick={() => setModal(null)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
