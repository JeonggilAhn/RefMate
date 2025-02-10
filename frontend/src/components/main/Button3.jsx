import React, { useState, useEffect } from 'react';
import ImgB3BluePrintNow from '../../assets/images/ImgB3BluePrintNow.svg';
import ImgB3BluePrintPrev from '../../assets/images/ImgB3BluePrintPrev.svg';

const Button3 = () => {
  const [showPrev, setShowPrev] = useState(false); // Prev 이미지 표시 여부

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPrev((prev) => !prev); // Prev 표시/숨김 상태 토글
    }, 2000); // 2초 간격

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 클리어
  }, []);

  return (
    <div className="relative w-full h-full bg-white border border-gray-300 rounded-md overflow-hidden">
      {/* Now 이미지 (항상 표시) */}
      <div className="absolute inset-0 z-10">
        <img
          src={ImgB3BluePrintNow}
          alt="Blueprint Now"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Prev 이미지 (조건부 표시) */}
      {showPrev && (
        <div className="absolute inset-0 z-20">
          <img
            src={ImgB3BluePrintPrev}
            alt="Blueprint Prev"
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default Button3;
