import React from 'react';
import { motion } from 'framer-motion'; // framer-motion import
import ImgB4Blueprint from '../../assets/images/ImgB4Blueprint.svg';
import ImgB4Note from '../../assets/images/ImgB4Note.svg';
import ImgB4Notelist from '../../assets/images/ImgB4Notelist.svg';
import ImgB4Pin1 from '../../assets/images/ImgB4Pin1.svg';
import ImgB4Pin2 from '../../assets/images/ImgB4Pin2.svg';

const Button4 = () => {
  return (
    <div className="relative w-full h-full bg-white border border-gray-300 rounded-md overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 flex justify-center items-center">
        <img
          src={ImgB4Blueprint}
          alt="Blueprint Background"
          className="w-[90%] h-[90%] object-contain"
        />
      </div>

      {/* 이미지 창 */}
      <div className="absolute inset-0 flex justify-between items-center">
        {/* 왼쪽 이미지 (Notelist) */}
        <motion.div
          className="relative w-48 h-48"
          initial={{ top: '5rem', left: '3rem' }} // 초기 위치 조정 (오른쪽으로 이동)
          animate={{ top: '-6rem', left: '3rem' }} // 애니메이션 종료 시 왼쪽으로 이동
          transition={{
            duration: 3, // 애니메이션 지속 시간 (3초)
            ease: 'easeInOut',
            repeat: Infinity, // 반복 설정
            repeatType: 'loop', // 반복 시 초기 상태로 돌아감
            delay: 1, // 반복 전 대기 시간
          }}
        >
          <img
            src={ImgB4Notelist}
            alt="Notelist"
            className="absolute w-full h-full object-contain z-0"
          />
        </motion.div>

        {/* 핀 이미지 */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <img
            src={ImgB4Pin1}
            alt="Pin1"
            className="absolute object-contain z-10"
            style={{
              width: '20%',
              height: '20%',
              top: '-1.25rem',
              left: '-5rem',
            }}
          />
          <img
            src={ImgB4Pin2}
            alt="Pin2"
            className="absolute object-contain z-10"
            style={{
              width: '20%',
              height: '20%',
              bottom: '-0.5rem',
              right: '-8rem',
            }}
          />
        </div>

        {/* 오른쪽 이미지 (Note) */}
        <motion.div
          className="relative w-48 h-48"
          initial={{ top: '-5rem', right: '2.5rem' }} // 초기 위치 조정 (왼쪽으로 이동)
          animate={{ top: '8rem', right: '2.5rem' }} // 애니메이션 종료 시 오른쪽으로 이동
          transition={{
            duration: 3, // 애니메이션 지속 시간 (3초)
            ease: 'easeInOut',
            repeat: Infinity, // 반복 설정
            repeatType: 'loop', // 반복 시 초기 상태로 돌아감
            delay: 1, // 반복 전 대기 시간
          }}
        >
          <img
            src={ImgB4Note}
            alt="Note"
            className="absolute w-full h-full object-contain z-10"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Button4;
