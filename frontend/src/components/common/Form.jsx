import React from 'react';
import { useRecoilState } from 'recoil';
import { modalState } from '../../recoil/common/modal';

const Form = () => {
  const [modal, setModal] = useRecoilState(modalState);

  if (!modal || modal.type !== 'modal') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg min-w-[300px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{modal.title}</h2>
          <button onClick={() => setModal(null)} className="text-red-500">
            X
          </button>
        </div>
        <div>{modal.content}</div>
      </div>
    </div>
  );
};

export default Form;
