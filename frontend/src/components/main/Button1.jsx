import React from 'react';
import { motion } from 'framer-motion'; // framer-motion import
import ImgB1Blueprint from '../../assets/images/ImgB1Blueprint.svg';
import ImgB1Note from '../../assets/images/ImgB1Note.svg';
import ImgB1Notelist from '../../assets/images/ImgB1Notelist.svg';
import ImgB1Pin1 from '../../assets/images/ImgB1Pin1.svg';
import ImgB1Pin2 from '../../assets/images/ImgB1Pin2.svg';

const Button1 = () => {
  return (
    <div className="relative w-full h-full bg-white border border-gray-300 rounded-md overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 flex justify-center items-center">
        <img
          src={ImgB1Blueprint}
          alt="Blueprint Background"
          className="w-[90%] h-[90%] object-contain"
        />
      </div>

      {/* 이미지 창 */}
      <div className="absolute inset-0 flex justify-between items-center">
        {/* 왼쪽 이미지 (Notelist) */}
        <motion.div
          className="relative w-48 h-48"
          initial={{ top: '5rem', left: '3rem' }} // 초기 위치
          animate={{ top: '-6rem', left: '3rem' }} // 이동 위치
          transition={{
            duration: 3, // 애니메이션 지속 시간 (3초)
            ease: 'easeInOut',
          }}
        >
          <img
            src={ImgB1Notelist}
            alt="Notelist"
            className="absolute w-full h-full object-contain z-0"
          />
        </motion.div>

        {/* 핀 이미지 */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <img
            src={ImgB1Pin1}
            alt="Pin1"
            className="absolute object-contain z-5"
            style={{
              width: '20%',
              height: '20%',
              top: '-1.25rem',
              left: '-5rem',
            }}
          />
          <img
            src={ImgB1Pin2}
            alt="Pin2"
            className="absolute object-contain z-5"
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
          initial={{ top: '-5rem', right: '2.5rem' }} // 초기 위치
          animate={{ top: '8rem', right: '2.5rem' }} // 이동 위치
          transition={{
            duration: 3, // 애니메이션 지속 시간 (3초)
            ease: 'easeInOut',
          }}
        >
          <img
            src={ImgB1Note}
            alt="Note"
            className="absolute w-full h-full object-contain z-10"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Button1;
