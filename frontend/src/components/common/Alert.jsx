import React from 'react';
import { useRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';

const Alert = () => {
  const [modal, setModal] = useRecoilState(modalState);

  if (!modal || modal.type !== 'alert') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg min-w-[300px]">
        <div className="mb-4">{modal.message}</div>
        <button
          onClick={() => setModal(null)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default Alert;
