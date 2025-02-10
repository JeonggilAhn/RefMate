import React, { useState, useEffect } from 'react';
import ImgB4ProjectList from '../../assets/images/ImgB4ProjectList.svg';
import ImgB4VersionList from '../../assets/images/ImgB4VersionList.svg'; // VersionList 이미지 추가

import ImgB4Version1 from '../../assets/images/ImgB4Version1.svg';
import ImgB4Version2 from '../../assets/images/ImgB4Version2.svg';
import ImgB4Version3 from '../../assets/images/ImgB4Version3.svg';
import ImgB4Version4 from '../../assets/images/ImgB4Version4.svg';
import ImgB4Version5 from '../../assets/images/ImgB4Version5.svg';

const Button4 = () => {
  const [offsetY, setOffsetY] = useState(0); // Y축 이동값

  const versions = [
    ImgB4Version1,
    ImgB4Version2,
    ImgB4Version3,
    ImgB4Version4,
    ImgB4Version5,
    ImgB4Version2,
    ImgB4Version3,
    ImgB4Version4,
    ImgB4Version5,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setOffsetY((prevY) =>
        prevY >= (versions.length - 4) * 25 ? 0 : prevY + 25,
      ); // 마지막 위치에서 다시 처음으로 초기화
    }, 2000); // 2초마다 한 칸씩 이동

    return () => clearInterval(interval);
  }, [versions.length]);

  return (
    <div className="relative w-full h-full bg-white border border-gray-300 rounded-md overflow-hidden flex pl-6">
      {/* 왼쪽 프로젝트 리스트 */}
      <div className="w-full h-full">
        <img
          src={ImgB4ProjectList}
          alt="Project List"
          className="w-full h-full object-contain"
        />
      </div>

      {/* 오른쪽 버전 리스트 */}
      <div className="w-5/12 h-full flex items-center justify-center relative">
        <div className="absolute w-[80%] h-[80%]">
          {/* VersionList 테두리 유지 */}

          <img
            src={ImgB4VersionList}
            alt="Version List Background"
            className="absolute w-full h-full object-contain"
          />
          <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
            {/* 슬라이드 컨테이너 */}
            <div className="absolute h-full overflow-hidden flex items-center justify-center">
              <div
                className="relative h-full transition-transform duration-1000 ease-in-out"
                style={{
                  transform: `translateY(-${offsetY}%)`, // Y축 이동값 적용
                }}
              >
                {versions.map((version, index) => (
                  <div
                    key={index}
                    className="w-full flex items-center justify-center mb-4 last:mb-0"
                    style={{
                      height: '25%', // 슬라이드 높이 조정
                      boxSizing: 'border-box', // 컨테이너 벗어남 방지
                    }}
                  >
                    <img
                      src={version}
                      alt={`Version ${index + 1}`}
                      className="w-[70%] h-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Button4;
