import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackIcon from '../../assets/icons/BackButton.svg'; // BackButton.svg 아이콘

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <button
      onClick={handleBack}
      className="fixed bottom-4 left-4 z-50 flex items-center justify-center w-12 h-12 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full transition-opacity"
      aria-label="Back"
    >
      <img
        src={BackIcon}
        alt="Back"
        className="w-6 h-6 opacity-80 hover:opacity-100"
      />
    </button>
  );
};

export default BackButton;
